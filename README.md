# AegisSOC — AI-Powered SOC Incident Management Platform

React (dashboard) · Node.js/Express (API) · Python/FastAPI (ML triage) · PostgreSQL · SIEM integration

## What's in this folder

```
AegisSOC/
├── frontend/           Interactive dashboard (open index.html directly, or wire it to the API)
│   └── index.html
├── backend/             Node.js/Express REST + WebSocket API
│   ├── src/
│   │   ├── server.js
│   │   ├── db.js
│   │   ├── routes/          incidents.js, sources.js, stats.js
│   │   └── controllers/     incidentsController.js
│   ├── package.json
│   └── .env.example
├── ml-service/           Python FastAPI triage service
│   ├── app.py            /triage endpoint, forwards scored alerts to the backend
│   ├── triage_model.py    scoring logic (swap in a trained model later)
│   └── requirements.txt
├── database/
│   └── schema.sql        PostgreSQL schema: incidents, siem_sources, analysts, playbook_runs
└── docs/
    └── architecture.md
```

## How the pieces fit together

1. A SIEM connector (Splunk, Microsoft Sentinel, IBM QRadar, or Elastic) sends a raw alert to the **ML service** at `POST /triage`.
2. The ML service scores the alert (risk score, MITRE ATT&CK technique, severity) and forwards the result to the **backend** at `POST /api/incidents`.
3. The backend stores the incident in **PostgreSQL** and broadcasts it over WebSocket.
4. The **frontend** dashboard subscribes to the feed and updates the KPI cards, charts, and incident table live.

The frontend currently ships as a self-contained demo with simulated data so it runs standalone with no setup. Point its `fetch`/`WebSocket` calls at the backend once it's running to go live.

## Running it locally

**Database**
```bash
createdb aegissoc
psql aegissoc -f database/schema.sql
```

**Backend**
```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL
npm install
npm run dev             # http://localhost:4000
```

**ML service**
```bash
cd ml-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

**Frontend**
Open `frontend/index.html` in a browser, or serve it with any static file server.

## Notes

- `triage_model.py` is a rule-based stand-in with the same input/output contract as a trained model, so the API and dashboard can be built and tested before a real classifier is swapped in.
- The dashboard's live feed, KPI cards, and charts are currently generated from simulated in-browser data — see `docs/architecture.md` for how to replace that with real API calls.
