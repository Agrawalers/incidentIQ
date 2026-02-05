import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def validate_analysis(log: str, analysis_json: str) -> str:
    """
    Validates the AI analysis and adjusts confidence conservatively.
    The validator can ONLY reduce confidence, never increase it.
    """

    prompt = f"""
You are a critical Site Reliability Engineer (SRE) reviewer.

INCIDENT LOG:
{log}

AI ANALYSIS:
{analysis_json}

TASK:
1. Check if the analysis logically follows from the log
2. Identify any assumptions or weak reasoning
3. Adjust confidence if needed

IMPORTANT RULES:
- If evidence is weak, lower confidence
- If assumptions are made, lower confidence
- Never increase confidence

Return STRICT JSON only:
{{
  "is_valid": boolean,
  "issues_found": ["string"],
  "adjusted_confidence": float,
  "review_notes": "string"
}}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a strict and careful reviewer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )

    # ---------------- SAFETY CLAMP ----------------

    try:
        # Parse model output
        validation = json.loads(response.choices[0].message.content)

        # Parse original analysis to extract original confidence
        analysis = json.loads(analysis_json)
        original_confidence = analysis.get("confidence", 0.5)

        # Ensure validator NEVER increases confidence
        adjusted_confidence = validation.get("adjusted_confidence", original_confidence)
        validation["adjusted_confidence"] = round(
            max(0.0, min(adjusted_confidence, original_confidence)), 2
        )

        return json.dumps(validation)

    except Exception:
        # Fallback: fail safe, force human review
        return json.dumps({
            "is_valid": False,
            "issues_found": ["Validator failed to parse analysis safely"],
            "adjusted_confidence": 0.3,
            "review_notes": "Validation failed due to parsing error. Human review required."
        })
