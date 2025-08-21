import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Route, Coins, ChevronDown, Mail, BookOpen, Images, Navigation, Star, Camera, Expand } from "lucide-react";
import InteractiveMap from "@/components/journey/interactive-map";
import BlogCard from "@/components/blog/blog-card";
import NewsletterForm from "@/components/newsletter/newsletter-form";
import { useJourney } from "@/hooks/use-journey";
import { useHomeContent } from "@/hooks/use-home-content";
// Note: Inline editing removed - all editing is now done through admin panel
import type { BlogPost, Destination, GalleryCollection } from "@shared/schema";

export default function Home() {
  
  const { data: journey } = useJourney();
  const { data: homeContent } = useHomeContent();
  const { data: featuredPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/featured"],
  });
  
  // Custom selected destinations for guides section
  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });
  
  // Custom selected gallery collections
  const { data: galleryCollections = [] } = useQuery<GalleryCollection[]>({
    queryKey: ["/api/gallery"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenFullMap = () => {
    window.open('https://www.google.com/maps/search/india+travel+journey', '_blank');
  };

  const handleViewAllGalleries = () => {
    window.open('/gallery', '_blank');
  };

  // Custom selected travel stories (best 3)
  const customFeaturedStories = [
    featuredPosts.find(post => post.slug === 'delhi-streets-culinary-adventure') || featuredPosts[0],
    featuredPosts[1],
    featuredPosts[2]
  ].filter(Boolean);

  // Custom selected guides (best 2)
  const customSelectedGuides = [
    destinations.find(dest => dest.slug === 'srinagar-kashmir') || destinations[0],
    destinations.find(dest => dest.slug === 'kanyakumari-tamil-nadu') || destinations[1]
  ].filter(Boolean);

  // Note: Content editing is now only available in the admin panel

  // Custom selected gallery collections (best ones)
  const customSelectedGallery = [
    galleryCollections[0],
    galleryCollections[1]
  ].filter(Boolean);

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center" data-testid="hero-section">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('${homeContent?.heroBackgroundImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'}')` }}
        >
          <div className="hero-gradient absolute inset-0"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6" data-testid="hero-title">
            {homeContent?.heroTitle?.split('\n').map((line, index) => (
              <span key={index}>
                {index === 1 ? (
                  <span className="text-brand-orange">{line}</span>
                ) : (
                  line
                )}
                {index < (homeContent?.heroTitle?.split('\n').length || 1) - 1 && <br />}
              </span>
            )) || (
              <>
                Raw Roads,<br />
                <span className="text-brand-orange">Real Discovery</span>
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto" data-testid="hero-subtitle">
            {homeContent?.heroSubtitle || "Join Shashank's authentic 4-month journey across India, from Kashmir's valleys to Kanyakumari's shores, on just ₹500 per day"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/journey">
              <Button 
                size="lg"
                className="bg-brand-orange text-white hover:bg-brand-orange/90 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
                data-testid="explore-journey-button"
              >
                <MapPin className="mr-2 h-5 w-5" />
                {homeContent?.exploreButtonText || "Explore Journey"}
              </Button>
            </Link>
            <Link href="/letters">
              <Button 
                variant="outline"
                size="lg"
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-brand-brown px-8 py-4 text-lg font-semibold transition-all duration-300"
                data-testid="read-diaries-button"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                {homeContent?.diariesButtonText || "Read Diaries"}
              </Button>
            </Link>
          </div>
          
          {/* Journey Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto" data-testid="journey-stats">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-orange font-playfair" data-testid="stat-days">
                {journey?.daysTraveled || 78}
              </div>
              <div className="text-sm lg:text-base text-gray-200">Days Journey</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-orange font-playfair" data-testid="stat-states">
                {journey?.statesCovered || 9}+
              </div>
              <div className="text-sm lg:text-base text-gray-200">States Visited</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-orange font-playfair" data-testid="stat-distance">
                {journey?.distanceCovered || 1950}+
              </div>
              <div className="text-sm lg:text-base text-gray-200">Kilometers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-orange font-playfair" data-testid="stat-budget">
                {homeContent?.dailyBudget || "₹500"}
              </div>
              <div className="text-sm lg:text-base text-gray-200">Per Day Budget</div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => scrollToSection('journey-map')}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          data-testid="scroll-indicator"
        >
          <ChevronDown className="h-8 w-8 text-white" />
        </button>
      </section>

      {/* Interactive Journey Map */}
      <section id="journey-map" className="py-16 lg:py-24 bg-white" data-testid="journey-map-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6" data-testid="map-section-title">
              {homeContent?.mapSectionTitle || "Live Journey Tracker"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="map-section-description">
              {homeContent?.mapSectionDescription || "Follow the real-time progress from the serene valleys of Kashmir to the southern tip of Kanyakumari. Each pin tells a story of discovery, challenge, and authentic Indian experiences."}
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-4 h-4 bg-brand-orange rounded-full animate-pulse"></div>
                  <span className="font-semibold text-brand-brown" data-testid="current-location">
                    Currently in: {journey?.currentLocation || "Mysuru, Karnataka"}
                  </span>
                </div>
                <p className="text-gray-600">Exploring the royal heritage and palace architecture</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-orange" data-testid="journey-progress">
                  {journey?.journeyProgress || 65}%
                </div>
                <div className="text-sm text-gray-600">Journey Complete</div>
              </div>
            </div>
            
            <InteractiveMap height="500px" />
            
            {/* Map and Gallery Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleOpenFullMap}
                className="bg-brand-orange text-white hover:bg-brand-orange/90"
                data-testid="home-open-full-map"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Open Full Journey Map
              </Button>
              <Button 
                onClick={handleViewAllGalleries}
                variant="outline"
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                data-testid="home-view-all-galleries"
              >
                <Images className="w-4 h-4 mr-2" />
                View Photo Galleries
              </Button>
            </div>
          </div>
          
          {/* Journey Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="journey-progress-cards">
            <Card className="bg-brand-cream text-center p-6">
              <CardContent className="p-0">
                <Calendar className="mx-auto text-brand-green text-3xl mb-4" />
                <h3 className="font-playfair text-xl font-bold text-brand-brown mb-2">Journey Started</h3>
                <p className="text-gray-600">{homeContent?.journeyStartDate || "August 1, 2025"} - {homeContent?.journeyStartLocation || "Srinagar, Kashmir"}</p>
                <p className="text-sm text-gray-500 mt-2">{homeContent?.journeyStartDescription || "Dal Lake houseboats and mountain serenity"}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-brand-orange bg-opacity-10 border-2 border-brand-orange text-center p-6">
              <CardContent className="p-0">
                <MapPin className="mx-auto text-brand-orange text-3xl mb-4" />
                <h3 className="font-playfair text-xl font-bold text-brand-brown mb-2">Current Location</h3>
                <p className="text-gray-600">{journey?.currentLocation || "Mysuru, Karnataka"}</p>
                <p className="text-sm text-gray-500 mt-2">Palace architecture and royal heritage</p>
              </CardContent>
            </Card>
            
            <Card className="bg-brand-cream text-center p-6">
              <CardContent className="p-0">
                <Route className="mx-auto text-brand-brown text-3xl mb-4" />
                <h3 className="font-playfair text-xl font-bold text-brand-brown mb-2">Final Destination</h3>
                <p className="text-gray-600">{homeContent?.finalDestination || "Kanyakumari, Tamil Nadu"}</p>
                <p className="text-sm text-gray-500 mt-2">{homeContent?.finalDestinationDescription || "Land's end where three seas meet"}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Travel Stories */}
      <section className="py-16 lg:py-24 bg-brand-cream" data-testid="featured-posts-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6" data-testid="featured-posts-title">
              {homeContent?.storiesSectionTitle || "Latest Travel Stories"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="featured-posts-description">
              {homeContent?.storiesSectionDescription || "Authentic stories from the road - the struggles, discoveries, and unexpected connections that make solo travel transformative."}
            </p>
          </div>

          {customFeaturedStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" data-testid="featured-posts-grid">
              {customFeaturedStories.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="no-featured-posts">
              <p className="text-gray-500">No featured stories available yet.</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/letters">
              <Button 
                size="lg"
                className="bg-brand-orange text-white hover:bg-brand-orange/90 px-8 py-4 font-semibold"
                data-testid="view-all-stories-button"
              >
                View All Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Guides Section */}
      <section className="py-16 lg:py-24 bg-white" data-testid="guides-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6" data-testid="guides-title">
              {homeContent?.guidesSectionTitle || "Travel Guides"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="guides-description">
              {homeContent?.guidesSectionDescription || "Comprehensive guides to the most incredible destinations on this journey. From planning to experiencing, get insider tips for authentic travel."}
            </p>
          </div>

          {customSelectedGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" data-testid="guides-grid">
              {customSelectedGuides.map((destination) => (
                <Card key={destination.id} className="overflow-hidden shadow-lg card-hover bg-white" data-testid={`guide-card-${destination.slug}`}>
                  <div className="relative h-64">
                    <img
                      src={destination.featuredImage}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                      data-testid="guide-card-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-playfair text-2xl font-bold mb-1" data-testid="guide-card-title">
                        {destination.name}
                      </h3>
                      <p className="text-sm opacity-90" data-testid="guide-card-location">
                        {destination.state}, {destination.region}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1" data-testid="guide-card-rating">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{(destination.rating / 10).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3" data-testid="guide-card-description">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span data-testid="guide-card-category">{destination.category}</span>
                        <span data-testid="guide-card-difficulty">{destination.difficulty}</span>
                      </div>
                      <Link href={`/journey/${destination.slug}`}>
                        <Button 
                          size="sm"
                          className="bg-brand-orange text-white hover:bg-brand-orange/90"
                          data-testid={`guide-view-button-${destination.slug}`}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          View Guide
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="no-guides">
              <p className="text-gray-500">No travel guides available yet.</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/journey">
              <Button 
                size="lg"
                className="bg-brand-green text-white hover:bg-brand-green/90 px-8 py-4 font-semibold"
                data-testid="view-all-guides-button"
              >
                View All Guides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 lg:py-24 bg-brand-cream" data-testid="gallery-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6" data-testid="gallery-title">
              {homeContent?.gallerySectionTitle || "Visual Journey"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="gallery-description">
              {homeContent?.gallerySectionDescription || "Every photograph tells a story of discovery, challenge, and the incredible diversity of landscapes, cultures, and moments that define authentic India travel."}
            </p>
          </div>

          {customSelectedGallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" data-testid="gallery-grid">
              {customSelectedGallery.map((collection) => (
                <Card 
                  key={collection.id} 
                  className="overflow-hidden shadow-lg card-hover bg-white cursor-pointer gallery-collection-card" 
                  data-testid={`gallery-collection-${collection.id}`}
                  onClick={() => {
                    if (collection.id) {
                      window.location.href = `/gallery/${collection.id}`;
                    }
                  }}
                >
                  <div className="relative h-64">
                    <img
                      src={collection.coverImage}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                      data-testid="collection-cover-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-playfair text-2xl font-bold mb-1" data-testid="collection-title">
                        {collection.title}
                      </h3>
                      <p className="text-sm opacity-90" data-testid="collection-media-count">
                        {collection.mediaCount} photos • {Math.floor(collection.mediaCount / 5)} videos
                      </p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/gallery/${collection.id}`;
                        }}
                        className="bg-white bg-opacity-20 backdrop-blur-sm text-white hover:bg-white hover:bg-opacity-30"
                        data-testid="collection-expand-button"
                      >
                        <Expand className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3" data-testid="collection-description">
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500" data-testid="collection-location">
                        {collection.location}
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/gallery/${collection.id}`;
                        }}
                        className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                        data-testid={`collection-view-button-${collection.id}`}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        View Collection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="no-gallery-collections">
              <p className="text-gray-500">No gallery collections available yet.</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/gallery">
              <Button 
                size="lg"
                className="bg-brand-green text-white hover:bg-brand-green/90 px-8 py-4 font-semibold"
                data-testid="view-all-gallery-button"
              >
                View All Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-brand-green" data-testid="newsletter-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-white mb-6" data-testid="newsletter-title">
            {homeContent?.newsletterTitle || "Join the Journey"}
          </h2>
          <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto" data-testid="newsletter-description">
            {homeContent?.newsletterDescription || "Get weekly updates about new destinations, travel stories, and behind-the-scenes insights from the road. No spam, just authentic travel content."}
          </p>

          <NewsletterForm />

          {/* Social Proof */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-green-100" data-testid="newsletter-stats">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{homeContent?.newsletterSubscribersCount || 342}</div>
              <div className="text-sm">Newsletter Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{homeContent?.weeklyStoriesCount || 24}</div>
              <div className="text-sm">Weekly Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{homeContent?.readRate || 95}%</div>
              <div className="text-sm">Read Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
