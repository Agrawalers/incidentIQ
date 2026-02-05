import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def classify_incident(log: str) -> dict:
    """
    Classify incident severity, domain, and urgency
    """
    prompt = f"""
You are an experienced Site Reliability Engineer.

Incident Log:
{log}

Classify the incident and return STRICT JSON with:
- severity: Low | Medium | High
- domain: Database | Network | Infra | App | Security
- urgency: integer from 1 to 10

JSON only. No explanation.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a precise classification engine."},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )

    return response.choices[0].message.content
