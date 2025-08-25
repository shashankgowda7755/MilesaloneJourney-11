import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use a default DATABASE_URL for development if not set
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/travel_blog_dev';

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: false // Disable SSL for local development
});
export const db = drizzle({ client: pool, schema });
