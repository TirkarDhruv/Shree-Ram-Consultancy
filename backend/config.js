require('dotenv').config();

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function splitOrigins(value) {
  return String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

const config = {
  env,
  isProduction,
  port: toInt(process.env.PORT, 3000),
  frontendOrigins: splitOrigins(process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5174,http://localhost:5175'),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shreeram',
    connectionLimit: toInt(process.env.DB_CONNECTION_LIMIT, 10)
  },
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  },
  jwtSecret: process.env.JWT_SECRET || 'replace-me',
  leadRateLimit: {
    windowMs: toInt(process.env.LEAD_RATE_LIMIT_WINDOW_MS, 60 * 1000),
    max: toInt(process.env.LEAD_RATE_LIMIT_MAX, 30)
  },
  adminRateLimit: {
    windowMs: toInt(process.env.ADMIN_RATE_LIMIT_WINDOW_MS, 5 * 60 * 1000),
    max: toInt(process.env.ADMIN_RATE_LIMIT_MAX, 20)
  }
};

if (isProduction) {
  const weakAdminPassword = !process.env.ADMIN_PASSWORD || config.admin.password === 'admin123';
  const weakJwtSecret = !process.env.JWT_SECRET || config.jwtSecret === 'replace-me' || config.jwtSecret.length < 32;

  if (weakAdminPassword) {
    throw new Error('ADMIN_PASSWORD must be set to a strong value in production.');
  }

  if (weakJwtSecret) {
    throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }
}

module.exports = config;
