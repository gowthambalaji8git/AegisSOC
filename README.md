# AegisSOC — AI-Powered SOC Incident Management Platform

AegisSOC is an AI-assisted Security Operations Center (SOC) incident management platform designed to demonstrate a modern security alert lifecycle — from SIEM alert ingestion and automated triage to MITRE ATT&CK mapping, incident storage, real-time monitoring, and analyst investigation.

The platform combines a browser-based SOC dashboard, Node.js/Express backend, Python/FastAPI ML triage service, PostgreSQL database, WebSocket communication, and SIEM integration.

---

## 🚀 Project Overview

Security Operations Centers receive large volumes of alerts from SIEM and security monitoring platforms. SOC analysts must investigate these alerts, determine their severity, identify attack techniques, prioritize incidents, and take appropriate response actions.

AegisSOC demonstrates this workflow through an integrated platform.

### Core Workflow

```text
                 ┌──────────────────────┐
                 │   SIEM / Security    │
                 │       Events         │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Alert Ingestion    │
                 │   Node.js Backend    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    ML Triage Engine  │
                 │     Python/FastAPI   │
                 ├──────────────────────┤
                 │ Risk Score           │
                 │ Severity             │
                 │ Confidence           │
                 │ MITRE ATT&CK         │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │      PostgreSQL      │
                 │   Incident Storage   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │      WebSocket       │
                 │   Real-Time Events   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   AegisSOC Dashboard │
                 │      SOC Analyst     │
                 └──────────────────────┘
```

---

# 🎯 Project Objectives

The main objectives of AegisSOC are:

- Build a practical SOC monitoring platform.
- Demonstrate SIEM alert ingestion.
- Automate first-level security alert triage.
- Calculate security risk scores.
- Classify incidents based on severity.
- Map security activity to MITRE ATT&CK techniques.
- Store incidents in PostgreSQL.
- Provide real-time incident updates.
- Provide SOC analysts with an investigation dashboard.
- Support incident management workflows.
- Demonstrate integration between SIEM, backend, ML service, database, and dashboard.
- Provide a foundation for future machine-learning and SOAR capabilities.

---

# ⭐ Key Features

## 1. SOC Dashboard

The AegisSOC dashboard provides a centralized SOC monitoring interface.

Features include:

- Security KPI cards
- Incident statistics
- Severity distribution
- Live incident monitoring
- Incident search
- Incident filtering
- Incident details
- SIEM source monitoring
- MITRE ATT&CK information
- AI triage information
- Analyst incident actions
- Real-time incident updates

---

## 2. AI-Assisted Alert Triage

Incoming security alerts are processed by the Python/FastAPI triage service.

The triage engine generates:

- Incident title
- Risk score
- Severity
- Confidence score
- MITRE ATT&CK technique
- Security description

Example:

```text
Security Event
      │
      ▼
ML Triage
      │
      ├── Risk Score: 78
      ├── Confidence: 88%
      ├── Severity: High
      └── MITRE: T1110
```

The current implementation uses a rule-based security scoring engine with an API structure that can later be replaced with a trained machine-learning model.

---

# 🧠 ML Triage Service

The ML triage service is implemented using:

- Python
- FastAPI
- Pydantic
- Requests

Service URL:

```text
http://localhost:8001
```

### Health Endpoint

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "aegissoc-ml-triage"
}
```

### Triage Endpoint

```http
POST /triage
```

Example input:

```json
{
  "source": "Splunk",
  "event_type": "failed_login",
  "host": "test-ssh-server",
  "username": "admin",
  "raw_payload": {
    "asset_criticality": "high"
  }
}
```

The service processes the event and generates an enriched security incident.

---

# 🎯 Risk Scoring

AegisSOC assigns a score between `0` and `100`.

Current severity classification:

| Score | Severity |
|---:|---|
| 0–39 | Low |
| 40–64 | Medium |
| 65–84 | High |
| 85–100 | Critical |

Asset criticality can increase the calculated score.

For example:

```text
Base Score
    │
    ▼
