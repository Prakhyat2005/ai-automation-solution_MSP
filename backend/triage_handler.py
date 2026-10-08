import json
import os
import boto3

dynamo = boto3.resource('dynamodb')
sqs = boto3.client('sqs')

TICKETS_TABLE = os.environ.get('TICKETS_TABLE', 'Tickets')
TICKET_TRIAGED_QUEUE_URL = os.environ.get('TICKET_TRIAGED_QUEUE_URL')

table = dynamo.Table(TICKETS_TABLE)


def handler(event, context):
    for record in event.get('Records', []):
        body = json.loads(record['body'])
        if body.get('eventType') != 'ticket.created':
            continue

        ticket_id = body['ticketId']
        triage = {
            'assignee': 'AutoTriager',
            'sla': 'P2',
            'triageConfidence': 0.92,
        }

        table.update_item(
            Key={'PK': f'TICKET#{ticket_id}', 'SK': 'METADATA'},
            UpdateExpression='SET assignee=:a, sla=:s, triageConfidence=:c',
            ExpressionAttributeValues={
                ':a': triage['assignee'],
                ':s': triage['sla'],
                ':c': triage['triageConfidence'],
            },
        )

        if TICKET_TRIAGED_QUEUE_URL:
            sqs.send_message(
                QueueUrl=TICKET_TRIAGED_QUEUE_URL,
                MessageBody=json.dumps({
                    'eventType': 'ticket.triaged',
                    'ticketId': ticket_id,
                    'assignee': triage['assignee'],
                    'sla': triage['sla'],
                    'triageConfidence': triage['triageConfidence'],
                }),
            )

    return {'status': 'ok'}