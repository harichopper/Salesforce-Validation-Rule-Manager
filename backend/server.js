require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const morgan = require('morgan');

const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Trust proxy for Vercel/proxies
app.set('trust proxy', 1);

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS — allow frontend origin with credentials
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Session — using cookie-session for serverless persistence
app.use(
  cookieSession({
    name: 'sf_val_mgr_session',
    secret: config.sessionSecret,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  })
);

// ─── ROUTES ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'Salesforce Validation Rule Manager API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/auth/salesforce',
      callback: '/auth/callback',
      status: '/auth/status',
      logout: '/auth/logout',
      validationRules: '/validation-rules',
      toggleRule: '/toggle-rule',
      toggleAll: '/toggle-all',
      deploy: '/deploy',
      orgInfo: '/org-info',
    },
  });
});

app.use('/auth', authRoutes);
app.use('/', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// ─── START SERVER ────────────────────────────────────────────
app.listen(config.port, () => {
  logger.success(`Server running on http://localhost:${config.port}`);
  logger.info(`Frontend URL: ${config.frontendUrl}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

module.exports = app;
