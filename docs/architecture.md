# Architecture

```
 SIEM sources                ML triage service            Backend API              Frontend
 (Splunk, Sentinel,   --->   FastAPI /triage       --->    Express + WS      --->   Dashboard
  QRadar, Elastic)           risk score + MITRE            PostgreSQL               live KPIs,
                              technique + severity          incidents table          incident table,
                                                                                      detail drawer
```

## Data flow

1. **Ingestion** — each SIEM pushes or is polled for raw alerts (failed logins, file-write bursts, beaconing, etc.).
2. **Triage** — `ml-service/app.py` receives the raw alert, scores it in `triage_model.py`, and returns a risk score (0-100), a MITRE ATT&CK technique, and a severity band (Low/Medium/High/Critical).
3. **Storage** — the scored result is posted to `backend`'s `POST /api/incidents`, which writes a row to the `incidents` table and appends an `incident_events` entry.
4. **Delivery** — the backend broadcasts the new/updated incident over its `/ws` WebSocket so every connected dashboard updates without a page refresh.
5. **Response** — analysts act on an incident from the dashboard (assign, escalate, hold, run playbook, close); each action calls `PATCH /api/incidents/:id`, which updates PostgreSQL and rebroadcasts.

## Replacing the frontend's simulated data with live data

The dashboard in `frontend/index.html` currently generates and animates its own incident data in-browser so it works standalone. To connect it to the real stack:

- Replace the initial `const I = [...]` seed with a `fetch('/api/incidents')` call on load.
- Replace the `setInterval` that invents new alerts with a `new WebSocket('ws://localhost:4000/ws')` listener that pushes incoming `incident:new` / `incident:update` events into the same render functions (`draw()`, `drDraw()`).
- Point the action buttons (assign, hold, escalate, close) at `PATCH /api/incidents/:id` instead of mutating the in-memory array directly.

## Extending the ML service

`triage_model.py` is deliberately simple (rule lookup by `event_type`) so the API contract is stable while a real model is trained. To swap in a trained classifier:

- Replace `score_alert()` with a call to a `joblib`-loaded scikit-learn (or other) model.
- Keep the same return shape: `title`, `technique`, `description`, `score`, `confidence`, `severity`.
- Add a feature pipeline (`asset criticality`, `user risk history`, `indicator reputation`, `time of day`, etc.) feeding the model.
