
# MSP Automation Platform

This project provides a frontend application and a serverless backend designed for MSP operations. The backend is event-driven and built on AWS Lambda, API Gateway (HTTP), SQS, and DynamoDB.

## AI Assistant Status
- AI features are optional and disabled by default if you don’t set the AI-related environment variables.
- Backend endpoints for sentiment, classification, empathetic responses, and Lex are available when configured.
- The frontend still falls back to mock behavior if `VITE_API_BASE_URL` is not configured.

## Serverless Backend
- FastAPI + Mangum for Lambda (`backend/app.py`)
- SQS consumers for triage and analytics (`backend/triage_handler.py`, `backend/analytics_handler.py`)
- Terraform IaC (`infra/terraform/*`) provisioning DynamoDB tables, SQS queues, Lambda functions, and HTTP API Gateway

### AI Assistant (Optional)
- Sentiment analysis via Amazon Comprehend (`POST /nlp/sentiment`)
- Ticket classification via Amazon SageMaker (`POST /ml/classify`)
- Empathy-driven responses via Amazon Bedrock (`POST /assistant/respond`)
- Intent recognition via Amazon Lex (`POST /assistant/lex/text`)

## Deploy to AWS
Prerequisites:
- `awscli` configured with appropriate credentials
- `terraform` (>= 1.5)
- Python 3.11 and `pip`

Steps:
1. Build Lambda packages:
   - `bash backend/build.sh`
2. Provision infrastructure:
   - `cd infra/terraform`
   - `terraform init`
   - `terraform apply`
3. Get API endpoint from outputs:
   - `http_api_endpoint` is the base URL

## Frontend Configuration
- Set `VITE_API_BASE_URL` in `.env.development` and `.env.production` to the HTTP API endpoint from Terraform outputs.
- Example: `VITE_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com`
- The frontend will fall back to local mock data if `VITE_API_BASE_URL` is unset.

### AI Assistant Environment (Lambda)
Set these Terraform variables before `apply` if you plan to enable AI assistant features:
- `sagemaker_endpoint_name`: SageMaker endpoint for ticket classification
- `bedrock_model_id`: Bedrock runtime model ID (e.g., `amazon.titan-text`) for empathetic responses
- `lex_bot_id`, `lex_bot_alias_id`, `lex_locale_id`: Lex V2 bot configuration

Permissions for Comprehend, SageMaker, Bedrock, and Lex are attached to the API Lambda role.

## API Endpoints
- `POST /tickets`: Create a ticket
- `GET /tickets/{ticketId}`: Fetch a ticket
- `PATCH /tickets/{ticketId}`: Update a ticket (status, assignee, sla)

## Configuration
Environment variables are set via Terraform:
- API Lambda: `TICKETS_TABLE`, `TICKET_CREATED_QUEUE_URL`
- Triage Lambda: `TICKETS_TABLE`, `TICKET_TRIAGED_QUEUE_URL`
- Analytics Lambda: `ANALYTICS_TABLE`

## Architecture Docs
See `docs/architecture.md` for event schemas, data model, and flow.

## AI Roadmap
- AIOps and Generative AI: The platform is being enhanced with AWS AIOps and Bedrock-based Generative AI.
- Tier-0 Resolution: Amazon Bedrock with Knowledge Bases (RAG) enables the assistant to use internal KBs, historical tickets, and runbooks for step-by-step diagnostics and remediation.
- Continuous MLOps: Amazon SageMaker Pipelines will automate preprocessing, training, evaluation, and deployment for ticket classification and anomaly detection models.
- Proactive Remediation: Amazon Lookout for Metrics monitors operational signals; Amazon Comprehend extracts sentiment and key phrases to trigger automation workflows for self-healing.
- Details: See “AWS AIOps and Generative AI Enhancements” in `docs/architecture.md`.
  