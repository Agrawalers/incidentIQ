# 🚨 IncidentIQ

**IncidentIQ** is an autonomous incident response AI system that analyzes production incidents, retrieves similar historical failures, reasons about root cause, validates confidence, and decides whether an issue can be safely automated or requires human review.

> Built with safety-first reasoning, evidence-based decisions, and human-in-the-loop controls.

---

## 🧠 What IncidentIQ Does

1. **Classifies incidents** (severity, domain, urgency)
2. **Retrieves similar past incidents** using vector search (FAISS)
3. **Reasons about root cause** using LLMs + runbooks
4. **Validates reasoning** to reduce hallucinations
5. **Decides final action**
   - ✅ Auto-Apply Fix
   - ⚠️ Human Review Recommended
   - ❌ Reject Irrelevant Input

---

## 🏗 Architecture Overview

Frontend (React + Vite + TypeScript)
|
| POST /analyze-incident
|
Backend (FastAPI)
├─ Classifier Agent
├─ RAG Retriever (FAISS)
├─ Reasoner Agent (LLM)
├─ Validator Agent (LLM)
└─ Decision Engine


---

## 🛠 Tech Stack

### Backend
- FastAPI
- Python
- FAISS (vector similarity search)
- Groq LLM API
- Pydantic

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

---

## 🚀 Running Locally

### 1️⃣ Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn api:app --reload

Backend runs at:
