const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ''));
  const rightBuffer = Buffer.from(String(right || ''));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createAdminToken(username) {
  return jwt.sign({ admin: true, username }, config.jwtSecret, { expiresIn: '12h' });
}

function adminAuth(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const decoded = jwt.verify(authHeader.slice(7), config.jwtSecret);

    if (!decoded.admin) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized' });
  }
}

module.exports = {
  adminAuth,
  createAdminToken,
  safeCompare
};