78
    │
    ├── High Asset Criticality
    │
    ▼
Additional Score
    │
    ▼
Final Risk Score
```

---

# 🛡️ Security Detection Scenarios

AegisSOC currently demonstrates multiple security detection scenarios.

---

## 1. SSH Brute Force Detection

### Event Type

```text
failed_login
```

### Detection

Repeated failed authentication attempts.

### MITRE ATT&CK

```text
T1110 - Brute Force
```

### Example

```text
Host        : test-ssh-server
Username    : admin
Risk Score  : 78
Severity    : High
Confidence  : 88
Source      : Splunk
```

---

## 2. Encoded PowerShell Detection

### Event Type

```text
encoded_powershell
```

### MITRE ATT&CK

```text
T1059.001 - PowerShell
```

### Example

```text
Host        : test-workstation
Username    : analyst
Risk Score  : 80
Severity    : High
Confidence  : 88
```

The scenario represents suspicious PowerShell execution involving an encoded payload launched from an Office process.

---

## 3. File Encryption / Ransomware-Like Activity

### Event Type

```text
file_write_burst
```

### MITRE ATT&CK

```text
T1486 - Data Encrypted for Impact
```

### Example

```text
Host        : test-file-server
Username    : backup-admin
Risk Score  : 92
Severity    : Critical
Confidence  : 88
```

The scenario represents rapid file-renaming/encryption behavior consistent with ransomware-like activity.

---

## 4. Beaconing Detection

### Event Type

```text
beaconing
```

### MITRE ATT&CK

```text
T1071 - Application Layer Protocol
```

### Example

```text
Host        : test-workstation
Username    : user01
Risk Score  : 78
Severity    : High
Confidence  : 88
```

The scenario represents periodic communication with a rarely seen domain.

---

## 5. Impossible Travel Detection

### Event Type

```text
impossible_travel
```

### MITRE ATT&CK

```text
T1078 - Valid Accounts
```

### Example

```text
Host        : test-vpn-server
Username    : user01
Risk Score  : 65
Severity    : High
Confidence  : 88
```

The scenario represents authentication activity from geographically distant locations within a short time period.

---

# 🎯 MITRE ATT&CK Coverage

The current validated detection scenarios include:

| MITRE ID | Technique | AegisSOC Detection |
|---|---|---|
| T1110 | Brute Force | SSH Brute Force |
| T1059.001 | PowerShell | Encoded PowerShell |
| T1486 | Data Encrypted for Impact | File Encryption |
| T1071 | Application Layer Protocol | Beaconing |
| T1078 | Valid Accounts | Impossible Travel |

MITRE ATT&CK mapping is generated as part of the alert triage process.

---

# 🔌 SIEM Integration

AegisSOC includes a SIEM-oriented ingestion architecture.

The current tested integration uses Splunk webhook-style alert ingestion.

Splunk can send an HTTP POST request to:

```http
POST /api/ingest/splunk
```

The backend normalizes incoming Splunk data and forwards the security event to the ML triage service.

---

# 🔄 Splunk → AegisSOC Workflow

```text
┌─────────────┐
│    Splunk   │
└──────┬──────┘
       │
       │ Webhook
       ▼
┌─────────────────────────┐
│ Node.js Ingestion API   │
│ /api/ingest/splunk      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Python ML Triage        │
│ /triage                 │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Node.js Incident API    │
│ /api/incidents          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ PostgreSQL              │
│ Incident Database       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ WebSocket               │
│ Real-Time Update        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ AegisSOC Dashboard      │
└─────────────────────────┘
```

---

# 📡 Splunk Payload Processing

The ingestion endpoint supports common field names such as:

```text
event_type
eventType
type

host
hostname
src_host

username
user
user_name
```

The backend converts the incoming data into a normalized alert structure:

```json
{
  "source": "Splunk",
  "event_type": "failed_login",
  "host": "server-01",
  "username": "admin",
  "raw_payload": {}
}
```

This normalized alert is then sent to the ML service.

---

# ⚙️ Backend API

The backend is implemented using:

- Node.js
- Express.js
- PostgreSQL
- WebSocket
- CORS
- dotenv

Backend URL:

```text
http://localhost:4000
```

---

## Backend Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "aegissoc-backend"
}
```

