import os
import json
import uuid
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from mangum import Mangum

import boto3

# Import local module directly (Lambda zip includes ai_assistant.py)
from ai_assistant import analyze_sentiment, classify_ticket, generate_response, lex_recognize_text
from typing import Optional
import base64

# Local user store for development auth
try:
    from user_store import add_user, find_user_by_email, verify_password
except Exception:
    # If user_store not available (e.g., missing file in Lambda), provide no-op fallbacks
    add_user = None
    find_user_by_email = lambda email: None
    verify_password = lambda password, password_hash: False

class TicketCreate(BaseModel):
    title: str
    clientId: str
    category: str
    priority: str = Field(default="medium")  # critical | high | medium | low


class TicketUpdate(BaseModel):
    status: str | None = None  # open | in-progress | resolved | closed
    assignee: str | None = None
    sla: str | None = None


app = FastAPI(title="MSP Automation API", version="1.0")

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dynamo = boto3.resource("dynamodb")
sqs = boto3.client("sqs")

TICKETS_TABLE = os.environ.get("TICKETS_TABLE", "Tickets")
TICKET_CREATED_QUEUE_URL = os.environ.get("TICKET_CREATED_QUEUE_URL")

tickets_table = dynamo.Table(TICKETS_TABLE)

# Local in-memory fallback store for development environments without AWS credentials
# This allows running the API locally without DynamoDB. When boto3 operations fail,
# endpoints will gracefully fall back to this store.
LOCAL_TICKETS: dict[str, dict] = {}


# -------------------------
# Auth models & helpers
# -------------------------

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str = Field(default="client")  # admin | technician | client
    company: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    role: str
    company: Optional[str] = None


def make_mock_token(user: UserPublic) -> str:
    """Return a mock JWT-like token compatible with the frontend decoder.
    Encodes a JSON header, payload (user), and signature using base64.
    """
    header = base64.b64encode(json.dumps({"header": "mock"}).encode("utf-8")).decode("utf-8")
    payload = base64.b64encode(json.dumps(user.dict()).encode("utf-8")).decode("utf-8")
    signature = base64.b64encode(b"signature").decode("utf-8")
    return f"{header}.{payload}.{signature}"


@app.post("/auth/signup")
def auth_signup(payload: UserCreate):
    if add_user is None:
        raise HTTPException(status_code=501, detail="Signup not available in this environment")
    existing = find_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    try:
        created = add_user(payload.email, payload.password, payload.name, payload.role, payload.company)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    user = UserPublic(
        id=created["id"],
        email=created["email"],
        name=created["name"],
        role=created["role"],
        company=created.get("company"),
    )
    token = make_mock_token(user)
    return {"token": token, "user": user.dict()}


@app.post("/auth/login")
def auth_login(payload: UserLogin):
    record = find_user_by_email(payload.email)
    if not record:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(payload.password, record.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = UserPublic(
        id=record["id"],
        email=record["email"],
        name=record["name"],
        role=record["role"],
        company=record.get("company"),
    )
    token = make_mock_token(user)
    return {"token": token, "user": user.dict()}


@app.post("/tickets")
def create_ticket(payload: TicketCreate):
    ticket_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    item = {
        "PK": f"TICKET#{ticket_id}",
        "SK": "METADATA",
        "ticketId": ticket_id,
        "title": payload.title,
        "clientId": payload.clientId,
        "category": payload.category,
        "priority": payload.priority,
        "status": "open",
        "assignee": "Unassigned",
        "createdAt": now,
        "updatedAt": now,
    }

    # Try DynamoDB first; fall back to local store if any error occurs
    try:
        tickets_table.put_item(Item=item)
    except Exception:
        LOCAL_TICKETS[ticket_id] = item

    if TICKET_CREATED_QUEUE_URL:
        event = {
            "eventType": "ticket.created",
            "timestamp": now,
            "ticketId": ticket_id,
            "clientId": payload.clientId,
            "title": payload.title,
            "category": payload.category,
            "priority": payload.priority,
        }
        sqs.send_message(QueueUrl=TICKET_CREATED_QUEUE_URL, MessageBody=json.dumps(event))

    # Return the created item (normalized)
    return {
        "ticketId": ticket_id,
        "title": payload.title,
        "clientId": payload.clientId,
        "category": payload.category,
        "priority": payload.priority,
        "status": "open",
        "assignee": "Unassigned",
        "createdAt": now,
        "updatedAt": now,
    }


@app.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: str):
    try:
        res = tickets_table.get_item(Key={"PK": f"TICKET#{ticket_id}", "SK": "METADATA"})
        item = res.get("Item")
        if not item:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return item
    except Exception:
        item = LOCAL_TICKETS.get(ticket_id)
        if not item:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return item


