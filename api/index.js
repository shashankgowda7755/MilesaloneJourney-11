// Vercel serverless function handler for the travel blog API
import express from 'express';
import session from 'express-session';
import { Pool } from 'pg';

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

// Database setup for Supabase
let pool;
let databaseSetup = false;

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

// Database setup function
const setupDatabase = async () => {
  if (!process.env.DATABASE_URL || databaseSetup) {
    return;
  }

  try {
    console.log('Setting up database tables...');

    // Create blog_posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT,
        featured_image VARCHAR(500),
        category VARCHAR(50),
        tags TEXT[],
        reading_time INTEGER DEFAULT 5,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create destinations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        category VARCHAR(100),
        region VARCHAR(100),
        state VARCHAR(100),
        coordinates JSONB,
        featured_image VARCHAR(500),
        rating INTEGER DEFAULT 5,
        difficulty VARCHAR(50) DEFAULT 'Easy',
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create travel_pins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS travel_pins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        coordinates JSONB NOT NULL,
        rating INTEGER DEFAULT 5,
        visit_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert sample data if tables are empty
    const blogCount = await pool.query('SELECT COUNT(*) FROM blog_posts');
    if (parseInt(blogCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO blog_posts (title, slug, excerpt, featured_image, category, tags, reading_time, is_featured)
        VALUES 
        ('Delhi Streets: A Culinary Adventure', 'delhi-streets-culinary-adventure', 
         'Exploring the vibrant street food scene of Old Delhi', 
         'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 
         'food', ARRAY['delhi', 'street-food', 'culture'], 5, true);
      `);

      await pool.query(`
        INSERT INTO destinations (name, slug, description, category, region, state, coordinates, featured_image, rating, difficulty, is_featured)
        VALUES 
        ('Srinagar, Kashmir', 'srinagar-kashmir', 
         'The summer capital of Jammu and Kashmir', 
         'Tourist Spot', 'North India', 'Jammu and Kashmir', 
         '{"lat": 34.0837, "lng": 74.7973}', 
         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 
         5, 'Easy', true);
      `);

      await pool.query(`
        INSERT INTO travel_pins (name, description, coordinates, rating, visit_date, notes)
        VALUES 
        ('Kashmir Valley', 'Beautiful valley with pristine lakes', '{"lat": 34.0837, "lng": 74.7973}', 5, '2024-01-15', 'Absolutely stunning scenery');
      `);
    }

    databaseSetup = true;
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup error:', error);
  }
};

const ensureDatabase = async () => {
  if (!databaseSetup && process.env.DATABASE_URL) {
    await setupDatabase();
  }
};

// Test route
app.get('/api/test', async (req, res) => {
  await ensureDatabase();
  res.json({ message: 'Travel Blog API is working!', timestamp: new Date().toISOString() });
});

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

// Featured blog posts
app.get('/api/blog-posts/featured', async (req, res) => {
  try {
    await ensureDatabase();
    
    if (pool) {
      const result = await pool.query('SELECT * FROM blog_posts WHERE is_featured = true ORDER BY created_at DESC LIMIT 3');
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
    console.error('Featured blog posts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Destinations API
app.get('/api/destinations', async (req, res) => {
  try {
    await ensureDatabase();
    
    if (pool) {
      const result = await pool.query('SELECT * FROM destinations ORDER BY created_at DESC');
      const destinations = result.rows.map(row => ({
        id: row.id.toString(),
        name: row.name,
        slug: row.slug,
        description: row.description,
        category: row.category,
        region: row.region,
        state: row.state,
        coordinates: row.coordinates,
        featuredImage: row.featured_image,
        rating: row.rating,
        difficulty: row.difficulty,
        isFeatured: row.is_featured
      }));
      res.json(destinations);
    } else {
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
    }
  } catch (error) {
    console.error('Destinations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Travel pins API
app.get('/api/travel-pins', async (req, res) => {
  try {
    await ensureDatabase();
    
    if (pool) {
      const result = await pool.query('SELECT * FROM travel_pins ORDER BY created_at DESC');
      const pins = result.rows.map(row => ({
        name: row.name,
        description: row.description,
        coordinates: row.coordinates,
        rating: row.rating,
        visitDate: row.visit_date,
        notes: row.notes
      }));
      res.json(pins);
    } else {
      res.json([
        {
          name: "Kashmir Valley",
          description: "Beautiful valley with pristine lakes",
          coordinates: { lat: 34.0837, lng: 74.7973 },
          rating: 5,
          visitDate: "2024-01-15",
          notes: "Absolutely stunning scenery"
        }
      ]);
    }
  } catch (error) {
    console.error('Travel pins error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Gallery API
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
    console.error('Gallery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Journey API
app.get('/api/journey', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Journey error:', error);
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

// Admin stats API
app.get('/api/admin/stats', async (req, res) => {
  try {
    await ensureDatabase();
    
    if (pool) {
      const [postsResult, destinationsResult, pinsResult] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM blog_posts'),
        pool.query('SELECT COUNT(*) FROM destinations'),
        pool.query('SELECT COUNT(*) FROM travel_pins')
      ]);
      
      res.json({
        totalPosts: parseInt(postsResult.rows[0].count),
        totalDestinations: parseInt(destinationsResult.rows[0].count),
        totalPins: parseInt(pinsResult.rows[0].count),
        totalGalleries: 1
      });
    } else {
      res.json({
        totalPosts: 1,
        totalDestinations: 1,
        totalPins: 1,
        totalGalleries: 1
      });
    }
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel
export default app;