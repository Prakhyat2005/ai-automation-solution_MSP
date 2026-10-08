import os
import json
from typing import Any, Dict

import boto3

# Clients
comprehend = boto3.client('comprehend')
lex = boto3.client('lexv2-runtime')
sm_runtime = boto3.client('sagemaker-runtime')
bedrock = None
try:
    bedrock = boto3.client('bedrock-runtime')
except Exception:
    bedrock = None


def analyze_sentiment(text: str, language_code: str = 'en') -> Dict[str, Any]:
    if not text or len(text.strip()) == 0:
        return {"Sentiment": "NEUTRAL", "SentimentScore": {"Positive": 0.0, "Negative": 0.0, "Neutral": 1.0, "Mixed": 0.0}}
    resp = comprehend.detect_sentiment(Text=text, LanguageCode=language_code)
    return {
        "Sentiment": resp.get("Sentiment"),
        "SentimentScore": resp.get("SentimentScore"),
    }


def classify_ticket(text: str) -> Dict[str, Any]:
    endpoint = os.environ.get('SAGEMAKER_ENDPOINT_NAME')
    if not endpoint:
        # Fallback heuristic classification
        cat = 'Infrastructure' if 'server' in text.lower() else 'General'
        pr = 'high' if any(k in text.lower() for k in ['down', 'outage', 'critical']) else 'medium'
        return {"category": cat, "priority": pr, "source": "fallback"}

    payload = json.dumps({"text": text})
    resp = sm_runtime.invoke_endpoint(EndpointName=endpoint, Body=payload, ContentType='application/json')
    body = resp['Body'].read().decode('utf-8')
    try:
        data = json.loads(body)
    except Exception:
        data = {"raw": body}
    return data


def generate_response(text: str, sentiment: str | None = None) -> Dict[str, Any]:
    # Empathy layer: adjust style based on sentiment
    tone_map = {
        'NEGATIVE': 'empathetic and reassuring',
        'MIXED': 'understanding and clarifying',
        'POSITIVE': 'concise and proactive',
        'NEUTRAL': 'professional and helpful',
    }
    tone = tone_map.get((sentiment or 'NEUTRAL').upper(), 'professional and helpful')

    model_id = os.environ.get('BEDROCK_MODEL_ID')
    if bedrock and model_id:
        prompt = (
            f"You are an MSP Tier-0 support assistant. Respond in an {tone} style. "
            f"Acknowledge frustration when present, provide clear next steps, and avoid jargon.\n\n"
            f"User message: {text}\n\nAssistant:"
        )
        try:
            # Generic JSON request for Bedrock; exact schema depends on the model
            body = json.dumps({"prompt": prompt, "max_tokens": 300, "temperature": 0.2})
            br = bedrock.invoke_model(modelId=model_id, body=body)
            out = br.get('body')
            if hasattr(out, 'read'):
                out = out.read().decode('utf-8')
            return {"response": out, "tone": tone, "model": model_id}
        except Exception as e:
            return {"response": f"Unable to reach model: {e}", "tone": tone, "model": model_id}

    # Fallback template response
    base = {
        'empathetic and reassuring': "I’m sorry you’re experiencing this. I’ll help right away.",
        'understanding and clarifying': "I understand this is confusing. Let’s clarify and proceed.",
        'concise and proactive': "Thanks for the details. Here’s what we’ll do next.",
        'professional and helpful': "Thanks for reaching out. I’m here to assist.",
    }
    return {
        "response": f"{base.get(tone, base['professional and helpful'])} Based on your message, I suggest checking basic connectivity and logs while we triage.",
        "tone": tone,
        "model": "fallback",
    }


def lex_recognize_text(text: str) -> Dict[str, Any]:
    bot_id = os.environ.get('LEX_BOT_ID')
    alias_id = os.environ.get('LEX_BOT_ALIAS_ID')
    locale = os.environ.get('LEX_LOCALE_ID', 'en_US')
    session_id = os.environ.get('LEX_SESSION_ID', 'web-session')
    if not (bot_id and alias_id):
        return {"intent": "Fallback", "message": "Lex not configured", "slots": {}}
    resp = lex.recognize_text(
        botId=bot_id,
        botAliasId=alias_id,
        localeId=locale,
        sessionId=session_id,
        text=text,
    )
    return resp