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

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ message: "Authentication required" });
  }
};

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

  app.put("/api/home-content", requireAuth, async (req, res) => {
    try {
      // Check if content exists
      const existing = await db.select().from(homePageContent).limit(1);
      
      if (existing.length === 0) {
        // Create new content
        const [newContent] = await db.insert(homePageContent).values({
          ...req.body,
          updatedAt: new Date()
        }).returning();
        res.json(newContent);
      } else {
        // Update existing content
        const [updatedContent] = await db.update(homePageContent)
          .set({
            ...req.body,
            updatedAt: new Date()
          })
          .where(eq(homePageContent.id, existing[0].id))
          .returning();
        res.json(updatedContent);
      }
    } catch (error) {
      console.error("Home content update error:", error);
      res.status(500).json({ message: "Failed to update home content" });
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

  // Blog Posts CRUD (Protected)
  app.post("/api/blog-posts", requireAuth, async (req, res) => {
    try {
      const [newPost] = await db.insert(blogPosts).values(req.body).returning();
      res.json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      const [updatedPost] = await db.update(blogPosts)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(blogPosts.id, req.params.id))
        .returning();
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Destinations CRUD (Protected)
  app.post("/api/destinations", requireAuth, async (req, res) => {
    try {
      const [newDestination] = await db.insert(destinations).values(req.body).returning();
      res.json(newDestination);
    } catch (error) {
      res.status(500).json({ message: "Failed to create destination" });
    }
  });

  app.put("/api/destinations/:id", requireAuth, async (req, res) => {
    try {
      const [updatedDestination] = await db.update(destinations)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(destinations.id, req.params.id))
        .returning();
      res.json(updatedDestination);
    } catch (error) {
      res.status(500).json({ message: "Failed to update destination" });
    }
  });

  app.delete("/api/destinations/:id", requireAuth, async (req, res) => {
    try {
      await db.delete(destinations).where(eq(destinations.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete destination" });
    }
  });

  // Travel Pins CRUD (Protected)
  app.post("/api/travel-pins", requireAuth, async (req, res) => {
    try {
      const [newPin] = await db.insert(travelPins).values(req.body).returning();
      res.json(newPin);
    } catch (error) {
      res.status(500).json({ message: "Failed to create travel pin" });
    }
  });

  app.put("/api/travel-pins/:id", requireAuth, async (req, res) => {
    try {
      const [updatedPin] = await db.update(travelPins)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(travelPins.id, req.params.id))
        .returning();
      res.json(updatedPin);
    } catch (error) {
      res.status(500).json({ message: "Failed to update travel pin" });
    }
  });

  app.delete("/api/travel-pins/:id", requireAuth, async (req, res) => {
    try {
      await db.delete(travelPins).where(eq(travelPins.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete travel pin" });
    }
  });

  // Gallery Collections CRUD (Protected)
  app.post("/api/gallery", requireAuth, async (req, res) => {
    try {
      const [newCollection] = await db.insert(galleryCollections).values(req.body).returning();
      res.json(newCollection);
    } catch (error) {
      res.status(500).json({ message: "Failed to create gallery collection" });
    }
  });

  app.put("/api/gallery/:id", requireAuth, async (req, res) => {
    try {
      const [updatedCollection] = await db.update(galleryCollections)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(galleryCollections.id, req.params.id))
        .returning();
      res.json(updatedCollection);
    } catch (error) {
      res.status(500).json({ message: "Failed to update gallery collection" });
    }
  });

  app.delete("/api/gallery/:id", requireAuth, async (req, res) => {
    try {
      await db.delete(galleryCollections).where(eq(galleryCollections.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete gallery collection" });
    }
  });

  // Journey Tracking Update (Protected)
  app.put("/api/journey", requireAuth, async (req, res) => {
    try {
      const existing = await db.select().from(journeyTable).limit(1);
      
      if (existing.length === 0) {
        const [newJourney] = await db.insert(journeyTable).values({
          ...req.body,
          lastUpdated: new Date()
        }).returning();
        res.json(newJourney);
      } else {
        const [updatedJourney] = await db.update(journeyTable)
          .set({
            ...req.body,
            lastUpdated: new Date()
          })
          .where(eq(journeyTable.id, existing[0].id))
          .returning();
        res.json(updatedJourney);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update journey tracking" });
    }
  });

  // Admin Stats (Protected)
  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      const posts = await db.select().from(blogPosts);
      const dests = await db.select().from(destinations);
      const galleries = await db.select().from(galleryCollections);
      const pins = await db.select().from(travelPins);
      
      res.json({
        totalPosts: posts.length,
        totalDestinations: dests.length,
        totalGalleries: galleries.length,
        totalPins: pins.length
      });
    } catch (error) {
      res.json({
        totalPosts: 0,
        totalDestinations: 0,
        totalGalleries: 0,
        totalPins: 0
      });
    }
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