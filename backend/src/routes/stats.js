const router = require('express').Router();
const db = require('../db');

// GET /api/stats - powers the SOC posture KPI cards
router.get('/', async (req, res) => {
  const { rows } = await db.query(`
    SELECT
      count(*) FILTER (WHERE true) AS created_cases,
      count(*) FILTER (WHERE status = 'open') AS open_cases,
      count(*) FILTER (WHERE status = 'closed') AS closed_cases,
      count(*) FILTER (WHERE status = 'hold') AS on_hold_cases,
      count(*) FILTER (WHERE status = 'open' AND severity = 'Critical' AND assignee IS NULL) AS unassigned_critical,
      percentile_cont(0.9) WITHIN GROUP (ORDER BY triage_seconds) AS p90_triage_seconds,
      avg(EXTRACT(EPOCH FROM (updated_at - detected_at))) FILTER (WHERE status = 'closed' AND severity = 'Critical') AS mttr_critical_seconds,
      avg(EXTRACT(EPOCH FROM (updated_at - detected_at))) FILTER (WHERE status = 'closed') AS mttr_all_seconds
    FROM incidents;
  `);
  res.json(rows[0]);
});

module.exports = router;
