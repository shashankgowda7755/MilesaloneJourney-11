import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertBlogPostSchema,
  insertDestinationSchema,
  insertGalleryCollectionSchema,
  insertGalleryMediaSchema,
  insertNewsletterSubscriberSchema,
  insertContactMessageSchema,
  insertJourneyTrackingSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog Posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const { category } = req.query;
      const posts = await storage.getBlogPosts(category as string);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/featured", async (req, res) => {
    try {
      const posts = await storage.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog-posts/by-id/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post by ID:", error);
      res.status(500).json({ message: "Failed to fetch blog post by ID" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // Destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const { category, region } = req.query;
      const destinations = await storage.getDestinations(category as string, region as string);
      res.json(destinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/current", async (req, res) => {
    try {
      const destination = await storage.getCurrentLocation();
      res.json(destination);
    } catch (error) {
      console.error("Error fetching current location:", error);
      res.status(500).json({ message: "Failed to fetch current location" });
    }
  });

  app.get("/api/destinations/:slug", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.slug);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      console.error("Error fetching destination:", error);
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });

  app.post("/api/destinations", async (req, res) => {
    try {
      const validatedData = insertDestinationSchema.parse(req.body);
      const destination = await storage.createDestination(validatedData);
      res.status(201).json(destination);
    } catch (error) {
      console.error("Error creating destination:", error);
      res.status(500).json({ message: "Failed to create destination" });
    }
  });

  // Gallery
  app.get("/api/gallery", async (req, res) => {
    try {
      const collections = await storage.getGalleryCollections();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching gallery collections:", error);
      res.status(500).json({ message: "Failed to fetch gallery collections" });
    }
  });

  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const collection = await storage.getGalleryCollection(req.params.id);
      if (!collection) {
        return res.status(404).json({ message: "Gallery collection not found" });
      }
      res.json(collection);
    } catch (error) {
      console.error("Error fetching gallery collection:", error);
      res.status(500).json({ message: "Failed to fetch gallery collection" });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const validatedData = insertGalleryCollectionSchema.parse(req.body);
      const collection = await storage.createGalleryCollection(validatedData);
      res.status(201).json(collection);
    } catch (error) {
      console.error("Error creating gallery collection:", error);
      res.status(500).json({ message: "Failed to create gallery collection" });
    }
  });

  app.post("/api/gallery/:id/media", async (req, res) => {
    try {
      const validatedData = insertGalleryMediaSchema.parse({
        ...req.body,
        collectionId: req.params.id,
      });
      const media = await storage.addMediaToCollection(req.params.id, validatedData);
      res.status(201).json(media);
    } catch (error) {
      console.error("Error adding media to collection:", error);
      res.status(500).json({ message: "Failed to add media to collection" });
    }
  });

  // Newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeNewsletter(validatedData);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  app.get("/api/newsletter/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      res.status(500).json({ message: "Failed to fetch newsletter subscribers" });
    }
  });

  // Contact
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/contact/messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.patch("/api/contact/messages/:id/read", async (req, res) => {
    try {
      const success = await storage.markMessageAsRead(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Journey Tracking
  app.get("/api/journey", async (req, res) => {
    try {
      const journey = await storage.getJourneyTracking();
      res.json(journey);
    } catch (error) {
      console.error("Error fetching journey tracking:", error);
      res.status(500).json({ message: "Failed to fetch journey tracking" });
    }
  });

  app.put("/api/journey", async (req, res) => {
    try {
      const validatedData = insertJourneyTrackingSchema.parse(req.body);
      const journey = await storage.updateJourneyTracking(validatedData);
      res.json(journey);
    } catch (error) {
      console.error("Error updating journey tracking:", error);
      res.status(500).json({ message: "Failed to update journey tracking" });
    }
  });

  // Admin endpoints
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const [blogPosts, destinations, galleryCollections, messages] = await Promise.all([
        storage.getBlogPosts(),
        storage.getDestinations(),
        storage.getGalleryCollections(),
        storage.getContactMessages()
      ]);

      res.json({
        totalPosts: blogPosts.length,
        totalDestinations: destinations.length,
        totalCollections: galleryCollections.length,
        totalMessages: messages.length,
        unreadMessages: messages.filter(m => !m.isRead).length,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Additional CRUD endpoints
  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  app.put("/api/destinations/:id", async (req, res) => {
    try {
      const validatedData = insertDestinationSchema.partial().parse(req.body);
      const destination = await storage.updateDestination(req.params.id, validatedData);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      console.error("Error updating destination:", error);
      res.status(500).json({ message: "Failed to update destination" });
    }
  });

  app.delete("/api/destinations/:id", async (req, res) => {
    try {
      const success = await storage.deleteDestination(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json({ message: "Destination deleted successfully" });
    } catch (error) {
      console.error("Error deleting destination:", error);
      res.status(500).json({ message: "Failed to delete destination" });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const success = await storage.deleteGalleryCollection(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Gallery collection not found" });
      }
      res.json({ message: "Gallery collection deleted successfully" });
    } catch (error) {
      console.error("Error deleting gallery collection:", error);
      res.status(500).json({ message: "Failed to delete gallery collection" });
    }
  });

  // Simple username and password authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple username and password check
      if (username === "admin" && password === "123456") {
        // Store user session
        req.session = req.session || {};
        (req.session as any).user = {
          id: "admin",
          name: "Administrator",
          email: "admin@travel-blog.com",
          username: "admin"
        };
        
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  app.get("/api/auth/user", (req, res) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    try {
      req.session?.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
