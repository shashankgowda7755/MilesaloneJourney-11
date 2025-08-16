import {
  type User,
  type InsertUser,
  type BlogPost,
  type InsertBlogPost,
  type Destination,
  type InsertDestination,
  type GalleryCollection,
  type InsertGalleryCollection,
  type GalleryMedia,
  type InsertGalleryMedia,
  type GalleryCollectionWithMedia,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type ContactMessage,
  type InsertContactMessage,
  type JourneyTracking,
  type InsertJourneyTracking,
  type TravelPin,
  type InsertTravelPin,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog Posts
  getBlogPosts(category?: string): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;

  // Destinations
  getDestinations(category?: string, region?: string): Promise<Destination[]>;
  getDestination(slug: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: string, destination: Partial<InsertDestination>): Promise<Destination | undefined>;
  deleteDestination(id: string): Promise<boolean>;
  getCurrentLocation(): Promise<Destination | undefined>;

  // Gallery
  getGalleryCollections(): Promise<GalleryCollectionWithMedia[]>;
  getGalleryCollection(id: string): Promise<GalleryCollectionWithMedia | undefined>;
  createGalleryCollection(collection: InsertGalleryCollection): Promise<GalleryCollection>;
  updateGalleryCollection(id: string, collection: Partial<InsertGalleryCollection>): Promise<GalleryCollection | undefined>;
  addMediaToCollection(collectionId: string, media: InsertGalleryMedia): Promise<GalleryMedia>;
  deleteGalleryCollection(id: string): Promise<boolean>;

  // Newsletter
  subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;

  // Contact
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markMessageAsRead(id: string): Promise<boolean>;

  // Journey Tracking
  getJourneyTracking(): Promise<JourneyTracking | undefined>;
  updateJourneyTracking(tracking: InsertJourneyTracking): Promise<JourneyTracking>;

  // Travel Pins
  getTravelPins(): Promise<TravelPin[]>;
  getTravelPin(id: string): Promise<TravelPin | undefined>;
  createTravelPin(pin: InsertTravelPin): Promise<TravelPin>;
  updateTravelPin(id: string, pin: Partial<InsertTravelPin>): Promise<TravelPin | undefined>;
  deleteTravelPin(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private destinations: Map<string, Destination> = new Map();
  private galleryCollections: Map<string, GalleryCollection> = new Map();
  private galleryMedia: Map<string, GalleryMedia[]> = new Map();
  private newsletterSubscribers: Map<string, NewsletterSubscriber> = new Map();
  private contactMessages: Map<string, ContactMessage> = new Map();
  private journeyTracking: JourneyTracking | undefined;
  private travelPins: Map<string, TravelPin> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private getThemedImages(collectionId: string): string[] {
    const imageCollections = {
      'kashmir-floating-gardens': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1571018621578-de0c7d7c60ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1605538883669-825200433431?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1586500036706-41963de24d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
      ],
      'royal-rajasthan': [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1583395496271-c7dbe8cb18ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1560414443-a9d3a46d4ed8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1604050854152-30fd728f93b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
      ],
      'cultural-celebrations': [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1582802551599-ded14d515ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1560414443-a9d3a46d4ed8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1609155391331-83a3eaed86a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
      ],
      'mountain-adventures': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1605538883669-825200433431?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
      ],
      'coastal-journeys': [
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        'https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
      ]
    };
    
    return imageCollections[collectionId as keyof typeof imageCollections] || imageCollections['kashmir-floating-gardens'];
  }

  private getImageCaption(collectionId: string, index: number): string {
    const captions = {
      'kashmir-floating-gardens': [
        'Floating gardens on Dal Lake in early morning mist',
        'Traditional houseboats with mountain backdrop',
        'Shikara vendors selling fresh produce',
        'Sunset reflections on Dal Lake',
        'Local fishermen casting nets at dawn'
      ],
      'royal-rajasthan': [
        'Desert dunes stretching into the horizon',
        'Camel caravan crossing the Thar Desert',
        'Traditional desert village life',
        'Spectacular desert sunset with silhouettes',
        'Sand dunes patterns shaped by wind'
      ],
      'cultural-celebrations': [
        'Traditional dance performance during festival',
        'Colorful rangoli art during celebration',
        'Local musicians playing traditional instruments',
        'Festival lights illuminating the night',
        'Community gathering for cultural ceremony'
      ],
      'mountain-adventures': [
        'Himalayan peaks covered in snow',
        'Trekking path through mountain villages',
        'Ancient mountain temple at sunrise',
        'Valley view from mountain peak',
        'Local villagers in traditional clothing'
      ],
      'coastal-journeys': [
        'Serene backwaters with coconut palms',
        'Traditional fishing boats at harbor',
        'Coastal village life at sunset',
        'Rocky shores with crashing waves',
        'Lighthouse standing guard over the coast'
      ]
    };
    
    const collectionCaptions = captions[collectionId as keyof typeof captions] || captions['kashmir-floating-gardens'];
    return collectionCaptions[index % collectionCaptions.length];
  }

  private initializeDefaultData() {
    // Initialize journey tracking
    this.journeyTracking = {
      id: randomUUID(),
      currentLocation: "Mysuru, Karnataka",
      currentCoordinates: { lat: 12.2958, lng: 76.6394 },
      journeyProgress: 65,
      daysTraveled: 78,
      statesCovered: 9,
      distanceCovered: 1950,
      instagramStoryUrl: null,
      instagramReelUrl: null,
      twitterUpdateUrl: null,
      youtubeShortUrl: null,
      lastUpdated: new Date(),
    };

    // Initialize sample travel pins
    const travelPinsData: InsertTravelPin[] = [
      {
        name: "Kashmir Valley",
        description: "Beautiful valley surrounded by mountains",
        country: "India",
        city: "Srinagar",
        coordinates: { lat: 34.0837, lng: 74.7973 },
        pinType: "visited",
        pinColor: "#E07A3E",
        visitedDate: new Date("2024-01-15"),
        rating: 5,
        notes: "Absolutely stunning place with amazing houseboats",
        isVisible: true,
      },
      {
        name: "Golden Temple",
        description: "Sacred Sikh gurdwara in Amritsar",
        country: "India",
        city: "Amritsar",
        coordinates: { lat: 31.6200, lng: 74.8765 },
        pinType: "visited",
        pinColor: "#FFD700",
        visitedDate: new Date("2024-02-10"),
        rating: 5,
        notes: "Spiritual and peaceful experience",
        isVisible: true,
      },
      {
        name: "Mysuru Palace",
        description: "Current location - magnificent royal palace",
        country: "India",
        city: "Mysuru",
        coordinates: { lat: 12.2958, lng: 76.6394 },
        pinType: "current",
        pinColor: "#FF6B6B",
        visitedDate: new Date("2024-03-20"),
        rating: 5,
        notes: "Currently exploring this cultural capital",
        isVisible: true,
      },
      {
        name: "Kanyakumari",
        description: "Southernmost tip of India - planned destination",
        country: "India",
        city: "Kanyakumari",
        coordinates: { lat: 8.0883, lng: 77.5385 },
        pinType: "planned",
        pinColor: "#9B59B6",
        rating: 0,
        notes: "Final destination of the journey",
        isVisible: true,
      },
    ];

    travelPinsData.forEach((pinData) => {
      const id = randomUUID();
      const pin: TravelPin = {
        ...pinData,
        id,
        description: pinData.description || null,
        images: pinData.images || [],
        tags: pinData.tags || null,
        isVisible: pinData.isVisible ?? true,
        instagramPostUrl: null,
        twitterPostUrl: null,
        facebookPostUrl: null,
        youtubeVideoUrl: null,
        socialMediaHashtags: [],
        notes: pinData.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.travelPins.set(id, pin);
    });

    // Initialize destinations
    const destinationsData: InsertDestination[] = [
      {
        name: "Srinagar, Kashmir",
        slug: "srinagar-kashmir",
        description: "The Venice of the East with its famous Dal Lake, floating gardens, and houseboat experiences.",
        detailedDescription: "Srinagar, the summer capital of Jammu and Kashmir, is renowned for its natural beauty, gardens, waterfronts and houseboats. The city lies on the banks of the Jhelum River, a tributary of the Indus, and Dal and Anchar lakes. Experience the magical floating markets, stay in traditional houseboats, and explore centuries-old Mughal gardens that showcase the region's rich heritage.",
        category: "Mountain Destination",
        region: "North India",
        state: "Jammu & Kashmir",
        coordinates: { lat: 34.0837, lng: 74.7973 },
        featuredImage: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        bestTimeToVisit: "April - October",
        recommendedStay: "3-4 days",
        budgetRange: "₹1,500-3,000/day",
        highlights: ["Houseboat Stay", "Shikara Rides", "Mughal Gardens", "Dal Lake"],
        activities: ["Boating", "Trekking", "Photography", "Cultural Tours"],
        rating: 49,
        difficulty: "Easy",
        relatedGalleryId: null, // Will be populated with actual gallery ID
        relatedBlogPosts: [], // Will be populated with blog post IDs
        isCurrentLocation: false,
        isFeatured: true,
      },
      {
        name: "Jaipur, Rajasthan",
        slug: "jaipur-rajasthan",
        description: "The Pink City showcases royal Rajasthani architecture, vibrant bazaars, and magnificent palaces.",
        detailedDescription: "Jaipur, the capital of Rajasthan, is known as the Pink City due to the color of the stone used exclusively in the walled city. The city is famous for its forts, palaces, and rich cultural heritage.",
        category: "Historical Site",
        region: "West India",
        state: "Rajasthan",
        coordinates: { lat: 26.9124, lng: 75.7873 },
        featuredImage: "https://images.unsplash.com/photo-1599661046827-dacde645976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        bestTimeToVisit: "October - March",
        recommendedStay: "2-3 days",
        budgetRange: "₹1,200-2,500/day",
        highlights: ["Amber Fort", "City Palace", "Hawa Mahal", "Local Bazaars"],
        activities: ["Palace Tours", "Shopping", "Cultural Shows", "Heritage Walks"],
        rating: 47,
        difficulty: "Easy",
        isCurrentLocation: false,
        isFeatured: true,
      },
      {
        name: "Goa Beaches",
        slug: "goa-beaches",
        description: "Beyond the party reputation, Goa offers Portuguese heritage, spice plantations, and pristine coastlines.",
        detailedDescription: "Goa is India's smallest state by area and is located on the western coast. It was a Portuguese colony until 1961, and this colonial past is evident in its architecture, cuisine, and culture.",
        category: "Beach Location",
        region: "West India",
        state: "Goa",
        coordinates: { lat: 15.2993, lng: 74.1240 },
        featuredImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        bestTimeToVisit: "November - February",
        recommendedStay: "4-5 days",
        budgetRange: "₹1,000-2,000/day",
        highlights: ["Beach Life", "Portuguese Churches", "Spice Tours", "Sunset Views"],
        activities: ["Beach Activities", "Water Sports", "Heritage Tours", "Nightlife"],
        rating: 46,
        difficulty: "Easy",
        isCurrentLocation: false,
        isFeatured: true,
      },
      {
        name: "Mysuru, Karnataka",
        slug: "mysuru-karnataka",
        description: "The cultural capital of Karnataka, known for its magnificent palace, yoga heritage, and silk production.",
        detailedDescription: "Mysuru, formerly known as Mysore, is a city in the state of Karnataka. It is famous for its heritage structures, royal palaces, and is known as the Cultural Capital of Karnataka.",
        category: "Cultural Hub",
        region: "South India",
        state: "Karnataka",
        coordinates: { lat: 12.2958, lng: 76.6394 },
        featuredImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        bestTimeToVisit: "October - March",
        recommendedStay: "2-3 days",
        budgetRange: "₹800-1,800/day",
        highlights: ["Mysore Palace", "Yoga Centers", "Chamundi Hills", "Silk Weaving"],
        activities: ["Palace Tours", "Yoga Classes", "Hill Climbing", "Shopping"],
        rating: 48,
        difficulty: "Easy",
        isCurrentLocation: true,
        isFeatured: true,
      },
      {
        name: "Kerala Backwaters",
        slug: "kerala-backwaters",
        description: "A network of interconnected canals, rivers, and lakes offering peaceful houseboat journeys.",
        detailedDescription: "The Kerala backwaters are a network of brackish lagoons and lakes lying parallel to the Arabian Sea coast of Kerala state in southern India.",
        category: "Natural Wonder",
        region: "South India",
        state: "Kerala",
        coordinates: { lat: 9.5916, lng: 76.5222 },
        featuredImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        bestTimeToVisit: "September - March",
        recommendedStay: "2-3 days",
        budgetRange: "₹1,500-3,500/day",
        highlights: ["Houseboat Cruises", "Village Visits", "Ayurvedic Spas", "Bird Watching"],
        activities: ["Boating", "Village Tours", "Spa Treatments", "Photography"],
        rating: 49,
        difficulty: "Easy",
        isCurrentLocation: false,
        isFeatured: false,
      },
      {
        name: "Kanyakumari, Tamil Nadu",
        slug: "kanyakumari-tamil-nadu",
        description: "Land's End India, where the Arabian Sea, Bay of Bengal, and Indian Ocean meet.",
        detailedDescription: "Kanyakumari is a coastal town in the state of Tamil Nadu on India's southern tip. It's known for its spectacular sunrises and sunsets over the ocean.",
        category: "Coastal Destination",
        region: "South India",
        state: "Tamil Nadu",
        coordinates: { lat: 8.0883, lng: 77.0200 },
        featuredImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        bestTimeToVisit: "October - March",
        recommendedStay: "1-2 days",
        budgetRange: "₹800-1,500/day",
        highlights: ["Sunrise Point", "Vivekananda Memorial", "Three Seas", "Southernmost Tip"],
        activities: ["Sunrise Viewing", "Memorial Visit", "Beach Walks", "Ferry Rides"],
        rating: 45,
        difficulty: "Easy",
        isCurrentLocation: false,
        isFeatured: false,
      },
    ];

    // First create sample gallery collections with consistent IDs
    const galleryData = [
      {
        id: "kashmir-floating-gardens",
        title: "Kashmir Valley Adventures",
        description: "A visual journey through Dal Lake's famous floating gardens and traditional houseboats",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        mediaCount: 15,
        location: "Srinagar, Kashmir",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Sample travel video
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "royal-rajasthan",
        title: "Rajasthan Desert Life",
        description: "The raw beauty of Thar Desert, camel safaris, nomadic communities, and the incredible resilience of life in one of India's most challenging landscapes",
        coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        mediaCount: 18,
        location: "Rajasthan, India",
        youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw", // Sample desert video
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cultural-celebrations",
        title: "Cultural Celebrations",
        description: "Vibrant festivals, traditional ceremonies, and local celebrations that showcase India's rich cultural diversity",
        coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        mediaCount: 22,
        location: "Various Locations",
        youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0", // Sample cultural video
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "mountain-adventures",
        title: "Mountain Adventures",
        description: "Trekking through the Himalayas, discovering hidden villages, and experiencing the raw beauty of India's mountain regions",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        mediaCount: 16,
        location: "Himachal Pradesh",
        youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", // Sample mountain video
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "coastal-journeys",
        title: "Coastal Journeys",
        description: "From Kerala's serene backwaters to Tamil Nadu's rocky shores, exploring India's diverse coastal landscapes",
        coverImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        mediaCount: 14,
        location: "Southern Coast",
        youtubeUrl: "https://www.youtube.com/watch?v=ZZ5LpwO-An4", // Sample coastal video
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Store galleries  
    galleryData.forEach(gallery => {
      const galleryCollection: GalleryCollection = {
        ...gallery,
        location: gallery.location || null,
        youtubeUrl: gallery.youtubeUrl || null,
        isVisible: true,
      };
      this.galleryCollections.set(gallery.id, galleryCollection);
      
      // Initialize some sample media for each collection with themed images
      const mediaItems: GalleryMedia[] = [];
      const imageUrls = this.getThemedImages(gallery.id);
      
      for (let i = 0; i < gallery.mediaCount; i++) {
        mediaItems.push({
          id: randomUUID(),
          collectionId: gallery.id,
          type: 'photo',
          url: imageUrls[i % imageUrls.length],
          title: null,
          caption: this.getImageCaption(gallery.id, i),
          thumbnailUrl: null,
          embedCode: null,
          linkUrl: null,
          sortOrder: i,
          createdAt: new Date(),
        });
      }
      this.galleryMedia.set(gallery.id, mediaItems);
    });

    destinationsData.forEach(dest => {
      const destination: Destination = {
        ...dest,
        id: randomUUID(),
        highlights: dest.highlights || [],
        activities: dest.activities || [],
        rating: dest.rating ?? 30,
        isFeatured: dest.isFeatured ?? false,
        isVisible: true,
        isCurrentLocation: dest.isCurrentLocation ?? false,
        instagramPostUrl: null,
        twitterPostUrl: null,
        facebookPostUrl: null,
        youtubeVideoUrl: null,
        socialMediaHashtags: [],
        // Connect destinations with galleries
        relatedGalleryId: dest.slug === 'srinagar-kashmir' ? "kashmir-floating-gardens" : 
                          dest.slug === 'jaipur-rajasthan' ? "royal-rajasthan" : null,
        relatedBlogPosts: dest.relatedBlogPosts || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.destinations.set(destination.id, destination);
    });

    // Initialize blog posts
    const blogPostsData: InsertBlogPost[] = [
      {
        title: "First Steps in Kashmir: Valley of Dreams",
        slug: "first-steps-kashmir-valley-dreams",
        excerpt: "Stepping off the bus in Srinagar felt like entering another world. The crisp mountain air, the gentle lapping of Dal Lake, and the warm welcome from Ghulam sahib at the houseboat marked the beginning of an unforgettable journey.",
        content: `# First Steps in Kashmir: Valley of Dreams

Stepping off the bus in Srinagar felt like entering another world. The crisp mountain air, the gentle lapping of Dal Lake, and the warm welcome from Ghulam sahib at the houseboat marked the beginning of an unforgettable journey.

## The Arrival

After 15 hours on a cramped bus from Delhi, I wasn't prepared for the ethereal beauty that greeted me in Srinagar. The snow-capped mountains reflected perfectly in Dal Lake, creating a mirror image that seemed almost too perfect to be real.

## Living on Dal Lake

The houseboat experience is quintessentially Kashmiri. Ghulam sahib, my host, had been running his family's houseboat business for three generations. Every morning, he would serve kehwa (traditional Kashmiri tea) on the deck while we watched the sun paint the mountains in shades of gold and pink.

## Discovering Local Life

The floating markets were a revelation. Vendors would row their shikaras (traditional boats) from houseboat to houseboat, selling everything from fresh vegetables to beautiful handicrafts. The sight of these boats laden with colorful produce, gliding silently across the lake, was like stepping into a living painting.

## Challenges and Rewards

Kashmir isn't just beautiful - it's complex. The political situation means tourism has suffered, but this also means you experience a more authentic Kashmir. The warmth of the people, their resilience, and their pride in their homeland is genuinely moving.

## Budget Breakdown

- Houseboat accommodation: ₹800/night
- Meals: ₹300/day  
- Local transport (shikara): ₹200/day
- Miscellaneous: ₹100/day
- **Total: ₹1,400/day** (well within the ₹500 budget when staying longer)

Kashmir has set the bar incredibly high for the rest of this journey. If this is how India begins, I can't wait to see what comes next.`,
        featuredImage: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "adventure",
        tags: ["Kashmir", "Dal Lake", "Houseboat", "Adventure", "Budget Travel"],
        readingTime: 6,
        isFeatured: true,
        publishedAt: new Date("2025-08-03"),
      },
      {
        title: "Himachal's Hidden Villages: Time Stands Still",
        slug: "himachal-hidden-villages-time-stands-still",
        excerpt: "In the remote villages of Tirthan Valley, I discovered what India was like before modernization rushed in. Living with the Sharma family taught me about community, simplicity, and the forgotten art of slow living.",
        content: `# Himachal's Hidden Villages: Time Stands Still

In the remote villages of Tirthan Valley, I discovered what India was like before modernization rushed in. Living with the Sharma family taught me about community, simplicity, and the forgotten art of slow living.

## The Journey to Tirthan Valley

Getting to Tirthan Valley requires determination. After a 12-hour bus ride from Srinagar to Aut, followed by a hair-raising jeep ride up mountain roads, I finally reached Gushaini village. The last hour of the journey, there was no cell phone coverage - just mountains, forests, and the sound of the Tirthan River.

## The Sharma Family Homestay

Mrs. Sharma greeted me at the door of their traditional Himachali house with a smile and a cup of chai. Their home, built with local wood and stone, has been in the family for four generations. The walls are thick, the ceilings are low, and every room has a view of either the river or the mountains.

## Daily Life in the Village

I woke each morning to the sound of temple bells and the Sharma family's buffalo being milked. Breakfast was fresh bread made in their tandoor, homemade butter, and honey from their own beehives. The rhythm of life here is dictated by sunrise and sunset, not clocks.

## Learning Traditional Ways

Mr. Sharma taught me to fish in the Tirthan River using traditional methods. We would walk to different pools, and he would explain how the fish behave in different seasons. His knowledge, passed down from his father and grandfather, felt more valuable than any guidebook.

## The Power of Community

In the evening, neighbors would gather in the Sharma's courtyard. Without television or internet, conversation was the entertainment. Stories were shared, problems were discussed collectively, and decisions were made by consensus. This is how communities used to function everywhere.

## Why This Matters

In our rush toward modernization, we've lost something precious. These villages represent a way of life that prioritizes relationships over possessions, sustainability over growth, and contentment over ambition.

## Budget Reality Check

- Homestay: ₹300/night (including all meals)
- Local transport: ₹50/day
- Activities: ₹100/day
- **Total: ₹450/day**

This experience cost less than a night in a Delhi hotel, yet gave me insights worth a lifetime.`,
        featuredImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "culture",
        tags: ["Himachal Pradesh", "Village Life", "Homestay", "Culture", "Traditional Living"],
        readingTime: 8,
        isFeatured: true,
        publishedAt: new Date("2025-08-18"),
      },
      {
        title: "Delhi Streets: A Culinary Adventure",
        slug: "delhi-streets-culinary-adventure",
        excerpt: "From the legendary paranthas of Parathe Wali Gali to the hidden gems in Nizamuddin, Delhi's street food scene is a journey through history, culture, and incredible flavors that tell the story of India.",
        content: `# Delhi Streets: A Culinary Adventure

From the legendary paranthas of Parathe Wali Gali to the hidden gems in Nizamuddin, Delhi's street food scene is a journey through history, culture, and incredible flavors that tell the story of India.

## The Great Parantha Adventure

Parathe Wali Gali in Old Delhi is a narrow lane that has been serving paranthas for over 150 years. Each shop specializes in different fillings - potato, cauliflower, radish, and even exotic ones like rabri and dry fruits. Watching the halwais (sweet makers) roll and cook these massive, buttery flatbreads on ancient griddles is mesmerizing.

## Street Food Philosophy

Delhi street food isn't just about filling your stomach - it's about community. Every stall becomes a temporary gathering place where rickshaw drivers, office workers, and students share the same table and the same enthusiasm for good food.

## The Nizamuddin Discovery

While exploring the Nizamuddin area, I stumbled upon a 70-year-old man selling the most incredible seekh kebabs from a tiny cart. His secret? A marinade recipe passed down for four generations and cooking them over charcoal made from mango wood.

## The Economics of Street Food

What amazes me is how these vendors can serve a full meal for ₹50-100. Their overhead is minimal, ingredients are sourced directly from wholesalers, and the turnover is rapid. This is efficiency that business schools should study.

## Food Safety Reality

Yes, street food can be risky, but I've learned to read the signs:
- Choose stalls with high turnover
- Eat food that's cooked fresh in front of you
- Trust your instincts about cleanliness
- Start with smaller portions to build tolerance

## Cultural Exchange Through Food

Food is the universal language. Even when I couldn't speak Hindi well, sharing a meal with strangers led to invitations to homes, recommendations for hidden gems, and friendships that continue today.

## Daily Food Budget

Eating exclusively street food in Delhi:
- Breakfast: ₹30-50
- Lunch: ₹60-100
- Dinner: ₹80-150
- Chai/snacks: ₹30-50
- **Total: ₹200-350/day**

This leaves plenty of room in the ₹500 daily budget for other expenses while eating like a king.

## The Bigger Picture

Delhi's street food scene represents India's diversity. North Indian, South Indian, Tibetan, Mughlai - all coexist and influence each other. It's a living example of how cultures blend and create something new while preserving their essence.`,
        featuredImage: "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "food",
        tags: ["Delhi", "Street Food", "Culture", "Budget Eating", "Food Adventure"],
        readingTime: 5,
        isFeatured: true,
        publishedAt: new Date("2025-09-02"),
      },
    ];

    // Create blog posts and store their IDs for connecting to destinations
    const createdBlogPosts: string[] = [];
    blogPostsData.forEach(post => {
      const blogPost: BlogPost = {
        ...post,
        id: randomUUID(),
        tags: post.tags ?? [],
        isFeatured: post.isFeatured ?? false,
        isVisible: true,
        instagramPostUrl: null,
        twitterPostUrl: null,
        facebookPostUrl: null,
        youtubeVideoUrl: null,
        socialMediaHashtags: [],
        publishedAt: post.publishedAt ?? new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.blogPosts.set(blogPost.id, blogPost);
      createdBlogPosts.push(blogPost.id);
    });

    // Update destinations with blog post connections
    const destinationList = Array.from(this.destinations.values());
    destinationList.forEach((destination) => {
      if (destination.slug === 'srinagar-kashmir' && createdBlogPosts[0]) {
        destination.relatedBlogPosts = [createdBlogPosts[0]]; // Kashmir blog post
      } else if (destination.slug === 'jaipur-rajasthan' && createdBlogPosts.length > 5) {
        destination.relatedBlogPosts = [createdBlogPosts[5]]; // Pink City post
      }
    });

    // Initialize gallery collections
    const galleryCollectionsData: InsertGalleryCollection[] = [
      {
        title: "Kashmir Valley Adventures",
        description: "From the serene houseboats of Dal Lake to the challenging treks in Pahalgam, this collection captures the ethereal beauty and spiritual tranquility of Kashmir.",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        location: "Kashmir, India",
      },
      {
        title: "Rajasthan Desert Life",
        description: "The raw beauty of Thar Desert, camel safaris, nomadic communities, and the incredible resilience of life in one of India's most challenging landscapes.",
        coverImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        location: "Rajasthan, India",
      },
      {
        title: "Cultural Celebrations",
        description: "Festivals, ceremonies, traditional crafts, and the incredible diversity of Indian cultural expressions from different regions and communities.",
        coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        location: "Various Locations",
      },
      {
        title: "Southern Serenity",
        description: "The lush landscapes of Kerala, ancient temples of Tamil Nadu, royal heritage of Karnataka, and the journey's culmination at India's southern tip.",
        coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        location: "South India",
      },
    ];

    galleryCollectionsData.forEach(collection => {
      const galleryCollection: GalleryCollection = {
        ...collection,
        id: randomUUID(),
        location: collection.location ?? null,
        mediaCount: Math.floor(Math.random() * 20) + 10, // Random between 10-30
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.galleryCollections.set(galleryCollection.id, galleryCollection);
      
      // Initialize some sample media for each collection
      const mediaItems: GalleryMedia[] = [];
      for (let i = 0; i < galleryCollection.mediaCount; i++) {
        mediaItems.push({
          id: randomUUID(),
          collectionId: galleryCollection.id,
          type: i % 5 === 0 ? 'video' : 'photo',
          url: `https://images.unsplash.com/photo-${1500000000000 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800`,
          caption: `Beautiful moment captured during the journey - Image ${i + 1}`,
          sortOrder: i,
          createdAt: new Date(),
        });
      }
      this.galleryMedia.set(galleryCollection.id, mediaItems);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog Posts
  async getBlogPosts(category?: string): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values());
    if (category && category !== 'all') {
      return posts.filter(post => post.category === category);
    }
    return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      tags: insertPost.tags || [],
      isVisible: insertPost.isVisible ?? true,
      instagramPostUrl: null,
      twitterPostUrl: null,
      facebookPostUrl: null,
      youtubeVideoUrl: null,
      socialMediaHashtags: [],
      publishedAt: insertPost.publishedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;

    const updated: BlogPost = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isFeatured)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 3);
  }

  // Destinations
  async getDestinations(category?: string, region?: string): Promise<Destination[]> {
    let destinations = Array.from(this.destinations.values());
    
    if (category && category !== 'All Categories') {
      destinations = destinations.filter(dest => dest.category === category);
    }
    
    if (region && region !== 'All Regions') {
      destinations = destinations.filter(dest => dest.region === region);
    }
    
    return destinations.sort((a, b) => b.rating - a.rating);
  }

  async getDestination(slug: string): Promise<Destination | undefined> {
    return Array.from(this.destinations.values()).find(dest => dest.slug === slug);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const destination: Destination = {
      ...insertDestination,
      id,
      highlights: insertDestination.highlights || [],
      activities: insertDestination.activities || [],
      rating: insertDestination.rating || 30,
      isFeatured: insertDestination.isFeatured ?? false,
      isVisible: true,
      isCurrentLocation: insertDestination.isCurrentLocation ?? false,
      instagramPostUrl: null,
      twitterPostUrl: null,
      facebookPostUrl: null,
      youtubeVideoUrl: null,
      socialMediaHashtags: [],
      relatedBlogPosts: insertDestination.relatedBlogPosts || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.destinations.set(id, destination);
    return destination;
  }

  async updateDestination(id: string, updates: Partial<InsertDestination>): Promise<Destination | undefined> {
    const existing = this.destinations.get(id);
    if (!existing) return undefined;

    const updated: Destination = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.destinations.set(id, updated);
    return updated;
  }

  async deleteDestination(id: string): Promise<boolean> {
    return this.destinations.delete(id);
  }

  async getCurrentLocation(): Promise<Destination | undefined> {
    return Array.from(this.destinations.values()).find(dest => dest.isCurrentLocation);
  }

  // Gallery
  async getGalleryCollections(): Promise<GalleryCollectionWithMedia[]> {
    const collections = Array.from(this.galleryCollections.values());
    return collections.map(collection => ({
      ...collection,
      media: this.galleryMedia.get(collection.id) || [],
    })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getGalleryCollection(id: string): Promise<GalleryCollectionWithMedia | undefined> {
    const collection = this.galleryCollections.get(id);
    if (!collection) return undefined;

    return {
      ...collection,
      media: this.galleryMedia.get(id) || [],
    };
  }

  async createGalleryCollection(insertCollection: InsertGalleryCollection): Promise<GalleryCollection> {
    const id = randomUUID();
    const collection: GalleryCollection = {
      ...insertCollection,
      id,
      mediaCount: 0,
      location: insertCollection.location || null,
      youtubeUrl: insertCollection.youtubeUrl || null,
      isVisible: insertCollection.isVisible ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.galleryCollections.set(id, collection);
    this.galleryMedia.set(id, []);
    return collection;
  }

  async updateGalleryCollection(id: string, updates: Partial<InsertGalleryCollection>): Promise<GalleryCollection | undefined> {
    const collection = this.galleryCollections.get(id);
    if (!collection) return undefined;

    const updatedCollection: GalleryCollection = {
      ...collection,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };
    
    this.galleryCollections.set(id, updatedCollection);
    return updatedCollection;
  }

  async addMediaToCollection(collectionId: string, insertMedia: InsertGalleryMedia): Promise<GalleryMedia> {
    const collection = this.galleryCollections.get(collectionId);
    if (!collection) throw new Error('Collection not found');

    const id = randomUUID();
    const media: GalleryMedia = {
      ...insertMedia,
      id,
      title: insertMedia.title || null,
      caption: insertMedia.caption || null,
      thumbnailUrl: insertMedia.thumbnailUrl || null,
      embedCode: insertMedia.embedCode || null,
      linkUrl: insertMedia.linkUrl || null,
      sortOrder: insertMedia.sortOrder || 0,
      createdAt: new Date(),
    };

    const existingMedia = this.galleryMedia.get(collectionId) || [];
    existingMedia.push(media);
    this.galleryMedia.set(collectionId, existingMedia);

    // Update collection media count
    collection.mediaCount = existingMedia.length;
    collection.updatedAt = new Date();
    this.galleryCollections.set(collectionId, collection);

    return media;
  }

  async deleteGalleryCollection(id: string): Promise<boolean> {
    const deleted = this.galleryCollections.delete(id);
    if (deleted) {
      this.galleryMedia.delete(id);
    }
    return deleted;
  }

  // Newsletter
  async subscribeNewsletter(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = randomUUID();
    const subscriber: NewsletterSubscriber = {
      ...insertSubscriber,
      id,
      isActive: true,
      subscribedAt: new Date(),
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values())
      .filter(sub => sub.isActive)
      .sort((a, b) => b.subscribedAt.getTime() - a.subscribedAt.getTime());
  }

  // Contact
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const message = this.contactMessages.get(id);
    if (!message) return false;

    message.isRead = true;
    this.contactMessages.set(id, message);
    return true;
  }

  // Journey Tracking
  async getJourneyTracking(): Promise<JourneyTracking | undefined> {
    return this.journeyTracking;
  }

  async updateJourneyTracking(insertTracking: InsertJourneyTracking): Promise<JourneyTracking> {
    const id = this.journeyTracking?.id || randomUUID();
    this.journeyTracking = {
      ...insertTracking,
      id,
      journeyProgress: insertTracking.journeyProgress || 0,
      daysTraveled: insertTracking.daysTraveled || 0,
      statesCovered: insertTracking.statesCovered || 0,
      distanceCovered: insertTracking.distanceCovered || 0,
      instagramStoryUrl: insertTracking.instagramStoryUrl || null,
      instagramReelUrl: insertTracking.instagramReelUrl || null,
      twitterUpdateUrl: insertTracking.twitterUpdateUrl || null,
      youtubeShortUrl: insertTracking.youtubeShortUrl || null,
      lastUpdated: new Date(),
    };
    return this.journeyTracking;
  }

  // Travel Pins
  async getTravelPins(): Promise<TravelPin[]> {
    return Array.from(this.travelPins.values())
      .filter(pin => pin.isVisible)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTravelPin(id: string): Promise<TravelPin | undefined> {
    return this.travelPins.get(id);
  }

  async createTravelPin(insertPin: InsertTravelPin): Promise<TravelPin> {
    const id = randomUUID();
    const pin: TravelPin = {
      ...insertPin,
      id,
      images: insertPin.images || [],
      tags: insertPin.tags || null,
      isVisible: insertPin.isVisible ?? true,
      instagramPostUrl: null,
      twitterPostUrl: null,
      facebookPostUrl: null,
      youtubeVideoUrl: null,
      socialMediaHashtags: [],
      notes: insertPin.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.travelPins.set(id, pin);
    return pin;
  }

  async updateTravelPin(id: string, updates: Partial<InsertTravelPin>): Promise<TravelPin | undefined> {
    const pin = this.travelPins.get(id);
    if (!pin) return undefined;

    const updatedPin: TravelPin = {
      ...pin,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };
    
    this.travelPins.set(id, updatedPin);
    return updatedPin;
  }

  async deleteTravelPin(id: string): Promise<boolean> {
    return this.travelPins.delete(id);
  }
}

export const storage = new MemStorage();