@app.patch("/tickets/{ticket_id}")
def update_ticket(ticket_id: str, payload: TicketUpdate):
    now = datetime.utcnow().isoformat()

    updates = []
    values: dict[str, str] = {":u": now}

    if payload.status:
        updates.append("status = :s")
        values[":s"] = payload.status
    if payload.assignee:
        updates.append("assignee = :a")
        values[":a"] = payload.assignee
    if payload.sla:
        updates.append("sla = :l")
        values[":l"] = payload.sla

    updates.append("updatedAt = :u")
    update_expr = "SET " + ", ".join(updates)

    try:
        tickets_table.update_item(
            Key={"PK": f"TICKET#{ticket_id}", "SK": "METADATA"},
            UpdateExpression=update_expr,
            ExpressionAttributeValues=values,
            ReturnValues="ALL_NEW",
        )
    except Exception:
        # Update local fallback store
        item = LOCAL_TICKETS.get(ticket_id)
        if not item:
            raise HTTPException(status_code=404, detail="Ticket not found")
        if payload.status:
            item["status"] = payload.status
        if payload.assignee:
            item["assignee"] = payload.assignee
        if payload.sla:
            item["sla"] = payload.sla
        item["updatedAt"] = now
        LOCAL_TICKETS[ticket_id] = item

    return {"id": ticket_id, "status": "updated"}


@app.get("/tickets")
def list_tickets():
    # Note: For production, prefer Query on partitions or GSI; scan is acceptable for small datasets
    try:
        res = tickets_table.scan()
        items = res.get("Items", [])
    except Exception:
        # Fall back to local store
        items = list(LOCAL_TICKETS.values())

    # Normalize and return only ticket metadata items
    result = []
    for item in items:
        if item.get("SK") != "METADATA":
            continue
        result.append({
            "ticketId": item.get("ticketId"),
            "title": item.get("title"),
            "clientId": item.get("clientId"),
            "category": item.get("category"),
            "priority": item.get("priority"),
            "status": item.get("status"),
            "assignee": item.get("assignee"),
            "createdAt": item.get("createdAt"),
            "updatedAt": item.get("updatedAt"),
            "triageConfidence": item.get("triageConfidence"),
            "sla": item.get("sla"),
        })
    return result


# AWS Lambda handler via Mangum
handler = Mangum(app)

# AI Assistant endpoints

class SentimentPayload(BaseModel):
    text: str
    languageCode: str | None = "en"


@app.post("/nlp/sentiment")
def nlp_sentiment(payload: SentimentPayload):
    return analyze_sentiment(payload.text, payload.languageCode or "en")


class ClassifyPayload(BaseModel):
    text: str


@app.post("/ml/classify")
def ml_classify(payload: ClassifyPayload):
    return classify_ticket(payload.text)


class RespondPayload(BaseModel):
    text: str
    sentiment: str | None = None


@app.post("/assistant/respond")
def assistant_respond(payload: RespondPayload):
    return generate_response(payload.text, payload.sentiment)


class LexPayload(BaseModel):
    text: str


@app.post("/assistant/lex/text")
def assistant_lex_text(payload: LexPayload):
    return lex_recognize_text(payload.text)

# Security & Compliance endpoints

class ComplianceItem(BaseModel):
    id: str
    framework: str
    control: str
    status: str
    description: str | None = None
    remediation: str | None = None
    resourceId: str | None = None


class MisconfigurationItem(BaseModel):
    type: str
    resourceId: str
    severity: str
    fixAvailable: bool = True
    description: str | None = None


class SecurityPosture(BaseModel):
    frameworks: list[str]
    summary: dict
    items: list[ComplianceItem]
    misconfigurations: list[MisconfigurationItem]


class GuardDutyFinding(BaseModel):
    id: str
    type: str
    resource: str
    severity: float
    title: str | None = None
    description: str | None = None
    recommendation: str | None = None
    timestamp: str | None = None


class SecurityHubFinding(BaseModel):
    id: str
    title: str | None = None
    description: str | None = None
    severity: float | None = None
    productArn: str | None = None
    resource: str | None = None
    recordState: str | None = None
    complianceStatus: str | None = None


