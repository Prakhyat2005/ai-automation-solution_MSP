# MSP Automation Platform — Serverless Architecture

## Overview
Event-driven, serverless backend using AWS Lambda, API Gateway (HTTP), SQS, and DynamoDB to minimize ops overhead while scaling with workload.

## Core Services
- API (`FastAPI` via `Mangum`): Creates, reads, and updates tickets; emits `ticket.created` to SQS.
- Triage Lambda: Consumes `ticket.created`, applies simple triage, updates ticket, emits `ticket.triaged`.
- Analytics Lambda: Consumes `ticket.created` and `ticket.triaged`, increments daily counters in DynamoDB.
- AI Assistant (Optional):
  - Sentiment analysis: Amazon Comprehend → adjust assistant tone and priority boost for frustrated users
  - Classification/Priority: Amazon SageMaker endpoint → continuous retraining from MSP feedback loops
  - Empathetic responses: Amazon Bedrock → dynamic style guide based on sentiment and context
  - Intent recognition: Amazon Lex → multi-intent natural language understanding; optional voice escalation

## Event Flow
1. Client requests `POST /tickets` → API writes to `Tickets` table and sends `ticket.created` to SQS.
2. Triage Lambda reads `ticket.created` → updates `assignee`, `sla` → sends `ticket.triaged`.
3. Analytics Lambda reads both queues → updates `Analytics` counters.

## Event Schemas
- `ticket.created`: `{ eventType, timestamp, ticketId, clientId, title, category, priority }`
- `ticket.triaged`: `{ eventType, ticketId, assignee, sla, triageConfidence }`
- `ticket.updated` (future): `{ eventType, ticketId, changedFields }`

## Data Model (DynamoDB)
- `Tickets` (single-table design):
  - PK: `TICKET#{ticketId}`
  - SK: `METADATA`
  - Attributes: `title`, `clientId`, `category`, `priority`, `status`, `assignee`, `sla`, `createdAt`, `updatedAt`, `triageConfidence`
- `Analytics`:
  - PK: `METRIC#{metric}` (e.g., `tickets_created`)
  - SK: `DATE#{YYYY-MM-DD}`
  - Attributes: `count`

## Deployment
Use Terraform to provision AWS resources and a simple build script to package Lambda code and dependencies.

### AI Assistant Enablement
- Provide `sagemaker_endpoint_name`, `bedrock_model_id`, and Lex bot IDs via Terraform variables
- API Lambda role includes permissions to call Comprehend, SageMaker, Bedrock, and Lex runtimes
- Bedrock JSON request body may vary by model; adjust `backend/ai_assistant.py` accordingly

## Notes & Next Steps
- Extend triage logic (e.g., rules engine, ML service).
- Add `ticket.updated` events from API on PATCH.
- Create CI to build artifacts and run `terraform plan/apply` with approvals.
- Integrate frontend flows to call sentiment + classification on ticket creation and craft empathetic responses in chat.
- Add feedback capture to update SageMaker training data and trigger retraining jobs.

## AWS AIOps and Generative AI Enhancements

To take the MSP Automation Platform to the next level of intelligence and scalability, the core AI features will be fundamentally enhanced using the AWS Artificial Intelligence Operations (AIOps) stack and Generative AI services.

- Generative AI for Tier-0 Resolution: The customized AI assistant will be built on Amazon Bedrock and leverage a Large Language Model (LLM) (e.g., Anthropic Claude or Amazon Titan) integrated with Knowledge Bases for Amazon Bedrock. This allows the assistant to search the client's internal knowledge base, historical tickets, and runbooks (RAG Architecture) to provide precise, step-by-step diagnostic and remediation guidance for complex issues, moving beyond simple empathetic responses to true Tier-0 resolution automation.

- MLOps for Continuous Improvement: The core ML models for Ticket Classification and Predictive Maintenance Anomaly Detection will be managed end-to-end using Amazon SageMaker. This implements a robust MLOps pipeline using SageMaker Pipelines to automate data preprocessing, continuous model training with new ticket and system data, evaluation, and deployment. This ensures the platform's intelligence constantly improves without manual intervention, delivering a reliable, state-of-the-art service.

- Proactive Issue Remediation: The anomaly detection feature will leverage Amazon Lookout for Metrics (for operational data monitoring) and Amazon Comprehend (for advanced sentiment and key phrase extraction from unstructured log/ticket data). Upon identifying an anomaly or a cluster of high-sentiment tickets, the system will automatically initiate the appropriate automation workflow, transforming the platform into a truly proactive and self-healing AIOps solution.

## IAM Policies for AI Modules

To enable the AI enhancements securely, provision least-privilege IAM policies for each service. Scope actions to specific resource ARNs and restrict `iam:PassRole` to approved roles.

- Bedrock Runtime and Knowledge Bases
  - `bedrock:InvokeModel`, `bedrock:InvokeModelWithResponseStream`
  - `bedrock:Retrieve`, `bedrock:RetrieveAndGenerate` (for Knowledge Bases)
  - Optional: `bedrock:ListKnowledgeBases`, `bedrock:GetKnowledgeBase` for controlled discovery
  - Data access: `s3:GetObject`, `s3:ListBucket` for KB data sources (scoped to KB buckets)

- SageMaker Pipelines and Endpoints
  - Pipelines: `sagemaker:CreatePipeline`, `sagemaker:UpdatePipeline`, `sagemaker:StartPipelineExecution`, `sagemaker:DescribePipeline`, `sagemaker:ListPipelines`
  - Training/Model: `sagemaker:CreateTrainingJob`, `sagemaker:CreateModel`, `sagemaker:CreateEndpointConfig`
  - Endpoints: `sagemaker:CreateEndpoint`, `sagemaker:UpdateEndpoint`, `sagemaker:DescribeEndpoint`, `sagemaker:InvokeEndpoint`
  - Supporting: `ecr:GetAuthorizationToken`, `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer`
  - Pass role: `iam:PassRole` limited to SageMaker execution role ARNs

- Lookout for Metrics
  - Detectors: `lookoutmetrics:CreateAnomalyDetector`, `lookoutmetrics:UpdateAnomalyDetector`, `lookoutmetrics:StartAnomalyDetector`, `lookoutmetrics:DescribeAnomalyDetector`, `lookoutmetrics:ListAnomalyDetectors`
  - Alerts: `lookoutmetrics:CreateAlert`, `lookoutmetrics:UpdateAlert`, `lookoutmetrics:ListAlerts`
  - Data integrations: `cloudwatch:GetMetricData`, `cloudwatch:ListMetrics` or `s3:GetObject`, `s3:ListBucket` for S3 metric sets
  - Access role for sources: `iam:PassRole` limited to Lookout data source role ARN

- Comprehend
  - Runtime: `comprehend:DetectSentiment`, `comprehend:DetectKeyPhrases`, `comprehend:DetectDominantLanguage`
  - Optional batch APIs as needed: `comprehend:BatchDetectSentiment`, etc.

- General Security Recommendations
  - Encrypt sensitive data with KMS; grant only required `kms:Encrypt`/`kms:Decrypt` to specific keys
  - Use resource-level constraints and condition keys (e.g., `aws:ResourceTag`, `s3:prefix`) to prevent broad access
  - Rotate credentials and use short-lived tokens for CI/CD provisioning
  - Log policy changes and API calls with CloudTrail; set alarms for anomalous activity