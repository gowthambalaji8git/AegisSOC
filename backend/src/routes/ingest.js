const router = require('express').Router();

const ML_URL = process.env.ML_URL || 'http://localhost:8001';

router.post('/splunk', async (req, res) => {
  try {
    const payload = req.body || {};

    // Splunk webhook places search result fields inside "result"
    const result = payload.result || payload;

    const alert = {
      source: 'Splunk',

      event_type:
        result.event_type ||
        result.eventType ||
        result.type ||
        'unknown',

      host:
        result.host ||
        result.hostname ||
        result.src_host ||
        'unknown-host',

      username:
        result.username ||
        result.user ||
        result.user_name ||
        null,

      raw_payload: payload
    };

    console.log('Splunk webhook received:', alert);

    const response = await fetch(`${ML_URL}/triage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alert)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Splunk ingestion error:', error);

    res.status(500).json({
      error: 'Failed to process Splunk event',
      details: error.message
    });
  }
});

module.exports = router;