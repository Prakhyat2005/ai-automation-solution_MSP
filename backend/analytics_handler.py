import json
import os
from datetime import datetime

import boto3

dynamo = boto3.resource('dynamodb')

ANALYTICS_TABLE = os.environ.get('ANALYTICS_TABLE', 'Analytics')
table = dynamo.Table(ANALYTICS_TABLE)


def handler(event, context):
    for record in event.get('Records', []):
        body = json.loads(record['body'])
        event_type = body.get('eventType')
        now = datetime.utcnow().strftime('%Y-%m-%d')

        metric = None
        if event_type == 'ticket.created':
            metric = 'tickets_created'
        elif event_type == 'ticket.triaged':
            metric = 'tickets_triaged'
        elif event_type == 'ticket.updated':
            metric = 'tickets_updated'

        if not metric:
            continue

        table.update_item(
            Key={'PK': f'METRIC#{metric}', 'SK': f'DATE#{now}'},
            UpdateExpression='ADD count :inc',
            ExpressionAttributeValues={':inc': 1},
        )

    return {'status': 'ok'}