import json
from pathlib import Path
from typing import List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.agents.classifier import classify_incident
from backend.agents.reasoner import analyze_incident, calibrate_confidence
from backend.agents.validator import validate_analysis
from backend.agents.decision import make_final_verdict
from backend.rag.retriever import retrieve_similar_incidents


# ---------------- Paths ----------------

BASE_DIR = Path(__file__).resolve().parent
RUNBOOKS = (BASE_DIR / "data" / "runbooks.txt").read_text()


# ---------------- App ----------------

app = FastAPI(
    title="IncidentIQ",
    description="Autonomous Incident Response AI Agent",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- Models ----------------

class IncidentRequest(BaseModel):
    log: str


class IncidentResponse(BaseModel):
    classification: Dict[str, Any]
    similar_incidents: List[Dict[str, Any]]
    analysis: Dict[str, Any]
    validation: Dict[str, Any]
    final_verdict: Dict[str, Any]


# ---------------- Input Gates ----------------

import re

def is_valid_incident_input(log: str) -> bool:
    """
    Strong sanity gate:
    Blocks gibberish, random strings, and low-signal text
    even if they pass length checks.
    """
    if not log:
        return False

    log = log.strip()

    # Absolute minimum length
    if len(log) < 30:
        return False

    words = log.split()

    # Must have enough words
    if len(words) < 5:
        return False

    # Block inputs that are mostly uppercase or random tokens
    uppercase_ratio = sum(1 for c in log if c.isupper()) / max(len(log), 1)
    if uppercase_ratio > 0.6:
        return False

    # Block inputs with too many non-alphabetic tokens
    alpha_words = [w for w in words if re.search(r"[a-zA-Z]", w)]
    if len(alpha_words) / len(words) < 0.6:
        return False

    # Block repeated short tokens like "ENF KEFL TEST"
    short_words = [w for w in words if len(w) <= 3]
    if len(short_words) / len(words) > 0.5:
        return False

    return True


def looks_like_incident(log: str) -> bool:
    """
    Intent gate:
    Ensures the input is a production / operational incident,
    not a general knowledge or unrelated question.
    """
    log_lower = log.lower().strip()
    
    # Block obvious non-incident patterns
    non_incident_patterns = [
        "what is", "how to", "can you", "please", "help me", "explain", 
        "tell me", "show me", "i want", "i need", "tutorial", "guide",
        "hello", "hi", "test", "testing", "example", "sample",
        "who is", "where is", "when is", "why is", "which is"
    ]
    
    # Block general knowledge/personal questions
    irrelevant_topics = [
        "prime minister", "president", "politician", "politics", "government",
        "celebrity", "actor", "movie", "film", "song", "music", "sports",
        "weather", "news", "history", "geography", "science", "math",
        "cooking", "recipe", "travel", "vacation", "personal", "family"
    ]
    
    # If it contains irrelevant topics, block it
    for topic in irrelevant_topics:
        if topic in log_lower:
            return False
    
    # If it starts with question/request patterns, likely not an incident
    for pattern in non_incident_patterns:
        if log_lower.startswith(pattern) or f" {pattern}" in log_lower:
            return False
    
    # Must contain incident-related keywords
    incident_keywords = [
        "error", "failed", "failure", "timeout", "crash", "down",
        "latency", "unavailable", "restart", "outage", "exception",
        "memory", "cpu", "disk", "database", "service", "pod",
        "connection", "traffic", "load", "alert", "warning", "critical",
        "500", "404", "503", "502", "429", "oom", "killed", "terminated"
    ]
    
    # Must have at least one incident keyword
    has_incident_keyword = any(keyword in log_lower for keyword in incident_keywords)
    
    # Additional technical indicators
    technical_indicators = [
        "http", "api", "server", "cluster", "node", "container", "deployment",
        "pipeline", "queue", "cache", "redis", "postgres", "mysql", "nginx",
        "kubernetes", "docker", "aws", "gcp", "azure", "lambda", "s3"
    ]
    
    has_technical_context = any(indicator in log_lower for indicator in technical_indicators)
    
    # Must have incident keywords AND some technical context
    return has_incident_keyword and (has_technical_context or len(log.split()) > 10)


# ---------------- Health ----------------

@app.get("/")
def health_check():
    return {"status": "ok", "service": "IncidentIQ"}


# ---------------- Main Endpoint ----------------

@app.post("/analyze-incident", response_model=IncidentResponse)
def analyze_incident_api(request: IncidentRequest):
    try:
        log = request.log
        # ---------- INTENT GATE ----------
        if not looks_like_incident(log):
            return {
                "classification": {
                    "severity": "Low",
                    "domain": "Unknown",
                    "urgency": 1
                },
                "similar_incidents": [],
                "analysis": {
                    "is_known_issue": False,
                    "failure_layer": "Unknown",
                    "reasoning": "This input appears to be a general knowledge question or personal inquiry, not a production incident. IncidentIQ is designed specifically for analyzing technical system failures and operational issues.",
                    "root_cause": "Input is irrelevant to incident management",
                    "fix_steps": ["Please provide a technical incident description instead"],
                    "confidence": 0.0
                },
                "validation": {
                    "is_valid": False,
                    "issues_found": ["Input is completely outside the scope of incident analysis", "Contains non-technical content"],
                    "adjusted_confidence": 0.0,
                    "review_notes": "This appears to be a general question unrelated to system incidents. IncidentIQ only processes technical operational issues."
                },
                "final_verdict": {
                    "confidence_level": "None",
                    "recommended_action": "Rejected - Irrelevant Input",
                    "reason": "Input is not related to technical incidents or system operations"
                }
            }

        # ---------- SANITY GATE ----------
        if not is_valid_incident_input(log):
            return {
                "classification": {
                    "severity": "Low",
                    "domain": "Unknown",
                    "urgency": 1
                },
                "similar_incidents": [],
                "analysis": {
                    "is_known_issue": False,
                    "failure_layer": "Unknown",
                    "reasoning": "The provided input does not contain enough information to analyze an incident.",
                    "root_cause": "Insufficient information",
                    "fix_steps": [],
                    "confidence": 0.1
                },
                "validation": {
                    "is_valid": False,
                    "issues_found": ["Input lacks sufficient detail"],
                    "adjusted_confidence": 0.1,
                    "review_notes": "Input too short or not a valid incident description."
                },
                "final_verdict": {
                    "confidence_level": "Low",
                    "recommended_action": "Human Review Required",
                    "reason": "Insufficient input signal"
                }
            }


        # ---------- NORMAL PIPELINE ----------

        classification = json.loads(classify_incident(log))

        similar_incidents = retrieve_similar_incidents(log)

        analysis_raw = analyze_incident(
            log=log,
            similar_incidents=similar_incidents,
            runbooks=RUNBOOKS
        )

        analysis = json.loads(analysis_raw)

        # Confidence calibration (critical)
        analysis["confidence"] = calibrate_confidence(
            llm_confidence=analysis.get("confidence", 0.5),
            similar_incidents=similar_incidents,
            is_known_issue=analysis.get("is_known_issue", False)
        )

        # Validator must see calibrated analysis
        validation = json.loads(
            validate_analysis(log, json.dumps(analysis))
        )

        final_verdict = make_final_verdict(
            analysis=analysis,
            validation=validation
        )

        return {
            "classification": classification,
            "similar_incidents": similar_incidents,
            "analysis": analysis,
            "validation": validation,
            "final_verdict": final_verdict
        }

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"JSON parsing error: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected server error: {str(e)}")
