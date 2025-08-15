import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image").notNull(),
  category: text("category").notNull(), // adventure, culture, food, people, places
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  readingTime: integer("reading_time").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(true),
  // Social media integration
  instagramPostUrl: text("instagram_post_url"),
  twitterPostUrl: text("twitter_post_url"),
  facebookPostUrl: text("facebook_post_url"),
  youtubeVideoUrl: text("youtube_video_url"),
  socialMediaHashtags: jsonb("social_media_hashtags").$type<string[]>().notNull().default([]),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Destinations
export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  detailedDescription: text("detailed_description").notNull(),
  category: text("category").notNull(), // Trek Place, Tourist Spot, Beach, Historical, etc.
  region: text("region").notNull(), // North India, South India, etc.
  state: text("state").notNull(),
  coordinates: jsonb("coordinates").$type<{lat: number, lng: number}>().notNull(),
  featuredImage: text("featured_image").notNull(),
  bestTimeToVisit: text("best_time_to_visit").notNull(),
  recommendedStay: text("recommended_stay").notNull(),
  budgetRange: text("budget_range").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  activities: jsonb("activities").$type<string[]>().notNull().default([]),
  rating: integer("rating").notNull().default(5),
  difficulty: text("difficulty").notNull(), // Easy, Moderate, Challenging
  relatedGalleryId: varchar("related_gallery_id").references(() => galleryCollections.id),
  relatedBlogPosts: jsonb("related_blog_posts").$type<string[]>().notNull().default([]), // Array of blog post IDs
  isCurrentLocation: boolean("is_current_location").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(true),
  // Social media integration
  instagramPostUrl: text("instagram_post_url"),
  twitterPostUrl: text("twitter_post_url"),
  facebookPostUrl: text("facebook_post_url"),
  youtubeVideoUrl: text("youtube_video_url"),
  socialMediaHashtags: jsonb("social_media_hashtags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Gallery collections
export const galleryCollections = pgTable("gallery_collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  mediaCount: integer("media_count").notNull().default(0),
  location: text("location"),
  youtubeUrl: text("youtube_url"), // YouTube video URL for the collection
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Gallery media items
export const galleryMedia = pgTable("gallery_media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collectionId: varchar("collection_id").notNull().references(() => galleryCollections.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // photo, video, youtube, embedded_video, link
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"), // For videos and links
  title: text("title"), // For links and embedded content
  caption: text("caption"),
  embedCode: text("embed_code"), // For embedded videos
  linkUrl: text("link_url"), // For external links
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Newsletter subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

// Contact messages
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Journey tracking
export const journeyTracking = pgTable("journey_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currentLocation: text("current_location").notNull(),
  currentCoordinates: jsonb("current_coordinates").$type<{lat: number, lng: number}>().notNull(),
  journeyProgress: integer("journey_progress").notNull().default(0), // percentage
  daysTraveled: integer("days_traveled").notNull().default(0),
  statesCovered: integer("states_covered").notNull().default(0),
  distanceCovered: integer("distance_covered").notNull().default(0), // kilometers
  // Social media integration for journey updates
  instagramStoryUrl: text("instagram_story_url"),
  instagramReelUrl: text("instagram_reel_url"),
  twitterUpdateUrl: text("twitter_update_url"),
  youtubeShortUrl: text("youtube_short_url"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const travelPins = pgTable("travel_pins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  coordinates: jsonb("coordinates").$type<{lat: number, lng: number}>().notNull(),
  country: text("country").notNull(),
  city: text("city"),
  visitedDate: timestamp("visited_date"),
  pinType: text("pin_type").$type<'visited' | 'current' | 'planned' | 'favorite'>().notNull().default('visited'),
  pinColor: text("pin_color").notNull().default('#E07A3E'), // Brand orange as default
  images: text("images").array().default([]),
  tags: text("tags").array().default([]),
  rating: integer("rating").default(0), // 1-5 stars
  notes: text("notes"),
  isVisible: boolean("is_visible").notNull().default(true),
  // Social media integration
  instagramPostUrl: text("instagram_post_url"),
  twitterPostUrl: text("twitter_post_url"),
  facebookPostUrl: text("facebook_post_url"),
  youtubeVideoUrl: text("youtube_video_url"),
  socialMediaHashtags: jsonb("social_media_hashtags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGalleryCollectionSchema = createInsertSchema(galleryCollections).omit({
  id: true,
  mediaCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGalleryMediaSchema = createInsertSchema(galleryMedia).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  isActive: true,
  subscribedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertJourneyTrackingSchema = createInsertSchema(journeyTracking).omit({
  id: true,
  lastUpdated: true,
});

export const insertTravelPinSchema = createInsertSchema(travelPins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertGalleryCollection = z.infer<typeof insertGalleryCollectionSchema>;
export type GalleryCollection = typeof galleryCollections.$inferSelect;

export type InsertGalleryMedia = z.infer<typeof insertGalleryMediaSchema>;
export type GalleryMedia = typeof galleryMedia.$inferSelect;

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertJourneyTracking = z.infer<typeof insertJourneyTrackingSchema>;
export type JourneyTracking = typeof journeyTracking.$inferSelect;

export type InsertTravelPin = z.infer<typeof insertTravelPinSchema>;
export type TravelPin = typeof travelPins.$inferSelect;

// Extended types with relations
export type GalleryCollectionWithMedia = GalleryCollection & {
  media: GalleryMedia[];
};
