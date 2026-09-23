const db = require('../db');

// GET /api/incidents?status=open&severity=Critical&q=search
exports.list = async (req, res) => {
  const { status, severity, q } = req.query;
  const clauses = [];
  const params = [];

  if (status && status !== 'all') {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }
  if (severity && severity !== 'all') {
    params.push(severity);
    clauses.push(`severity = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    clauses.push(`(title ILIKE $${params.length} OR host ILIKE $${params.length} OR username ILIKE $${params.length})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await db.query(
    `SELECT * FROM incidents ${where} ORDER BY detected_at DESC LIMIT 200`,
    params
  );
  res.json(rows);
};

// GET /api/incidents/:id
exports.get = async (req, res) => {
  const { rows } = await db.query('SELECT * FROM incidents WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Incident not found' });
  res.json(rows[0]);
};

// POST /api/incidents  (called by the ML triage service when a new alert is scored)
exports.create = async (req, res) => {
  const { title, mitre_technique, severity, ai_score, confidence, source, host, username, description } = req.body;
  const { rows } = await db.query(
    `INSERT INTO incidents (title, mitre_technique, severity, ai_score, confidence, source, host, username, description, status, detected_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'open',now()) RETURNING *`,
    [title, mitre_technique, severity, ai_score, confidence, source, host, username, description]
  );
  req.app.get('broadcast')('incident:new', rows[0]);
  res.status(201).json(rows[0]);
};

// PATCH /api/incidents/:id  (assign, escalate, hold, close, reopen)
exports.update = async (req, res) => {
  const allowed = ['status', 'assignee', 'severity'];
  const sets = [];
  const params = [];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      let value = req.body[key];

      // Frontend uses "You" as the current analyst name.
      // Store the display name separately instead of putting it
      // into the integer assignee foreign-key column.
      if (key === 'assignee' && typeof value === 'string') {
        params.push(value);
        sets.push(`assignee_name = $${params.length}`);
      } else {
        params.push(value);
        sets.push(`${key} = $${params.length}`);
      }
    }
  }

  if (!sets.length) {
    return res.status(400).json({
      error: 'No updatable fields provided'
    });
  }

  params.push(req.params.id);

  const { rows } = await db.query(
    `UPDATE incidents
     SET ${sets.join(', ')}, updated_at = now()
     WHERE id = $${params.length}
     RETURNING *`,
    params
  );

  if (!rows.length) {
    return res.status(404).json({
      error: 'Incident not found'
    });
  }

  // Return the frontend-friendly assignee value.
  if (rows[0].assignee_name) {
    rows[0].assignee = rows[0].assignee_name;
  }

  req.app.get('broadcast')('incident:update', rows[0]);
  res.json(rows[0]);
};
