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
    
    # Block obvious non-incident patterns (ONLY at start)
    non_incident_patterns = [
        "what is", "how to", "can you", "please help", "explain", 
        "tell me", "show me", "i want", "i need", "tutorial",
        "who is", "where is", "when is"
    ]
    
    # Block general knowledge/personal questions
    irrelevant_topics = [
        "prime minister", "president", "politician", "celebrity", "actor", 
        "movie", "music", "sports", "weather", "cooking", "recipe"
    ]
    
    # If it contains irrelevant topics, block it
    for topic in irrelevant_topics:
        if topic in log_lower:
            return False
    
    # If it starts with question patterns, block it
    for pattern in non_incident_patterns:
        if log_lower.startswith(pattern):
            return False
    
    # Incident keywords (EXPANDED)
    incident_keywords = [
        "error", "failed", "failure", "timeout", "crash", "down",
        "latency", "unavailable", "restart", "outage", "exception",
        "memory", "cpu", "disk", "database", "service", "pod",
        "connection", "traffic", "load", "alert", "warning", "critical",
        "500", "404", "503", "502", "429", "oom", "killed", "terminated",
        "slow", "stuck", "freeze", "hang", "unresponsive", "issue", "problem"
    ]
    
    # Technical context (EXPANDED)
    technical_indicators = [
        "http", "api", "server", "cluster", "node", "container", "deployment",
        "pipeline", "queue", "cache", "redis", "postgres", "mysql", "nginx",
        "kubernetes", "docker", "aws", "gcp", "azure", "lambda", "s3",
        "browser", "tab", "tabs", "page", "screen", "session", "ui",
        "system", "application", "app", "website", "network"
    ]
    
    has_incident_keyword = any(k in log_lower for k in incident_keywords)
    has_technical_context = any(t in log_lower for t in technical_indicators)
    
    # More lenient: technical context OR incident keyword is enough
    return has_technical_context or has_incident_keyword



# ---------------- Health ----------------

@app.get("/")
def health_check():
    return {"status": "ok", "service": "IncidentIQ"}


# ---------------- Main Endpoint ----------------

@app.post("/analyze-incident", response_model=IncidentResponse)
def analyze_incident_api(request: IncidentRequest):
    try:
        log = request.log

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

        


        # ---------- NORMAL PIPELINE ----------

        try:
            classification = json.loads(classify_incident(log))
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Classifier JSON error: {str(e)}")

        try:
            similar_incidents = retrieve_similar_incidents(log)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"RAG retrieval error: {str(e)}")

        try:
            analysis_raw = analyze_incident(
                log=log,
                similar_incidents=similar_incidents,
                runbooks=RUNBOOKS
            )
            analysis = json.loads(analysis_raw)
        except json.JSONDecodeError as e:
            # LLM sometimes returns invalid JSON - return safe fallback
            return {
                "classification": classification,
                "similar_incidents": similar_incidents,
                "analysis": {
                    "is_known_issue": False,
                    "failure_layer": "Unknown",
                    "reasoning": "The AI model encountered an issue analyzing this incident. Please review manually.",
                    "root_cause": "Analysis incomplete - LLM response error",
                    "fix_steps": ["Manual investigation required"],
                    "confidence": 0.3
                },
                "validation": {
                    "is_valid": False,
                    "issues_found": ["AI analysis failed to complete"],
                    "adjusted_confidence": 0.3,
                    "review_notes": "The reasoning agent encountered an error. Human review is required."
                },
                "final_verdict": {
                    "confidence_level": "Low",
                    "recommended_action": "Human Review Required",
                    "reason": "AI analysis incomplete - manual review needed"
                }
            }

        # Confidence calibration (critical)
        analysis["confidence"] = calibrate_confidence(
            llm_confidence=analysis.get("confidence", 0.5),
            similar_incidents=similar_incidents,
            is_known_issue=analysis.get("is_known_issue", False)
        )

        # Validator must see calibrated analysis
        try:
            validation = json.loads(
                validate_analysis(log, json.dumps(analysis))
            )
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Validator JSON error: {str(e)}")

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
