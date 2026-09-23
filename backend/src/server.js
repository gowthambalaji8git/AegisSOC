require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const incidentsRoute = require('./routes/incidents');
const sourcesRoute = require('./routes/sources');
const statsRoute = require('./routes/stats');
const ingestRoute = require('./routes/ingest');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'aegissoc-backend' }));

app.use('/api/incidents', incidentsRoute);
app.use('/api/sources', sourcesRoute);
app.use('/api/stats', statsRoute);
app.use('/api/ingest', ingestRoute);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`AegisSOC API listening on :${PORT}`));

// Live incident feed pushed to the dashboard over WebSocket.
// The ML triage service (see ../ml-service) posts new/updated
// incidents to POST /api/incidents, which broadcasts them here.
const wss = new WebSocketServer({ server, path: '/ws' });
function broadcast(event, payload) {
  const msg = JSON.stringify({ event, payload });
  wss.clients.forEach((c) => c.readyState === 1 && c.send(msg));
}
app.set('broadcast', broadcast);

module.exports = app;
