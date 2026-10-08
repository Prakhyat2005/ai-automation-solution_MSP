terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  project = var.project_name
}

# DynamoDB Tables
resource "aws_dynamodb_table" "tickets" {
  name         = "${local.project}-tickets"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "PK"
  range_key = "SK"

  attribute { name = "PK" type = "S" }
  attribute { name = "SK" type = "S" }
}

resource "aws_dynamodb_table" "analytics" {
  name         = "${local.project}-analytics"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "PK"
  range_key = "SK"

  attribute { name = "PK" type = "S" }
  attribute { name = "SK" type = "S" }
}

# SQS Queues
resource "aws_sqs_queue" "ticket_created" {
  name                      = "${local.project}-ticket-created"
  visibility_timeout_seconds = 30
}

resource "aws_sqs_queue" "ticket_triaged" {
  name                      = "${local.project}-ticket-triaged"
  visibility_timeout_seconds = 30
}

# IAM roles and policies
data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_api" {
  name               = "${local.project}-lambda-api-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role" "lambda_triage" {
  name               = "${local.project}-lambda-triage-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role" "lambda_analytics" {
  name               = "${local.project}-lambda-analytics-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

# Basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_api_basic" {
  role       = aws_iam_role.lambda_api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_triage_basic" {
  role       = aws_iam_role.lambda_triage.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_analytics_basic" {
  role       = aws_iam_role.lambda_analytics.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Access policies
data "aws_iam_policy_document" "api_access" {
  statement {
    actions   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem"]
    resources = [aws_dynamodb_table.tickets.arn]
  }
  statement {
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.ticket_created.arn]
  }
}

resource "aws_iam_policy" "api_access" {
  name   = "${local.project}-api-access"
  policy = data.aws_iam_policy_document.api_access.json
}

resource "aws_iam_role_policy_attachment" "api_access_attach" {
  role       = aws_iam_role.lambda_api.name
  policy_arn = aws_iam_policy.api_access.arn
}

# Additional permissions for AI assistant integrations
data "aws_iam_policy_document" "api_ai_access" {
  statement {
    actions   = ["comprehend:DetectSentiment"]
    resources = ["*"]
  }
  statement {
    actions   = ["sagemaker:InvokeEndpoint"]
    resources = ["*"]
  }
  statement {
    actions   = ["bedrock:InvokeModel"]
    resources = ["*"]
  }
  statement {
    actions   = ["lex:RecognizeText", "lex:RecognizeUtterance"]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "api_ai_access" {
  name   = "${local.project}-api-ai-access"
  policy = data.aws_iam_policy_document.api_ai_access.json
}

resource "aws_iam_role_policy_attachment" "api_ai_access_attach" {
  role       = aws_iam_role.lambda_api.name
  policy_arn = aws_iam_policy.api_ai_access.arn
}

data "aws_iam_policy_document" "triage_access" {
  statement {
    actions   = ["dynamodb:UpdateItem"]
    resources = [aws_dynamodb_table.tickets.arn]
  }
  statement {
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.ticket_triaged.arn]
  }
  statement {
    actions   = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
    resources = [aws_sqs_queue.ticket_created.arn]
  }
}

resource "aws_iam_policy" "triage_access" {
  name   = "${local.project}-triage-access"
  policy = data.aws_iam_policy_document.triage_access.json
}

resource "aws_iam_role_policy_attachment" "triage_access_attach" {
  role       = aws_iam_role.lambda_triage.name
  policy_arn = aws_iam_policy.triage_access.arn
}

data "aws_iam_policy_document" "analytics_access" {
  statement {
    actions   = ["dynamodb:UpdateItem"]
    resources = [aws_dynamodb_table.analytics.arn]
  }
  statement {
    actions   = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
    resources = [aws_sqs_queue.ticket_created.arn, aws_sqs_queue.ticket_triaged.arn]
  }
}

resource "aws_iam_policy" "analytics_access" {
  name   = "${local.project}-analytics-access"
  policy = data.aws_iam_policy_document.analytics_access.json
}

resource "aws_iam_role_policy_attachment" "analytics_access_attach" {
  role       = aws_iam_role.lambda_analytics.name
  policy_arn = aws_iam_policy.analytics_access.arn
}

# Lambda functions (package zips built by backend/build.sh)
resource "aws_lambda_function" "api" {
  function_name = "${local.project}-api"
  role          = aws_iam_role.lambda_api.arn
  handler       = "app.handler"
  runtime       = "python3.11"
  filename      = var.api_zip_path
  timeout       = 15
  memory_size   = 512

  environment {
    variables = {
      TICKETS_TABLE             = aws_dynamodb_table.tickets.name
      TICKET_CREATED_QUEUE_URL  = aws_sqs_queue.ticket_created.id
      SAGEMAKER_ENDPOINT_NAME   = var.sagemaker_endpoint_name
      BEDROCK_MODEL_ID          = var.bedrock_model_id
      LEX_BOT_ID                = var.lex_bot_id
      LEX_BOT_ALIAS_ID          = var.lex_bot_alias_id
      LEX_LOCALE_ID             = var.lex_locale_id
    }
  }
}

resource "aws_lambda_function" "triage" {
  function_name = "${local.project}-triage"
  role          = aws_iam_role.lambda_triage.arn
  handler       = "triage_handler.handler"
  runtime       = "python3.11"
  filename      = var.triage_zip_path
  timeout       = 15
  memory_size   = 512

  environment {
    variables = {
      TICKETS_TABLE              = aws_dynamodb_table.tickets.name
      TICKET_TRIAGED_QUEUE_URL   = aws_sqs_queue.ticket_triaged.id
    }
  }
}

resource "aws_lambda_function" "analytics" {
  function_name = "${local.project}-analytics"
  role          = aws_iam_role.lambda_analytics.arn
  handler       = "analytics_handler.handler"
  runtime       = "python3.11"
  filename      = var.analytics_zip_path
  timeout       = 15
  memory_size   = 512

  environment {
    variables = {
      ANALYTICS_TABLE = aws_dynamodb_table.analytics.name
    }
  }
}

# Event source mappings
resource "aws_lambda_event_source_mapping" "triage_from_created" {
  event_source_arn = aws_sqs_queue.ticket_created.arn
  function_name    = aws_lambda_function.triage.arn
  batch_size       = 10
}

resource "aws_lambda_event_source_mapping" "analytics_from_created" {
  event_source_arn = aws_sqs_queue.ticket_created.arn
  function_name    = aws_lambda_function.analytics.arn
  batch_size       = 10
}

resource "aws_lambda_event_source_mapping" "analytics_from_triaged" {
  event_source_arn = aws_sqs_queue.ticket_triaged.arn
  function_name    = aws_lambda_function.analytics.arn
  batch_size       = 10
}

# API Gateway HTTP API -> Lambda proxy
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${local.project}-http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
    allow_headers = ["content-type"]
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.api.invoke_arn
}

resource "aws_apigatewayv2_route" "proxy" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}