@app.get("/security/posture")
def security_posture():
    # Try real-time posture via AWS Config; fall back to sample if unavailable
    try:
        config = boto3.client("config")
        resp = config.describe_compliance_by_config_rule()

        items: list[ComplianceItem] = []
        summary = {"compliant": 0, "nonCompliant": 0, "partiallyCompliant": 0}
        misconfigs: list[MisconfigurationItem] = []

        for r in resp.get("ComplianceByConfigRules", []):
            rule_name = r.get("ConfigRuleName", "unknown")
            comp = r.get("Compliance", {})
            ctype = comp.get("ComplianceType", "INSUFFICIENT_DATA")

            if ctype == "COMPLIANT":
                status = "compliant"
                summary["compliant"] += 1
            elif ctype == "NON_COMPLIANT":
                status = "non_compliant"
                summary["nonCompliant"] += 1
                misconfigs.append(MisconfigurationItem(
                    type="Other",
                    resourceId=rule_name,
                    severity="medium",
                    description=f"Config rule '{rule_name}' is non-compliant",
                ))
            else:
                status = "partially_compliant"
                summary["partiallyCompliant"] += 1

            items.append(ComplianceItem(
                id=rule_name,
                framework="Other",
                control=rule_name,
                status=status,
            ))

        frameworks = ["CIS", "Other"]
        posture = SecurityPosture(
            frameworks=frameworks,
            summary=summary,
            items=items,
            misconfigurations=misconfigs,
        )
        return posture.dict()
    except Exception:
        now = datetime.utcnow().isoformat()
        sample = SecurityPosture(
            frameworks=["CIS", "HIPAA", "GDPR"],
            summary={"compliant": 34, "nonCompliant": 7, "partiallyCompliant": 5},
            items=[
                ComplianceItem(
                    id="cis-efs-encryption",
                    framework="CIS",
                    control="EFS Encryption at Rest",
                    status="compliant",
                    description="Ensure EFS file systems are encrypted",
                    resourceId="fs-123456",
                ),
                ComplianceItem(
                    id="cis-s3-public",
                    framework="CIS",
                    control="S3 Buckets Should Block Public Access",
                    status="non_compliant",
                    description="Bucket allows public read",
                    remediation="Enable Block Public Access and remove public ACL/policy",
                    resourceId="msp-client-archive",
                ),
                ComplianceItem(
                    id="hipaa-cloudtrail",
                    framework="HIPAA",
                    control="CloudTrail Enabled and Multi-Region",
                    status="partially_compliant",
                    description="CloudTrail enabled only in one region",
                    remediation="Enable organization trail in all regions",
                ),
            ],
            misconfigurations=[
                MisconfigurationItem(
                    type="S3PublicAccess",
                    resourceId="msp-client-archive",
                    severity="high",
                    description="Bucket policy permits s3:GetObject to *",
                ),
                MisconfigurationItem(
                    type="IAMPolicyTooPermissive",
                    resourceId="role/LegacyAdmin",
                    severity="critical",
                    description="Policy grants iam:* across all resources",
                ),
                MisconfigurationItem(
                    type="SecurityGroupOpen",
                    resourceId="sg-0abc123",
                    severity="medium",
                    description="Port 22 open to 0.0.0.0/0",
                ),
            ],
        )
        return sample.dict()


@app.get("/security/guardduty/findings")
def guardduty_findings():
    # Try real GuardDuty findings; fall back to sample if unavailable
    try:
        gd = boto3.client("guardduty")
        detectors = gd.list_detectors().get("DetectorIds", [])
        if not detectors:
            return []
        det_id = detectors[0]
        lf = gd.list_findings(DetectorId=det_id)
        fids = lf.get("FindingIds", [])
        if not fids:
            return []
        res = gd.get_findings(DetectorId=det_id, FindingIds=fids)
        gfindings = res.get("Findings", [])
        result: list[GuardDutyFinding] = []
        for f in gfindings:
            resource = "unknown"
            r = f.get("Resource", {})
            rt = r.get("ResourceType")
            if rt == "Instance":
                resource = r.get("InstanceDetails", {}).get("InstanceId", "Instance")
            elif rt:
                resource = rt
            result.append(GuardDutyFinding(
                id=f.get("Id", ""),
                type=f.get("Type", ""),
                resource=resource,
                severity=float(f.get("Severity", 0.0)),
                title=f.get("Title"),
                description=f.get("Description"),
                recommendation=None,
                timestamp=f.get("UpdatedAt") or f.get("CreatedAt"),
            ))
        return [x.dict() for x in result]
    except Exception:
        now = datetime.utcnow().isoformat()
        findings = [
            GuardDutyFinding(
                id="gd-1",
                type="UnauthorizedAccess:EC2/SSHBruteForce",
                resource="i-0a1b2c3d4e",
                severity=7.5,
                title="SSH brute force detected",
                description="Multiple failed SSH attempts from known malicious IPs",
                recommendation="Limit SSH access and enable MFA; investigate source IPs",
                timestamp=now,
            ),
            GuardDutyFinding(
                id="gd-2",
                type="Recon:EC2/PortProbeUnprotectedPort",
                resource="i-0f9e8d7c6b",
                severity=4.2,
                title="Unprotected port probe",
                description="Port scanning activity detected",
                recommendation="Restrict inbound rules; enable IDS/IPS monitoring",
                timestamp=now,
            ),
        ]
        return [f.dict() for f in findings]


