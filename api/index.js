// Vercel serverless function handler for the travel blog API
const express = require('express');
const session = require('express-session');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Import compiled routes and database
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const ws = require('ws');

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Database setup
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

// Basic API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Mock routes for basic functionality - these will be replaced with actual compiled routes
app.get('/api/blog-posts', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/destinations', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel
module.exports = app;