variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "msp-automation"
}

variable "api_zip_path" {
  description = "Path to zipped API Lambda package"
  type        = string
  default     = "../../backend/build/api.zip"
}

variable "triage_zip_path" {
  description = "Path to zipped Triage Lambda package"
  type        = string
  default     = "../../backend/build/triage.zip"
}

variable "analytics_zip_path" {
  description = "Path to zipped Analytics Lambda package"
  type        = string
  default     = "../../backend/build/analytics.zip"
}

variable "sagemaker_endpoint_name" {
  description = "SageMaker endpoint name for ticket classification"
  type        = string
  default     = ""
}

variable "bedrock_model_id" {
  description = "Bedrock model ID for empathetic responses (e.g., amazon.titan-text)"
  type        = string
  default     = ""
}

variable "lex_bot_id" {
  description = "Lex V2 bot ID"
  type        = string
  default     = ""
}

variable "lex_bot_alias_id" {
  description = "Lex V2 bot alias ID"
  type        = string
  default     = ""
}

variable "lex_locale_id" {
  description = "Lex V2 locale (e.g., en_US)"
  type        = string
  default     = "en_US"
}

variable "bedrock_kb_id" {
  description = "Amazon Bedrock Knowledge Base ID for RAG retrieval"
  type        = string
  default     = ""
}

variable "bedrock_guardrail_id" {
  description = "Optional Bedrock Guardrail ID to enforce safety policies"
  type        = string
  default     = ""
}

variable "sagemaker_pipeline_name" {
  description = "SageMaker Pipeline name for MLOps (training/evaluation/deployment)"
  type        = string
  default     = ""
}

variable "sagemaker_role_arn" {
  description = "IAM role ARN used by SageMaker pipelines and endpoints"
  type        = string
  default     = ""
}

variable "lookout_detector_name" {
  description = "Amazon Lookout for Metrics anomaly detector name"
  type        = string
  default     = ""
}

variable "lookout_metric_source_type" {
  description = "Metric source type for Lookout (CLOUDWATCH or S3)"
  type        = string
  default     = "CLOUDWATCH"
}

variable "lookout_s3_bucket_arn" {
  description = "S3 bucket ARN for Lookout metric sets when using S3 source"
  type        = string
  default     = ""
}

variable "lookout_data_source_role_arn" {
  description = "IAM role ARN Lookout uses to access metric sources"
  type        = string
  default     = ""
}

variable "comprehend_language_code" {
  description = "Language code for Amazon Comprehend (e.g., en)"
  type        = string
  default     = "en"
}

variable "global_tags" {
  description = "Tags applied to provisioned resources"
  type        = map(string)
  default     = {
    project = "msp-automation"
  }
}