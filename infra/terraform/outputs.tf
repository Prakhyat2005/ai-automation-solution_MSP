output "http_api_endpoint" {
  description = "Base URL of the deployed HTTP API"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}

output "tickets_table_name" {
  value = aws_dynamodb_table.tickets.name
}

output "analytics_table_name" {
  value = aws_dynamodb_table.analytics.name
}

output "ticket_created_queue_url" {
  value = aws_sqs_queue.ticket_created.id
}

output "ticket_triaged_queue_url" {
  value = aws_sqs_queue.ticket_triaged.id
}