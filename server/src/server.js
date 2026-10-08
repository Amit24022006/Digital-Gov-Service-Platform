import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import apiRoutes from './routes/api.js';
import { connectAndSeedMongo } from './db/mongoInit.js';

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 5000;

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/govdesk';

const NODE_ENV = process.env.NODE_ENV || 'development';

const isProd = NODE_ENV === 'production';

// ── Security Middleware ──────────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    },
    contentSecurityPolicy: isProd ? undefined : false
  })
);

// ── CORS Configuration ───────────────────────────────────────────────────────

app.use(
  cors({
    origin: isProd
      ? (
          process.env.ALLOWED_ORIGINS ||
          'http://localhost:5173'
        ).split(',')
      : '*',

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With'
    ],

    credentials: true
  })
);

// ── Request Parsing ──────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);

// ── Request Logger ───────────────────────────────────────────────────────────

if (!isProd) {
  app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      const color =
        res.statusCode >= 500
          ? '\x1b[31m' // red
          : res.statusCode >= 400
          ? '\x1b[33m' // yellow
          : res.statusCode >= 200
          ? '\x1b[32m' // green
          : '\x1b[0m'; // reset

      console.log(
        `${color}[${req.method}]\x1b[0m ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
      );
    });

    next();
  });
}

// ── Health Check ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    service: 'GovDesk API Server',
    version: '2.0.0',
    environment: NODE_ENV,

    database: {
      type: 'MongoDB',

      uri: MONGO_URI.replace(
        /\/\/([^:]+):([^@]+)@/,
        '//***:***@'
      ),

      status:
        mongoose.connection.readyState === 1
          ? 'connected'
          : 'disconnected'
    },

    timestamp: new Date().toISOString(),

    uptime: process.uptime()
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────

app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Please try again in a moment.'
    });
  }
  next();
}, apiRoutes);

// ── 404 Handler for unmatched API routes ─────────────────────────────────────

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// ── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);

  res.status(500).json({
    success: false,
    message: isProd
      ? 'Internal server error.'
      : err.message
  });
});

// ── Connect MongoDB & Start Server ───────────────────────────────────────────

connectAndSeedMongo(MONGO_URI)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('====================================================');

      console.log(
        `🏛️  GovDesk Server running on http://127.0.0.1:${PORT}`
      );

      console.log(
        `📡 API Base: http://127.0.0.1:${PORT}/api`
      );

      console.log(
        `🏥 Health: http://127.0.0.1:${PORT}/api/health`
      );

      console.log(`🗄️  DB: ${MONGO_URI}`);

      console.log(`🌍 Mode: ${NODE_ENV}`);

      console.log('====================================================');

      console.log('');

      console.log('🔑 Demo Credentials:');

      console.log(
        `   Admin: ${process.env.ADMIN_EMAIL || 'admin@govdesk.in'} / ${
          process.env.ADMIN_PASSWORD || 'admin123'
        }`
      );

      console.log(
        '   Citizen: citizen@govdesk.in / citizen123'
      );

      console.log('');
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('   Start MongoDB locally or set MONGO_URI in server/.env');
    console.error('   Local default: mongodb://127.0.0.1:27017/govdesk');
    process.exit(1);
  });

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
  }
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));