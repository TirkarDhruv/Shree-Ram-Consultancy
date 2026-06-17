const express = require('express');
const pool = require('../db');
const config = require('../config');
const { adminAuth, createAdminToken, safeCompare } = require('../middleware/adminAuth');
const { leadStatuses } = require('../data/services');

const router = express.Router();

function parsePositiveInt(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'missing_credentials' });
  }

  const validUsername = safeCompare(username.trim(), config.admin.username);
  const validPassword = safeCompare(password, config.admin.password);

  if (!validUsername || !validPassword) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  res.json({
    token: createAdminToken(config.admin.username),
    username: config.admin.username
  });
});

router.get('/leads', adminAuth, async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1, 1000);
    const limit = parsePositiveInt(req.query.limit, 25, 100);
    const offset = (page - 1) * limit;
    const status = leadStatuses.includes(req.query.status) ? req.query.status : null;

    const whereClause = status ? 'WHERE status = ?' : '';
    const params = status ? [status] : [];

    const [rows] = await pool.execute(
      `SELECT id, name, phone, service, message, status, created_at, updated_at
       FROM leads
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM leads ${whereClause}`,
      params
    );

    const total = countRows[0]?.total || 0;

    res.json({
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/leads/:id/status', adminAuth, async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ error: 'invalid_lead_id' });
    }

    if (!leadStatuses.includes(status)) {
      return res.status(400).json({ error: 'invalid_status' });
    }

    const [result] = await pool.execute(
      'UPDATE leads SET status = ?, updated_at = ? WHERE id = ?',
      [status, new Date(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'lead_not_found' });
    }

    res.json({ id, status });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