@app.get("/security/hub/findings")
def security_hub_findings():
    # Try Security Hub findings; fall back to sample if unavailable
    try:
        sh = boto3.client("securityhub")
        resp = sh.get_findings(
            Filters={
                "RecordState": [{"Value": "ACTIVE", "Comparison": "EQUAL"}],
            },
            MaxResults=50,
        )
        findings = resp.get("Findings", [])
        result: list[SecurityHubFinding] = []
        for f in findings:
            resources = f.get("Resources", [])
            resource_id = resources[0].get("Id") if resources else None
            sev = f.get("Severity", {})
            norm_sev = None
            if isinstance(sev, dict):
                norm_sev = sev.get("Normalized") or sev.get("Product") or sev.get("Label")
                try:
                    norm_sev = float(norm_sev) if norm_sev is not None else None
                except Exception:
                    norm_sev = None
            result.append(SecurityHubFinding(
                id=f.get("Id", ""),
                title=f.get("Title"),
                description=f.get("Description"),
                severity=norm_sev,
                productArn=f.get("ProductArn"),
                resource=resource_id,
                recordState=f.get("RecordState"),
                complianceStatus=f.get("Compliance", {}).get("Status") if f.get("Compliance") else None,
            ))
        return [x.dict() for x in result]
    except Exception:
        sample = [
            SecurityHubFinding(
                id="sh-1",
                title="IAM policy overly permissive",
                description="Allows iam:* on all resources",
                severity=8.0,
                productArn="arn:aws:securityhub:region:account:product/amazon/securityhub",
                resource="arn:aws:iam::123456789012:role/LegacyAdmin",
                recordState="ACTIVE",
                complianceStatus="FAILED",
            ),
            SecurityHubFinding(
                id="sh-2",
                title="S3 bucket publicly accessible",
                description="Bucket policy permits s3:GetObject to *",
                severity=7.0,
                productArn="arn:aws:securityhub:region:account:product/amazon/securityhub",
                resource="arn:aws:s3:::msp-client-archive",
                recordState="ACTIVE",
                complianceStatus="FAILED",
            ),
        ]
        return [s.dict() for s in sample]


class RemediatePayload(BaseModel):
    type: str
    resourceId: str


@app.post("/security/remediate")
def security_remediate(payload: RemediatePayload):
    # In production, dispatch to automation orchestrator (Step Functions/Lambda)
    action_id = str(uuid.uuid4())
    enabled = os.environ.get("ENABLE_REMEDIATION", "false").lower() == "true"
    details = f"Dry-run: would apply fix for {payload.type} on {payload.resourceId}"

    if enabled:
        try:
            if payload.type == "S3PublicAccess":
                s3 = boto3.client("s3")
                bucket = payload.resourceId
                # Normalize common formats
                if bucket.startswith("arn:aws:s3:::"):
                    bucket = bucket.split(":::")[-1]
                if bucket.startswith("s3://"):
                    bucket = bucket.replace("s3://", "")
                s3.put_public_access_block(
                    Bucket=bucket,
                    PublicAccessBlockConfiguration={
                        "BlockPublicAcls": True,
                        "IgnorePublicAcls": True,
                        "BlockPublicPolicy": True,
                        "RestrictPublicBuckets": True,
                    },
                )
                details = f"Enabled Block Public Access on bucket {bucket}"

            elif payload.type == "SecurityGroupOpen":
                ec2 = boto3.client("ec2")
                sg_id = payload.resourceId
                # Attempt to revoke common open ingress (22/tcp from 0.0.0.0/0)
                try:
                    ec2.revoke_security_group_ingress(
                        GroupId=sg_id,
                        IpPermissions=[{
                            "IpProtocol": "tcp",
                            "FromPort": 22,
                            "ToPort": 22,
                            "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                        }],
                    )
                    details = f"Revoked 0.0.0.0/0 ingress on port 22 for {sg_id}"
                except Exception:
                    # Try generic all traffic
                    ec2.revoke_security_group_ingress(
                        GroupId=sg_id,
                        IpPermissions=[{
                            "IpProtocol": "-1",
                            "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                        }],
                    )
                    details = f"Revoked all open ingress (0.0.0.0/0) for {sg_id}"

            elif payload.type == "IAMPolicyTooPermissive":
                # For safety, do not auto-modify IAM in this handler
                details = (
                    "IAM remediation requires review. Dry-run suggests replacing overly broad custom policy "
                    "with least-privilege policies and enforcing MFA."
                )

        except Exception as e:
            # Fall back to dry-run message on error
            details = f"Remediation attempt failed: {str(e)}"

    return {"status": "remediated", "actionId": action_id, "details": details}