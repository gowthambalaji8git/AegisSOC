-- AegisSOC database schema (PostgreSQL 14+)

CREATE TYPE incident_status AS ENUM ('open', 'hold', 'closed');
CREATE TYPE incident_severity AS ENUM ('Low', 'Medium', 'High', 'Critical');

CREATE TABLE analysts (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'analyst', -- analyst | lead | admin
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE siem_sources (
    id             SERIAL PRIMARY KEY,
    name           TEXT UNIQUE NOT NULL,          -- Splunk, Microsoft Sentinel, IBM QRadar, Elastic SIEM
    events_per_sec INTEGER NOT NULL DEFAULT 0,
    status         TEXT NOT NULL DEFAULT 'Healthy',
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE incidents (
    id               SERIAL PRIMARY KEY,
    title            TEXT NOT NULL,
    description      TEXT,
    mitre_technique  TEXT,
    severity         incident_severity NOT NULL,
    status           incident_status NOT NULL DEFAULT 'open',
    ai_score         SMALLINT CHECK (ai_score BETWEEN 0 AND 100),
    confidence       SMALLINT CHECK (confidence BETWEEN 0 AND 100),
    source           TEXT REFERENCES siem_sources(name),
    host             TEXT,
    username         TEXT,
    assignee         INTEGER REFERENCES analysts(id),
    triage_seconds   INTEGER,                     -- time the ML service took to score the alert
    detected_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_incidents_status   ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_detected ON incidents(detected_at DESC);

CREATE TABLE incident_events (
    id          SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    event_text  TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE playbook_runs (
    id          SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    step        TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'pending', -- pending | done
    ran_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the four SIEM sources shown on the dashboard
INSERT INTO siem_sources (name, events_per_sec, status) VALUES
  ('Splunk', 1840, 'Healthy'),
  ('Microsoft Sentinel', 1210, 'Healthy'),
  ('IBM QRadar', 960, 'Lagging 42 s'),
  ('Elastic SIEM', 1430, 'Healthy');
