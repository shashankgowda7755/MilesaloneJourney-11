# Travel Blog Application

## Overview

This is a production-ready travel blog application built for documenting authentic India travel experiences. The application features a secure admin panel, blog management system, photo galleries, interactive journey mapping, and comprehensive content management. All inline editing has been removed from public pages - only authenticated admin users can modify content through the protected admin panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## Production Status

✅ **PRODUCTION READY** - All security implemented, dummy data removed, deployment guides created
- Authentication system protecting all content modifications
- No public inline editing capabilities
- External database support (Neon/Supabase) 
- Vercel deployment ready
- Comprehensive documentation provided

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Design System**: Custom brand colors and typography using Playfair Display and Inter fonts
- **Mobile-First**: Responsive design with dedicated mobile navigation and optimized layouts

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints organized by feature (blog posts, destinations, gallery, etc.)
- **Development**: Custom Vite integration for development with HMR support
- **File Structure**: Monorepo structure with shared types and schemas between client and server

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared directory with automatic migrations
- **Connection**: Connection pooling using Neon's serverless driver with WebSocket support

### Core Data Models
- **Blog Posts**: Title, content, categories (adventure, culture, food, people, places), featured images, tags, and reading time
- **Destinations**: Detailed location information with coordinates, categories, regions, difficulty ratings, and travel recommendations
- **Gallery Collections**: Photo/video collections with metadata and media management
- **Journey Tracking**: Real-time location updates and journey progress tracking
- **User Management**: Admin authentication and content management
- **Newsletter**: Subscriber management and contact form handling

### Authentication and Authorization
- **Admin Access**: Secure authentication system with session-based auth (username: "admins", password: "Travel@2025" or ADMIN_PASSWORD env var)
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Public Content**: No authentication required for viewing content (GET routes open)
- **Protected Routes**: All create, update, and delete operations require admin login
- **Security**: Authentication middleware protects all POST, PUT, DELETE endpoints

### External Dependencies
- **Database Hosting**: Neon PostgreSQL serverless database
- **Maps Integration**: Leaflet for interactive journey mapping with OpenStreetMap tiles
- **Image Hosting**: External image URLs (likely CDN or cloud storage integration)
- **Email Services**: Prepared for newsletter and contact form email integration
- **Development Tools**: Replit-specific development enhancements and error handling

### Key Features
- **Interactive Journey Map**: Real-time location tracking with journey waypoints and route visualization
- **Content Management**: Admin dashboard for managing blog posts, destinations, and gallery content
- **Gallery System with YouTube Integration**: Photo collections with embedded YouTube video players featuring autoplay, thumbnails, and responsive design
- **Search and Filtering**: Advanced filtering for blog posts, destinations, and gallery collections with real-time search
- **Newsletter Integration**: Email subscription system for journey updates
- **Mobile Optimization**: Bottom navigation and mobile-first responsive design with touch-friendly interfaces
- **Performance**: Image optimization, query caching, and efficient state management with lazy loading
- **Social Media Integration**: Comprehensive social media sharing and content linking across all travel content including blog posts, destinations, travel pins, and journey updates with support for Instagram, Twitter, Facebook, YouTube, and custom hashtag management
- **Travel Pins Management**: Admin interface for creating and managing travel pins with coordinates, ratings, notes, and social media integration

### Development and Deployment
- **Build Process**: Vite for frontend bundling, esbuild for server bundling
- **Environment**: Configured for both development and production with environment-specific optimizations
- **Code Quality**: TypeScript strict mode, path aliases for clean imports
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Vercel Deployment**: Self-contained serverless API in api/index.js with complete authentication
- **Database Integration**: PostgreSQL with proper environment variable management and connection pooling
- **Security**: All admin functions protected with authentication middleware for secure content management
- **CRUD Operations**: Full create, read, update, delete functionality for all content types (protected)
- **Session Security**: Secure session management with environment-specific cookie settings