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

// Import database for Supabase
const { Pool } = require('pg');

// Database setup for Supabase
let pool;
let db;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    console.log('Supabase database connection initialized');
  } else {
    console.log('No DATABASE_URL provided, using sample data');
  }
} catch (error) {
  console.error('Database connection error:', error);
}

// Setup database on first request
const { setupDatabase } = require('./setup-database');
let databaseSetup = false;

const ensureDatabase = async () => {
  if (!databaseSetup && process.env.DATABASE_URL) {
    try {
      await setupDatabase();
      databaseSetup = true;
    } catch (error) {
      console.error('Database setup failed:', error);
    }
  }
};

// Test route
app.get('/api/test', async (req, res) => {
  await ensureDatabase();
  res.json({ message: 'Travel Blog API is working!', timestamp: new Date().toISOString() });
});

// Import the compiled routes - this will need the actual compiled server code
try {
  // Try to import compiled routes if they exist
  const compiledRoutes = require('../dist/index.js');
  if (compiledRoutes && compiledRoutes.registerRoutes) {
    compiledRoutes.registerRoutes(app);
  }
} catch (error) {
  console.log('Compiled routes not found, using basic routes');
  
  // Blog posts API
  app.get('/api/blog-posts', async (req, res) => {
    try {
      await ensureDatabase();
      
      if (pool) {
        const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        const posts = result.rows.map(row => ({
          id: row.id.toString(),
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          featuredImage: row.featured_image,
          category: row.category,
          tags: row.tags || [],
          readingTime: row.reading_time,
          isFeatured: row.is_featured
        }));
        res.json(posts);
      } else {
        // Fallback sample data
        res.json([
          {
            id: "1",
            title: "Delhi Streets: A Culinary Adventure",
            slug: "delhi-streets-culinary-adventure",
            excerpt: "Exploring the vibrant street food scene of Old Delhi",
            featuredImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
            category: "food",
            tags: ["delhi", "street-food", "culture"],
            readingTime: 5,
            isFeatured: true
          }
        ]);
      }
    } catch (error) {
      console.error('Blog posts error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/destinations', async (req, res) => {
    try {
      res.json([
        {
          id: "1",
          name: "Srinagar, Kashmir",
          slug: "srinagar-kashmir",
          description: "The summer capital of Jammu and Kashmir",
          category: "Tourist Spot",
          region: "North India",
          state: "Jammu and Kashmir",
          coordinates: { lat: 34.0837, lng: 74.7973 },
          featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          rating: 5,
          difficulty: "Easy",
          isFeatured: true
        }
      ]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/gallery', async (req, res) => {
    try {
      res.json([
        {
          id: "1",
          title: "Kashmir Valley Adventures",
          description: "Beautiful landscapes from the Kashmir valley",
          coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          mediaCount: 12,
          location: "Kashmir, India"
        }
      ]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Auth routes
  app.get('/api/auth/user', (req, res) => {
    if (req.session && req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { username, password } = req.body;
      
      console.log('Login attempt:', { username, hasPassword: !!password });
      console.log('Expected password:', process.env.ADMIN_PASSWORD);
      
      if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
        req.session.user = {
          id: 'admin',
          name: 'Administrator',
          email: 'admin@travelblog.com'
        };
        return res.status(200).json({ 
          success: true, 
          message: 'Login successful',
          user: {
            id: 'admin',
            name: 'Administrator',
            email: 'admin@travelblog.com'
          }
        });
      } else {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Server error during login',
        error: error.message 
      });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out' });
  });

  // Journey tracking
  app.get('/api/journey', (req, res) => {
    res.json({
      id: "1",
      currentLocation: "Kanyakumari, Tamil Nadu",
      currentCoordinates: { lat: 8.0883, lng: 77.5385 },
      journeyProgress: 100,
      daysTraveled: 120,
      totalDistance: 3500,
      startDate: "2024-01-01",
      endDate: "2024-04-30"
    });
  });

  // Travel pins
  app.get('/api/travel-pins', (req, res) => {
    res.json([
      {
        name: "Kanyakumari",
        description: "Southern tip of India",
        coordinates: { lat: 8.0883, lng: 77.5385 },
        rating: 5,
        visitDate: "2024-04-30",
        notes: "Beautiful sunrise and sunset point"
      }
    ]);
  });
}

// Error handling middleware
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel
module.exports = app;