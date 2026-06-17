const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const leadsRouter = require('./routes/leads');
const adminRouter = require('./routes/admin');
const pool = require('./db');
const { serviceCategories, leadStatuses } = require('./data/services');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', config.isProduction ? 1 : false);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.use(cors({
  origin(origin, callback) {
    if (!origin || config.frontendOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: false
}));

const publicLimiter = rateLimit({
  windowMs: config.leadRateLimit.windowMs,
  max: config.leadRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false
});

const adminLimiter = rateLimit({
  windowMs: config.adminRateLimit.windowMs,
  max: config.adminRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'degraded', db: 'error' });
  }
});

app.get('/api/config', (req, res) => {
  res.json({
    business: {
      name: 'Shree Ram Consultancy',
      address: 'Nr. Shitalchhaya Cross Road, Arbudanagar, Odhav, Ahmedabad - 382415',
      phone: '+917069320318',
      whatsapp: '917069320318',
      hours: '10:00 AM - 6:00 PM',
      openNow: true
    },
    services: serviceCategories,
    leadStatuses
  });
});

app.use('/api/leads', publicLimiter, leadsRouter);
app.use('/api/admin', adminLimiter, adminRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'not_found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  // In non-production, expose the real error to make debugging the 500 fast.
  if (!config.isProduction) {
    return res.status(500).json({
      error: 'server_error',
      message: err?.message || String(err),
      // Keep stack out of production.
      stack: err?.stack
    });
  }

  res.status(500).json({ error: 'server_error' });
});

const server = app.listen(config.port, () => {
  console.log(`Shree Ram backend listening on port ${config.port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
