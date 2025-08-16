// Database setup script for Supabase
import pkg from 'pg';
const { Pool } = pkg;

const setupDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL provided, skipping database setup');
    return;
  }

  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Setting up database tables...');

    // Create tables if they don't exist
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery_collections (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cover_image VARCHAR(500),
        media_count INTEGER DEFAULT 0,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS journey_tracking (
        id SERIAL PRIMARY KEY,
        current_location VARCHAR(255),
        current_coordinates JSONB,
        journey_progress INTEGER DEFAULT 0,
        days_traveled INTEGER DEFAULT 0,
        total_distance INTEGER DEFAULT 0,
        start_date DATE,
        end_date DATE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

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

    console.log('Database tables created successfully!');

    // Insert sample data if tables are empty
    const blogCount = await pool.query('SELECT COUNT(*) FROM blog_posts');
    if (parseInt(blogCount.rows[0].count) === 0) {
      console.log('Inserting sample data...');
      
      await pool.query(`
        INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, category, tags, reading_time, is_featured)
        VALUES 
        ('Delhi Streets: A Culinary Adventure', 'delhi-streets-culinary-adventure', 
         'Exploring the vibrant street food scene of Old Delhi', 
         'My journey through the bustling streets of Old Delhi revealed a world of incredible flavors...', 
         'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 
         'food', ARRAY['delhi', 'street-food', 'culture'], 5, true),
        ('Kashmir Valley: Paradise on Earth', 'kashmir-valley-paradise', 
         'Discovering the breathtaking beauty of Kashmir valley', 
         'The pristine lakes and snow-capped mountains of Kashmir left me speechless...', 
         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 
         'places', ARRAY['kashmir', 'mountains', 'nature'], 7, true);
      `);

      await pool.query(`
        INSERT INTO destinations (name, slug, description, category, region, state, coordinates, featured_image, rating, difficulty, is_featured)
        VALUES 
        ('Srinagar, Kashmir', 'srinagar-kashmir', 
         'The summer capital of Jammu and Kashmir', 
         'Tourist Spot', 'North India', 'Jammu and Kashmir', 
         '{"lat": 34.0837, "lng": 74.7973}', 
         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 
         5, 'Easy', true),
        ('Kanyakumari, Tamil Nadu', 'kanyakumari-tamil-nadu', 
         'The southernmost tip of India', 
         'Tourist Spot', 'South India', 'Tamil Nadu', 
         '{"lat": 8.0883, "lng": 77.5385}', 
         'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', 
         5, 'Easy', true);
      `);

      await pool.query(`
        INSERT INTO gallery_collections (title, description, cover_image, media_count, location)
        VALUES 
        ('Kashmir Valley Adventures', 'Beautiful landscapes from the Kashmir valley', 
         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 12, 'Kashmir, India'),
        ('South India Temples', 'Ancient temples and cultural heritage', 
         'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', 8, 'Tamil Nadu, India');
      `);

      await pool.query(`
        INSERT INTO journey_tracking (current_location, current_coordinates, journey_progress, days_traveled, total_distance, start_date, end_date)
        VALUES 
        ('Kanyakumari, Tamil Nadu', '{"lat": 8.0883, "lng": 77.5385}', 100, 120, 3500, '2024-01-01', '2024-04-30');
      `);

      await pool.query(`
        INSERT INTO travel_pins (name, description, coordinates, rating, visit_date, notes)
        VALUES 
        ('Kashmir Valley', 'Beautiful valley with pristine lakes', '{"lat": 34.0837, "lng": 74.7973}', 5, '2024-01-15', 'Absolutely stunning scenery'),
        ('Kanyakumari', 'Southern tip of India', '{"lat": 8.0883, "lng": 77.5385}', 5, '2024-04-30', 'Perfect sunrise and sunset views');
      `);

      console.log('Sample data inserted successfully!');
    }

  } catch (error) {
    console.error('Database setup error:', error);
  } finally {
    await pool.end();
  }
};

export { setupDatabase };