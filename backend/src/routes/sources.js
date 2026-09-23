const router = require('express').Router();
const db = require('../db');

// GET /api/sources - health and throughput of connected SIEMs
router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM siem_sources ORDER BY name');
  res.json(rows);
});

module.exports = router;
