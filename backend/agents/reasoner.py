import os
from groq import Groq
from dotenv import load_dotenv
from backend.rag.retriever import retrieve_similar_incidents

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are an expert Site Reliability Engineer (SRE).

You diagnose production incidents using:
- Past incident patterns
- Distributed systems fundamentals
- First-principles reasoning

If similar incidents are provided, use them.
If none are relevant, reason from first principles.

Always be honest about uncertainty.
"""

def calibrate_confidence(
    llm_confidence: float,
    similar_incidents: list,
    is_known_issue: bool
) -> float:
    """
    Calibrate LLM confidence using hard evidence.
    Prevents overconfidence on weak signals.
    """

    # Clamp raw LLM confidence (never trust > 0.9)
    confidence = max(0.0, min(llm_confidence, 0.9))

    # No historical evidence → reduce confidence
    if not similar_incidents:
        return round(confidence * 0.6, 2)

    # Use strongest similarity score
    top_similarity = similar_incidents[0].get("similarity_score", 0.0)

    if top_similarity >= 0.85:
        confidence *= 1.0
    elif top_similarity >= 0.65:
        confidence *= 0.85
    else:
        confidence *= 0.6

    # Unknown issues should always be more cautious
    if not is_known_issue:
        confidence *= 0.8

    return round(min(confidence, 0.9), 2)


def analyze_incident(log: str, similar_incidents: list, runbooks: str) -> str:
    prompt = f"""
INCIDENT LOG:
{log}

SIMILAR PAST INCIDENTS:
{similar_incidents if similar_incidents else "NONE FOUND"}

RUNBOOKS:
{runbooks}

TASK:
1. Decide if this is a known issue
2. Identify the failure layer
3. Explain your reasoning
4. Identify probable root cause
5. Suggest fix steps
6. Provide a confidence score (0.0 to 1.0)

Return STRICT JSON only:
{{
  "is_known_issue": boolean,
  "failure_layer": "Database | Network | Infra | App | Security",
  "reasoning": "string",
  "root_cause": "string",
  "fix_steps": ["string"],
  "confidence": float
}}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content
