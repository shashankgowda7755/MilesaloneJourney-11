// Vercel serverless function handler for the travel blog API
// Properly configured for Supabase PostgreSQL database

import express from 'express';
import session from 'express-session';
import { registerRoutes } from '../server/routes.js';

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

// Initialize routes using the same system as development
(async () => {
  try {
    await registerRoutes(app);
  } catch (error) {
    console.error('Error setting up routes:', error);
  }
})();


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel
export default app;