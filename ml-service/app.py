"""
AegisSOC ML Triage Service
---------------------------
Receives raw alerts from SIEM connectors, scores them for risk and
maps them to a MITRE ATT&CK technique, then forwards the enriched
result to the Node backend, which stores it and pushes it to the
dashboard over WebSocket.

Run:
    uvicorn app:app --reload --port 8001
"""
import os
import requests
from fastapi import FastAPI
from pydantic import BaseModel

from triage_model import score_alert

app = FastAPI(title="AegisSOC ML Triage Service")

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:4000")


class RawAlert(BaseModel):
    source: str            # Splunk, Microsoft Sentinel, IBM QRadar, Elastic SIEM
    event_type: str        # e.g. "failed_login", "file_write_burst", "dns_query"
    host: str
    username: str | None = None
    raw_payload: dict = {}


@app.get("/health")
def health():
    return {"status": "ok", "service": "aegissoc-ml-triage"}


@app.post("/triage")
def triage(alert: RawAlert):
    result = score_alert(alert.dict())

    incident_payload = {
        "title": result["title"],
        "mitre_technique": result["technique"],
        "severity": result["severity"],
        "ai_score": result["score"],
        "confidence": result["confidence"],
        "source": alert.source,
        "host": alert.host,
        "username": alert.username,
        "description": result["description"],
    }

    try:
        resp = requests.post(f"{BACKEND_URL}/api/incidents", json=incident_payload, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as exc:
        # Still return the triage result even if the backend push fails,
        # so the caller (SIEM connector) knows scoring succeeded.
        return {**incident_payload, "backend_error": str(exc)}