---

# 📋 Incident API

## Get All Incidents

```http
GET /api/incidents
```

The API supports:

```text
status
severity
q
```

Example:

```http
GET /api/incidents?severity=Critical
```

Example:

```http
GET /api/incidents?status=open
```

Example:

```http
GET /api/incidents?q=server
```

---

## Get Individual Incident

```http
GET /api/incidents/:id
```

Example:

```http
GET /api/incidents/132
```

---

## Create Incident

```http
POST /api/incidents
```

Example request:

```json
{
  "title": "SSH Brute Force Detected",
  "mitre_technique": "T1110",
  "severity": "High",
  "ai_score": 78,
  "confidence": 88,
  "source": "Splunk",
  "host": "test-ssh-server",
  "username": "admin",
  "description": "Repeated failed login attempts detected."
}
```

---

## Update Incident

```http
PATCH /api/incidents/:id
```

The endpoint supports incident management operations such as:

- Status updates
- Severity updates
- Analyst assignment

Supported incident states include:

```text
Open
Hold
Closed
```

Incidents can also be reopened through the dashboard workflow.

---

# 🔌 WebSocket Communication

AegisSOC uses WebSocket communication for real-time incident updates.

WebSocket endpoint:

```text
ws://localhost:4000/ws
```

The backend broadcasts events such as:

```text
incident:new
incident:update
```

This allows the frontend to receive updates without continuously refreshing the page.

---

# 🗄️ PostgreSQL Database

AegisSOC uses PostgreSQL for persistent incident and SOC data storage.

## Main Tables

```text
analysts
siem_sources
incidents
incident_events
playbook_runs
```

---

## Incidents Table

The incident database stores information including:

- Incident ID
- Incident title
- Description
- MITRE ATT&CK technique
- Severity
- Status
- AI score
- Confidence
- SIEM source
- Host
- Username
- Analyst assignment
- Detection timestamp
- Updated timestamp

---

## SIEM Sources

The database contains SIEM source information such as:

```text
Splunk
Microsoft Sentinel
IBM QRadar
Elastic SIEM
```

These represent the types of SIEM sources that can be monitored or integrated into the platform architecture.

---

# 👨‍💻 SOC Analyst Workflow

AegisSOC provides an incident management workflow for analysts.

```text
                 New Incident
                      │
                      ▼
                   Open
                      │
                      ▼
                  Assign
                      │
                      ▼
                Investigate
                      │
             ┌────────┴────────┐
             ▼                 ▼
           Hold             Escalate
             │                 │
             └────────┬────────┘
                      ▼
                    Close
                      │
                      ▼
                   Reopen
```

Analysts can:

- Review incident details
- Search incidents
- Filter by severity
- Filter by status
- Assign incidents
- Change severity
- Place incidents on hold
- Escalate incidents
- Close incidents
- Reopen incidents

---

# 🖥️ Frontend Dashboard

The AegisSOC frontend is a browser-based SOC dashboard built using:

- HTML
- CSS
- JavaScript
- WebSocket communication
- REST API integration

Frontend URL:

```text
http://localhost:5173
```

---

# 📊 Dashboard Capabilities

The dashboard includes:

### KPI Monitoring

- Total incidents
- Open incidents
- Critical incidents
- High incidents
- Medium incidents
- Low incidents

### Incident Monitoring

- Live incident list
- Incident severity
- Incident status
- Host
- Username
- Source
- AI score
- Confidence
- MITRE technique

### Investigation

- Incident details
- Security description
- Detection information
- Analyst actions
- Incident status management

### Filtering

Incidents can be filtered using:

```text
Status
Severity
Search
```

---

# 🏗️ Complete System Architecture

