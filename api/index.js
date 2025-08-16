// Vercel serverless function handler for the travel blog API
// Updated to use in-memory storage instead of PostgreSQL to fix authentication errors

import express from 'express';
import session from 'express-session';

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

// In-memory storage data - same as local development
const storage = {
  // Sample blog posts data
  blogPosts: [
    {
      id: "1",
      title: "Delhi Streets: A Culinary Adventure",
      slug: "delhi-streets-culinary-adventure",
      excerpt: "Exploring the vibrant street food scene of Old Delhi, where every corner tells a story through spices, sizzles, and smiles.",
      content: "Delhi's street food scene is a symphony of flavors...",
      featuredImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      category: "food",
      tags: ["Delhi", "Street Food", "Culture", "Budget Eating", "Food Adventure"],
      readingTime: 5,
      isFeatured: true,
      isVisible: true,
      publishedAt: new Date("2025-09-02"),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2", 
      title: "Kashmir's Floating Gardens: Dal Lake Magic",
      slug: "kashmir-floating-gardens-dal-lake",
      excerpt: "Discover the unique agricultural heritage of Kashmir's Dal Lake, where vegetables grow on water and tradition floats with time.",
      content: "The floating gardens of Dal Lake are a marvel...",
      featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      category: "culture",
      tags: ["Kashmir", "Agriculture", "Dal Lake", "Tradition", "Nature"],
      readingTime: 7,
      isFeatured: true,
      isVisible: true,
      publishedAt: new Date("2025-08-15"),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Sample destinations data
  destinations: [
    {
      id: "1",
      name: "Srinagar, Kashmir",
      slug: "srinagar-kashmir",
      description: "The Venice of the East with its famous Dal Lake, floating gardens, and houseboat experiences.",
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
      isFeatured: true,
      isCurrentLocation: false
    },
    {
      id: "2",
      name: "Mysuru, Karnataka", 
      slug: "mysuru-karnataka",
      description: "The cultural capital of Karnataka, known for its magnificent palace, yoga heritage, and silk production.",
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
      isFeatured: true,
      isCurrentLocation: true
    }
  ],

  // Sample travel pins data
  travelPins: [
    {
      id: "1",
      name: "Kashmir Valley",
      description: "Beautiful valley surrounded by mountains",
      country: "India",
      city: "Srinagar",
      coordinates: { lat: 34.0837, lng: 74.7973 },
      pinType: "visited",
      pinColor: "#E07A3E",
      visitedDate: new Date("2024-01-15"),
      rating: 5,
      notes: "Absolutely stunning place with amazing houseboats"
    },
    {
      id: "2",
      name: "Mysuru Palace",
      description: "Current location - magnificent royal palace",
      country: "India",
      city: "Mysuru",
      coordinates: { lat: 12.2958, lng: 76.6394 },
      pinType: "current",
      pinColor: "#FF6B6B",
      visitedDate: new Date("2024-03-20"),
      rating: 5,
      notes: "Currently exploring this cultural capital"
    }
  ],

  // Sample gallery collections
  galleryCollections: [
    {
      id: "1",
      title: "Kashmir Valley Adventures",
      description: "A visual journey through Dal Lake's famous floating gardens and traditional houseboats",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      mediaCount: 15,
      location: "Srinagar, Kashmir",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      createdAt: new Date(),
      updatedAt: new Date(),
      media: [
        {
          id: "1",
          type: "photo",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
          caption: "Floating gardens on Dal Lake in early morning mist"
        },
        {
          id: "2",
          type: "photo", 
          url: "https://images.unsplash.com/photo-1571018621578-de0c7d7c60ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
          caption: "Traditional houseboats with mountain backdrop"
        }
      ]
    },
    {
      id: "2",
      title: "Rajasthan Desert Life",
      description: "The raw beauty of Thar Desert, camel safaris, nomadic communities, and the incredible resilience of life in one of India's most challenging landscapes",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      mediaCount: 18,
      location: "Rajasthan, India",
      youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      createdAt: new Date(),
      updatedAt: new Date(),
      media: [
        {
          id: "3",
          type: "photo",
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
          caption: "Desert dunes stretching into the horizon"
        }
      ]
    }
  ],

  // Journey tracking
  journey: {
    id: "1",
    currentLocation: "Mysuru, Karnataka", 
    currentCoordinates: { lat: 12.2958, lng: 76.6394 },
    journeyProgress: 65,
    daysTraveled: 78,
    statesCovered: 9,
    distanceCovered: 1950,
    lastUpdated: new Date()
  }
};

// Blog posts API
app.get('/api/blog-posts', (req, res) => {
  try {
    const { category } = req.query;
    let posts = storage.blogPosts;
    
    if (category && category !== 'all') {
      posts = posts.filter(post => post.category === category);
    }
    
    res.json(posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)));
  } catch (error) {
    console.error('Blog posts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Featured blog posts
app.get('/api/blog-posts/featured', (req, res) => {
  try {
    const featuredPosts = storage.blogPosts
      .filter(post => post.isFeatured)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 3);
    
    res.json(featuredPosts);
  } catch (error) {
    console.error('Featured blog posts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get blog post by slug
app.get('/api/blog-posts/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const post = storage.blogPosts.find(p => p.slug === slug);
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Blog post by slug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Destinations API
app.get('/api/destinations', (req, res) => {
  try {
    const { category, region } = req.query;
    let destinations = storage.destinations;
    
    if (category && category !== 'all') {
      destinations = destinations.filter(dest => dest.category === category);
    }
    
    if (region && region !== 'all') {
      destinations = destinations.filter(dest => dest.region === region);
    }
    
    res.json(destinations.sort((a, b) => b.rating - a.rating));
  } catch (error) {
    console.error('Destinations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get destination by slug
app.get('/api/destinations/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const destination = storage.destinations.find(d => d.slug === slug);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    console.error('Destination by slug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Travel pins API
app.get('/api/travel-pins', (req, res) => {
  try {
    res.json(storage.travelPins);
  } catch (error) {
    console.error('Travel pins error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Gallery API
app.get('/api/gallery', (req, res) => {
  try {
    const collections = storage.galleryCollections.map(collection => ({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      coverImage: collection.coverImage,
      mediaCount: collection.mediaCount,
      location: collection.location,
      youtubeUrl: collection.youtubeUrl,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      media: collection.media || []
    }));
    
    res.json(collections.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific gallery collection
app.get('/api/gallery/:id', (req, res) => {
  try {
    const { id } = req.params;
    const collection = storage.galleryCollections.find(c => c.id === id);
    
    if (!collection) {
      return res.status(404).json({ error: 'Gallery collection not found' });
    }
    
    res.json({
      ...collection,
      media: collection.media || []
    });
  } catch (error) {
    console.error('Gallery detail error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Journey API
app.get('/api/journey', (req, res) => {
  try {
    res.json(storage.journey);
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

// CREATE operations for admin panel

// Create blog post
app.post('/api/blog-posts', (req, res) => {
  try {
    const { title, slug, excerpt, content, featuredImage, category, tags, readingTime, isFeatured, isVisible } = req.body;
    
    const newPost = {
      id: Date.now().toString(),
      title: title || '',
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: excerpt || '',
      content: content || '',
      featuredImage: featuredImage || '',
      category: category || 'adventure',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []),
      readingTime: readingTime || 5,
      isFeatured: !!isFeatured,
      isVisible: isVisible !== false,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.blogPosts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update blog post
app.put('/api/blog-posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const postIndex = storage.blogPosts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Process tags if they're a string
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }
    
    storage.blogPosts[postIndex] = {
      ...storage.blogPosts[postIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date()
    };
    
    res.json(storage.blogPosts[postIndex]);
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete blog post
app.delete('/api/blog-posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = storage.blogPosts.length;
    storage.blogPosts = storage.blogPosts.filter(p => p.id !== id);
    
    if (storage.blogPosts.length === initialLength) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create gallery collection
app.post('/api/gallery', (req, res) => {
  try {
    const { title, description, coverImage, location, youtubeUrl } = req.body;
    
    const newCollection = {
      id: Date.now().toString(),
      title: title || '',
      description: description || '',
      coverImage: coverImage || '',
      mediaCount: 0,
      location: location || null,
      youtubeUrl: youtubeUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      media: []
    };
    
    storage.galleryCollections.push(newCollection);
    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin stats API
app.get('/api/admin/stats', (req, res) => {
  try {
    res.json({
      totalPosts: storage.blogPosts.length,
      totalDestinations: storage.destinations.length,
      totalPins: storage.travelPins.length,
      totalGalleries: storage.galleryCollections.length
    });
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