"""
Rule-based stand-in for the trained triage model.

In production this is a gradient-boosted classifier trained on
labeled historical incidents (features: event type, time of day,
asset criticality, user risk score, indicator reputation, etc.)
that outputs a risk score 0-100 and a MITRE ATT&CK technique.
This stub keeps the same input/output contract so the API and
dashboard can be built and tested against it before the trained
model is swapped in.
"""

RULES = {

    "failed_login": {
        "title": "SSH Brute Force Detected",
        "technique": "T1110",
        "description": "{host} recorded repeated failed login attempts for {username}. Pattern is consistent with brute-force authentication activity.",
        "base_score": 78,
    },

    "failed_login_then_success": {
        "title": "Repeated failed logins then success",
        "technique": "T1110",
        "description": "{username} had multiple failed sign-ins followed by a success from {host}. Pattern matches credential stuffing.",
        "base_score": 70,
    },
    "file_write_burst": {
        "title": "File encryption burst on file server",
        "technique": "T1486",
        "description": "{host} renamed a large number of files with a new extension in a short window. Behavior matches ransomware.",
        "base_score": 92,
    },
    "beaconing": {
        "title": "Beaconing to rarely seen domain",
        "technique": "T1071",
        "description": "{host} contacts a newly registered domain at a regular interval with a uniform payload size.",
        "base_score": 78,
    },
    "impossible_travel": {
        "title": "Impossible travel sign-in",
        "technique": "T1078",
        "description": "{username} signed in from two distant locations within a short time window.",
        "base_score": 65,
    },
    "encoded_powershell": {
        "title": "Encoded PowerShell from Office process",
        "technique": "T1059.001",
        "description": "An Office process on {host} launched PowerShell with an encoded payload.",
        "base_score": 80,
    },
}

DEFAULT_RULE = {
    "title": "Unclassified anomalous activity",
    "technique": "T1583",
    "description": "{host} triggered an anomaly the model has not seen a strong pattern for yet.",
    "base_score": 30,
}


def score_alert(alert: dict) -> dict:
    rule = RULES.get(alert.get("event_type"), DEFAULT_RULE)

    score = rule["base_score"]
    if alert.get("raw_payload", {}).get("asset_criticality") == "high":
        score += 8
    score = max(0, min(100, score))

    severity = (
        "Critical" if score >= 85 else
        "High" if score >= 65 else
        "Medium" if score >= 40 else
        "Low"
    )

    return {
        "title": rule["title"],
        "technique": rule["technique"],
        "description": rule["description"].format(
            host=alert.get("host", "the host"),
            username=alert.get("username") or "the user",
        ),
        "score": score,
        "confidence": 88,
        "severity": severity,
    }
