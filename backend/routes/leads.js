const express = require('express');
const router = express.Router();
const pool = require('../db');
const { serviceNames } = require('../data/services');

const phoneRegex = /^[6-9]\d{9}$/;
const languageRegex = /^[a-z]{2}(-[A-Z]{2})?$/;

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/[\s-]/g, '');

  if (digits.startsWith('+91')) {
    return digits.slice(3);
  }

  if (digits.startsWith('91') && digits.length === 12) {
    return digits.slice(2);
  }

  return digits;
}

router.post('/', async (req, res, next) => {
  try {
    const { name, phone, service, message, language } = req.body;
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanPhone = normalizePhone(phone);
    const cleanMessage = typeof message === 'string' ? message.trim() : '';
    const cleanLanguage = typeof language === 'string' && languageRegex.test(language) ? language : 'en';

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ error: 'Invalid Indian phone number' });
    }

    if (!serviceNames.includes(service)) {
      return res.status(400).json({ error: 'Invalid service' });
    }

    if (cleanMessage.length > 500) {
      return res.status(400).json({ error: 'Message is too long' });
    }

    const now = new Date();
    const [result] = await pool.execute(
      'INSERT INTO leads (name, phone, service, message, language, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [cleanName, cleanPhone, service, cleanMessage, cleanLanguage, 'New', now, now]
    );

    res.status(201).json({ id: result.insertId, status: 'ok' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