```text
                             AegisSOC
                                │
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ▼                       ▼                        ▼
   SIEM Sources            ML Triage              SOC Dashboard
        │                       │                        │
        │                       │                        │
        ▼                       ▼                        ▼
     Splunk                 FastAPI                 HTML/JS
        │                    Python                    │
        │                       │                      │
        └───────────┐           │           ┌──────────┘
                    │           │           │
                    ▼           ▼           ▼
                 Node.js / Express Backend
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
        PostgreSQL                 WebSocket
          Database               Real-Time Events
```

---

# 📁 Project Structure

```text
AegisSOC/
│
├── backend/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   └── incidentsController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── incidents.js
│   │   │   ├── ingest.js
│   │   │   ├── sources.js
│   │   │   └── stats.js
│   │   │
│   │   ├── db.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env.example
│
├── database/
│   └── schema.sql
│
├── frontend/
│   └── index.html
│
├── ml-service/
│   ├── app.py
│   ├── triage_model.py
│   └── requirements.txt
│
├── docs/
│   ├── architecture.md
│   └── AegisSOC images/
│       ├── 01-dashboard.png
│       ├── 02-live-incidents.png
│       ├── 03-incident-management.png
│       ├── 04-incident-details.png
│       ├── 05-siem-sources.png
│       ├── 06-mitre-attack.png
│       ├── 07-ml-triage.png
│       ├── 08-backend-api.png
│       ├── 09-splunk.png
│       ├── 10-severity-filter.png
│       ├── 11-playbook-response.png
│       └── 12-incident-actions.png
│
├── .gitignore
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend

```text
HTML5
CSS3
JavaScript
WebSocket
REST API
```

## Backend

```text
Node.js
Express.js
REST API
WebSocket
CORS
dotenv
```

## ML / Security Triage

```text
Python
FastAPI
Pydantic
Requests
Scikit-learn environment
Rule-Based Security Scoring
```

## Database

```text
PostgreSQL
```

## SIEM

```text
Splunk
```

## Security Framework

```text
MITRE ATT&CK
```

---

# 🔢 Service Ports

| Component | Port | Purpose |
|---|---:|---|
| Frontend | 5173 | SOC Dashboard |
| Backend | 4000 | REST API + WebSocket |
| ML Service | 8001 | AI/ML Alert Triage |
| Splunk | 8000 | SIEM Web Interface |
| PostgreSQL | 5433 | Database |

---

# 🚀 Installation

## Requirements

Install the following:

```text
Git
Node.js
Python 3.12+
PostgreSQL
Splunk
```

Recommended Python version for the ML environment:

```text
Python 3.12
```

---

# 1. Clone the Repository

```bash
git clone https://github.com/gowthambalaji8git/AegisSOC.git
```

Move into the project:

```bash
cd AegisSOC
```

---

# 2. Configure PostgreSQL

Create the database:

```bash
createdb aegissoc
```

Load the schema:

```bash
psql aegissoc -f database/schema.sql
```

If PostgreSQL is running on port `5433`, use:

```bash
psql -p 5433 aegissoc -f database/schema.sql
```

---

# 3. Configure Backend

Go to the backend:

```powershell
cd backend
```

Install dependencies:

```powershell
npm install
```

Create the environment file:

```text
.env
```

Example:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5433/aegissoc
```

Start the backend:

```powershell
npm start
```

Expected output:

```text
AegisSOC API listening on :4000
```

---

# 4. Start ML Service

Open a new terminal.

```powershell
cd D:\projects\AegisSOC\ml-service
```

Create a Python 3.12 virtual environment:

```powershell
py -3.12 -m venv .venv312
```

Activate it:

