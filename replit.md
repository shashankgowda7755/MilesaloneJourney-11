# Travel Blog Application

## Overview

This is a full-stack travel blog application built for documenting authentic India travel experiences. The application features a travel journey from Kashmir to Kanyakumari, showcasing destinations, travel stories, photo galleries, and real-time journey tracking. It's designed as a modern, responsive web application with both public-facing content and admin management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **Admin Access**: Simple authentication system for content management
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Public Content**: No authentication required for viewing content
- **Protected Routes**: Admin-only routes for content creation and management

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

### Development and Deployment
- **Build Process**: Vite for frontend bundling, esbuild for server bundling
- **Environment**: Configured for both development and production with environment-specific optimizations
- **Code Quality**: TypeScript strict mode, path aliases for clean imports
- **Error Handling**: Comprehensive error boundaries and API error handling