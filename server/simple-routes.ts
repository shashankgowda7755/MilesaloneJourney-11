import type { Express } from "express";
import { createServer, type Server } from "http";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
import { db } from "./db";
import { 
  blogPosts, 
  destinations, 
  galleryCollections, 
  contactMessages,
  travelPins, 
  journeyTracking as journeyTable, 
  users,
  homePageContent 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple development API routes - production uses api/index.js
  
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
  });

  // Blog Posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await db.select().from(blogPosts);
      res.json(posts);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/blog-posts/featured", async (req, res) => {
    try {
      const posts = await db.select().from(blogPosts).where(eq(blogPosts.isFeatured, true));
      res.json(posts);
    } catch (error) {
      res.json([]);
    }
  });

  // Destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const dests = await db.select().from(destinations);
      res.json(dests);
    } catch (error) {
      res.json([]);
    }
  });

  // Gallery
  app.get("/api/gallery", async (req, res) => {
    try {
      const galleries = await db.select().from(galleryCollections);
      res.json(galleries);
    } catch (error) {
      res.json([]);
    }
  });

  // Travel Pins
  app.get("/api/travel-pins", async (req, res) => {
    try {
      const pins = await db.select().from(travelPins);
      res.json(pins);
    } catch (error) {
      res.json([]);
    }
  });

  // Home Content
  app.get("/api/home-content", async (req, res) => {
    try {
      const [content] = await db.select().from(homePageContent);
      res.json(content || {});
    } catch (error) {
      res.json({});
    }
  });

  app.put("/api/home-content", async (req, res) => {
    try {
      // Simple update for development - production uses api/index.js
      res.json({ id: "dev", ...req.body, updatedAt: new Date() });
    } catch (error) {
      res.status(500).json({ message: "Failed to update" });
    }
  });

  // Journey
  app.get("/api/journey", async (req, res) => {
    try {
      const [journey] = await db.select().from(journeyTable);
      res.json(journey || {});
    } catch (error) {
      res.json({});
    }
  });

  // Admin Stats
  app.get("/api/admin/stats", async (req, res) => {
    res.json({
      totalPosts: 0,
      totalDestinations: 0,
      totalGalleries: 0,
      totalPins: 0
    });
  });

  // Auth endpoints  
  app.get("/api/auth/user", (req, res) => {
    if (req.session?.userId) {
      res.json({ id: "admin", name: "Administrator" });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    
    if (username === "admins" && password === "Travel@2025") {
      req.session.userId = "admin";
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  const server = createServer(app);
  return server;
}