```powershell
.\.venv312\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the ML service:

```powershell
python -m uvicorn app:app --host 127.0.0.1 --port 8001
```

Expected output:

```text
Uvicorn running on http://127.0.0.1:8001
```

---

# 5. Verify ML Service

Run:

```powershell
Invoke-RestMethod http://localhost:8001/health
```

Expected result:

```text
status service
------ -------
ok     aegissoc-ml-triage
```

---

# 6. Start Frontend

Open another terminal:

```powershell
cd D:\projects\AegisSOC\frontend
```

Start a static server:

```powershell
npx serve . -l 5173
```

Open:

```text
http://localhost:5173
```

---

# 🧪 Testing the Complete Pipeline

AegisSOC can be tested by sending security events to the ML service.

Example:

```powershell
$body = @{
    source = "Splunk"
    event_type = "failed_login"
    host = "test-ssh-server"
    username = "admin"
    raw_payload = @{
        asset_criticality = "high"
    }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
    -Method POST `
    -Uri "http://localhost:8001/triage" `
    -ContentType "application/json" `
    -Body $body
```

The expected workflow is:

```text
POST /triage
      ↓
ML Security Scoring
      ↓
MITRE Mapping
      ↓
Severity Classification
      ↓
POST /api/incidents
      ↓
PostgreSQL
      ↓
Dashboard
```

---

# 🧪 Validated Test Scenarios

The project has been tested using multiple security event scenarios.

| Incident | Detection | MITRE | Score | Severity |
|---|---|---|---:|---|
| SSH Brute Force | Repeated failed login | T1110 | 78 | High |
| Encoded PowerShell | Suspicious PowerShell | T1059.001 | 80 | High |
| File Encryption | Encryption burst | T1486 | 92 | Critical |
| Beaconing | Periodic domain communication | T1071 | 78 | High |
| Impossible Travel | Suspicious authentication | T1078 | 65 | High |
| Unclassified Activity | Unknown anomaly | Default | 30 | Low |

---

# 🔍 Example Incident

Example AegisSOC incident:

```text
Incident:
SSH Brute Force Detected

MITRE:
T1110

Severity:
High

AI Score:
78

Confidence:
88%

Source:
Splunk

Host:
test-ssh-server

Username:
admin

Status:
Open
```

---

# 📸 Screenshots

## Dashboard

![AegisSOC Dashboard](docs/AegisSOC%20images/01-dashboard.png)

---

## Live Incidents

![Live Incidents](docs/AegisSOC%20images/02-live-incidents.png)

---

## Incident Management

![Incident Management](docs/AegisSOC%20images/03-incident-management.png)

---

## Incident Details

![Incident Details](docs/AegisSOC%20images/04-incident-details.png)

---

## SIEM Sources

![SIEM Sources](docs/AegisSOC%20images/05-siem-sources.png)

---

## MITRE ATT&CK

![MITRE ATT&CK](docs/AegisSOC%20images/06-mitre-attack.png)

---

## ML Triage Service

![ML Triage](docs/AegisSOC%20images/07-ml-triage.png)

---

## Backend API

![Backend API](docs/AegisSOC%20images/08-backend-api.png)

---

## Splunk Integration

![Splunk](docs/AegisSOC%20images/09-splunk.png)

---

## Severity Filtering

![Severity Filter](docs/AegisSOC%20images/10-severity-filter.png)

---

## Playbook / Response Interface

![Playbook Response](docs/AegisSOC%20images/11-playbook-response.png)

---

## Incident Actions

![Incident Actions](docs/AegisSOC%20images/12-incident-actions.png)

---

# 🔐 Security Considerations

Sensitive configuration files should never be committed to GitHub.

The repository excludes:

```text
.env
.env.*
node_modules/
Python virtual environments
Python cache
logs
temporary files
local databases
IDE configuration
```

Use `.env.example` as a template for environment configuration.

Do not commit:

```text
Passwords
API Keys
Tokens
Database credentials
SIEM credentials
Private certificates
```

---

# ⚠️ Current Implementation Status

AegisSOC currently demonstrates an integrated SOC incident-management workflow.

The validated implementation includes:

- SIEM-oriented alert ingestion
- Splunk webhook-compatible ingestion
- Python/FastAPI triage service
- Rule-based risk scoring
- Severity classification
- MITRE ATT&CK mapping
- Node.js/Express backend
- PostgreSQL incident storage
- WebSocket communication
- SOC dashboard
- Incident search
- Severity filtering
- Status filtering
- Analyst assignment
- Hold workflow
- Escalation workflow
- Close workflow
- Reopen workflow

---

# 🤖 Current ML Implementation

The current triage engine is rule-based.

It is intentionally designed with a simple input/output contract so that a trained machine-learning classifier can be introduced later without redesigning the entire system.

Current architecture:

```text
Raw Alert
    ↓
Event Type
    ↓
Security Rule
    ↓
Risk Score
    ↓
Severity
    ↓
MITRE ATT&CK
    ↓
Incident
```

Future architecture can replace the rule engine with:

```text
Raw Alert
    ↓
Feature Extraction
    ↓
ML Model
    ↓
Prediction
    ↓
Risk Score
    ↓
MITRE Mapping
    ↓
Incident
```

---

# 🔮 Future Enhancements

Possible future improvements include:

## Machine Learning

- Train a real security-event classification model.
- Add anomaly detection.
- Add feature engineering.
- Add model evaluation.
- Add model retraining.
- Add confidence calibration.
- Add historical incident learning.

## SIEM Integration

- Microsoft Sentinel
- IBM QRadar
- Elastic SIEM
- Additional Splunk integrations

## Threat Intelligence

- VirusTotal integration
- IP reputation
- Domain reputation
- URL reputation
- Hash reputation
- IOC enrichment

## SOC Automation

- Automated containment
- Account disable workflow
- IP blocking workflow
- Host isolation
- Ticket creation
- SOAR integration
- Analyst approval workflow

## Platform Security

- User authentication
- JWT authentication
- Role-based access control
- Analyst audit logs
- Session management
- Secure API authentication

## Advanced SOC Features

- Threat hunting
- Incident correlation
- Alert deduplication
- Attack-chain visualization
- Threat intelligence dashboard
- Detection engineering
- Sigma rule support
- YARA integration
- EDR integration

---

# 🎓 Cybersecurity Concepts Demonstrated

This project demonstrates practical understanding of:

- Security Operations Center (SOC)
- SIEM
- Security event monitoring
- Alert triage
- Incident management
- Incident investigation
- Risk scoring
- MITRE ATT&CK
- Brute-force detection
- PowerShell monitoring
- Ransomware-like activity detection
- Beaconing detection
- Authentication anomaly detection
- REST APIs
- WebSockets
- PostgreSQL
- Python FastAPI
- Node.js
- Splunk
- Security automation architecture

---

# 📚 Learning Outcomes

Through AegisSOC, the following practical skills are demonstrated:

### SOC Operations

Understanding how security alerts move through a SOC environment.

### SIEM

Understanding how SIEM-generated security events can be integrated into an incident-management platform.

### Alert Triage

Understanding how alerts can be scored and prioritized based on security characteristics.

### Incident Management

Understanding how SOC analysts manage incidents from detection through closure.

### MITRE ATT&CK

Understanding how suspicious activities can be mapped to known adversary techniques.

### Backend Development

Building REST APIs and WebSocket communication using Node.js and Express.

### Python Security Automation

Building a FastAPI-based alert-processing and triage service.

### Database Management

Designing PostgreSQL tables for security incidents and SOC operational data.

---

# 📌 Project Architecture Summary

```text
Frontend
   │
   │ REST / WebSocket
   ▼
Node.js / Express
   │
   ├──────────────► PostgreSQL
   │
   │
   ▼
Python / FastAPI
   │
   ├── Risk Scoring
   ├── Severity
   ├── Confidence
   └── MITRE ATT&CK
   │
   ▲
   │
Splunk / SIEM
```

---

# 👨‍💻 Project Information

**Project Name:** AegisSOC

**Full Name:** AI-Powered SOC Incident Management Platform

**Domain:** Cybersecurity

**Category:** Security Operations Center (SOC)

**Primary Focus:**

```text
SOC Monitoring
Alert Triage
Incident Management
SIEM Integration
MITRE ATT&CK
Security Automation
AI-Assisted Security Operations
```

---

# 🌐 Repository

GitHub:

https://github.com/gowthambalaji8git/AegisSOC

---

# 📜 License

This project is developed for educational, cybersecurity learning, research, and portfolio purposes.
