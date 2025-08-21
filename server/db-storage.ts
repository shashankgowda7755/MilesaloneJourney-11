import { eq, desc, and, like, or } from "drizzle-orm";
import { db } from "./db";
import { 
  blogPosts, 
  destinations, 
  galleryCollections, 
  galleryMedia, 
  newsletterSubscribers, 
  contactMessages, 
  travelPins, 
  journeyTracking as journeyTable, 
  users 
} from "@shared/schema";
import type {
  BlogPost,
  InsertBlogPost,
  Destination,
  InsertDestination,
  GalleryCollection,
  GalleryCollectionWithMedia,
  GalleryMedia,
  InsertGalleryCollection,
  InsertGalleryMedia,
  NewsletterSubscriber,
  InsertNewsletterSubscriber,
  ContactMessage,
  InsertContactMessage,
  TravelPin,
  InsertTravelPin,
  JourneyTracking,
  InsertJourneyTracking,
  User,
  InsertUser,
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values([user]).returning();
    return createdUser;
  }

  // Blog Posts
  async getBlogPosts(category?: string): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts).where(eq(blogPosts.isVisible, true)).orderBy(desc(blogPosts.publishedAt));
    
    if (category) {
      query = db.select().from(blogPosts).where(
        and(eq(blogPosts.isVisible, true), eq(blogPosts.category, category))
      ).orderBy(desc(blogPosts.publishedAt));
    }
    
    return await query;
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [createdPost] = await db.insert(blogPosts).values([post]).returning();
    return createdPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db.update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount! > 0;
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(and(eq(blogPosts.isVisible, true), eq(blogPosts.isFeatured, true)))
      .orderBy(desc(blogPosts.publishedAt));
  }

  // Destinations
  async getDestinations(category?: string, region?: string): Promise<Destination[]> {
    let whereConditions = [eq(destinations.isVisible, true)];
    
    if (category) {
      whereConditions.push(eq(destinations.category, category));
    }
    if (region) {
      whereConditions.push(eq(destinations.region, region));
    }
    
    return await db.select().from(destinations)
      .where(and(...whereConditions))
      .orderBy(desc(destinations.createdAt));
  }

  async getDestination(slug: string): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.slug, slug));
    return destination;
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [createdDestination] = await db.insert(destinations).values([destination]).returning();
    return createdDestination;
  }

  async updateDestination(id: string, destination: Partial<InsertDestination>): Promise<Destination | undefined> {
    const [updatedDestination] = await db.update(destinations)
      .set({ ...destination, updatedAt: new Date() })
      .where(eq(destinations.id, id))
      .returning();
    return updatedDestination;
  }

  async deleteDestination(id: string): Promise<boolean> {
    const result = await db.delete(destinations).where(eq(destinations.id, id));
    return result.rowCount! > 0;
  }

  async getCurrentLocation(): Promise<Destination | undefined> {
    const [location] = await db.select().from(destinations)
      .where(eq(destinations.isCurrentLocation, true));
    return location;
  }

  // Gallery
  async getGalleryCollections(): Promise<GalleryCollectionWithMedia[]> {
    const collections = await db.select().from(galleryCollections)
      .where(eq(galleryCollections.isVisible, true))
      .orderBy(desc(galleryCollections.createdAt));
    
    const collectionsWithMedia = await Promise.all(
      collections.map(async (collection) => {
        const media = await db.select().from(galleryMedia)
          .where(eq(galleryMedia.collectionId, collection.id))
          .orderBy(galleryMedia.sortOrder);
        
        return {
          ...collection,
          media,
          mediaCount: media.length,
        };
      })
    );
    
    return collectionsWithMedia;
  }

  async getGalleryCollection(id: string): Promise<GalleryCollectionWithMedia | undefined> {
    const [collection] = await db.select().from(galleryCollections)
      .where(eq(galleryCollections.id, id));
    
    if (!collection) return undefined;
    
    const media = await db.select().from(galleryMedia)
      .where(eq(galleryMedia.collectionId, id))
      .orderBy(galleryMedia.sortOrder);
    
    return {
      ...collection,
      media,
      mediaCount: media.length,
    };
  }

  async createGalleryCollection(collection: InsertGalleryCollection): Promise<GalleryCollection> {
    const [createdCollection] = await db.insert(galleryCollections).values([collection]).returning();
    return createdCollection;
  }

  async updateGalleryCollection(id: string, collection: Partial<InsertGalleryCollection>): Promise<GalleryCollection | undefined> {
    const [updatedCollection] = await db.update(galleryCollections)
      .set({ ...collection, updatedAt: new Date() })
      .where(eq(galleryCollections.id, id))
      .returning();
    return updatedCollection;
  }

  async addMediaToCollection(collectionId: string, media: InsertGalleryMedia): Promise<GalleryMedia> {
    const [createdMedia] = await db.insert(galleryMedia).values([{
      ...media,
      collectionId,
    }]).returning();
    return createdMedia;
  }

  async deleteGalleryCollection(id: string): Promise<boolean> {
    // Delete all media in the collection first
    await db.delete(galleryMedia).where(eq(galleryMedia.collectionId, id));
    
    // Then delete the collection
    const result = await db.delete(galleryCollections).where(eq(galleryCollections.id, id));
    return result.rowCount! > 0;
  }

  // Newsletter
  async subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [createdSubscriber] = await db.insert(newsletterSubscribers).values([subscriber]).returning();
    return createdSubscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
  }

  // Contact
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [createdMessage] = await db.insert(contactMessages).values([message]).returning();
    return createdMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const result = await db.update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id));
    return result.rowCount! > 0;
  }

  // Journey Tracking
  async getJourneyTracking(): Promise<JourneyTracking | undefined> {
    const [journey] = await db.select().from(journeyTable).orderBy(desc(journeyTable.lastUpdated));
    return journey;
  }

  async updateJourneyTracking(tracking: InsertJourneyTracking): Promise<JourneyTracking> {
    // Check if a journey exists
    const existingJourney = await this.getJourneyTracking();
    
    if (existingJourney) {
      const [updated] = await db.update(journeyTable)
        .set({ ...tracking, lastUpdated: new Date() })
        .where(eq(journeyTable.id, existingJourney.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(journeyTable).values([tracking]).returning();
      return created;
    }
  }

  // Travel Pins
  async getTravelPins(): Promise<TravelPin[]> {
    return await db.select().from(travelPins)
      .where(eq(travelPins.isVisible, true))
      .orderBy(desc(travelPins.createdAt));
  }

  async getTravelPin(id: string): Promise<TravelPin | undefined> {
    const [pin] = await db.select().from(travelPins).where(eq(travelPins.id, id));
    return pin;
  }

  async createTravelPin(pin: InsertTravelPin): Promise<TravelPin> {
    const [createdPin] = await db.insert(travelPins).values([pin]).returning();
    return createdPin;
  }

  async updateTravelPin(id: string, pin: Partial<InsertTravelPin>): Promise<TravelPin | undefined> {
    const [updatedPin] = await db.update(travelPins)
      .set({ ...pin, updatedAt: new Date() })
      .where(eq(travelPins.id, id))
      .returning();
    return updatedPin;
  }

  async deleteTravelPin(id: string): Promise<boolean> {
    const result = await db.delete(travelPins).where(eq(travelPins.id, id));
    return result.rowCount! > 0;
  }
}