import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Calendar, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GalleryGrid from "@/components/gallery/gallery-grid";
import Lightbox from "@/components/gallery/lightbox";
import YouTubePlayer from "@/components/gallery/youtube-player";
import SocialMediaDisplay from "@/components/social-media-display";
import DetailedSocialShare from "@/components/detailed-social-share";
import { useState } from "react";
import type { GalleryCollectionWithMedia } from "@shared/schema";

export default function Gallery() {
  const { id } = useParams<{ id?: string }>();
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: collection, isLoading: collectionLoading, error } = useQuery<GalleryCollectionWithMedia>({
    queryKey: ["/api/gallery", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`/api/gallery/${id}`);
      if (!response.ok) {
        throw new Error('Gallery collection not found');
      }
      return response.json();
    },
    enabled: !!id,
  });

  // If no ID is provided, show all collections
  if (!id) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16" data-testid="gallery-header">
            <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6">
              Visual Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Every photograph tells a story of discovery, challenge, and the incredible diversity of landscapes, cultures, and moments that define authentic India travel. These collections capture the essence of each destination and the emotions of the journey.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search gallery collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  data-testid="gallery-search-input"
                />
              </div>
            </div>
          </div>

          {/* Gallery Collections */}
          <GalleryGrid searchQuery={searchQuery} />
          
          {/* Bottom spacer to prevent navigation overlap */}
          <div className="h-24"></div>
        </div>
      </div>
    );
  }

  // Show individual collection
  if (collectionLoading) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 lg:py-24" data-testid="collection-loading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 lg:py-24 flex items-center justify-center" data-testid="collection-error">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="font-playfair text-2xl font-bold text-brand-brown mb-4">
              Collection Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The gallery collection you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/gallery">
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gallery
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream py-16 lg:py-24" data-testid="collection-page">
      <div className="max-w-6xl mx-auto px-6">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/gallery">
            <Button variant="ghost" className="text-brand-brown hover:bg-brand-brown/10" data-testid="back-to-gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12" data-testid="collection-header">
          <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-4">
            {collection.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {collection.description}
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {collection.location}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(collection.createdAt).toLocaleDateString()}
            </div>
            <Badge variant="secondary">
              {collection.mediaCount} photos
            </Badge>
          </div>
        </div>

        {/* Collection Description */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            {collection.description}
          </p>
        </div>

        {/* Detailed Social Sharing */}
        <div className="mb-12">
          <DetailedSocialShare
            title={collection.title}
            description={collection.description}
            url={window.location.href}
            hashtags={[]}
            type="blog"
            instagramUrl={(collection as any).instagramPostUrl || undefined}
            youtubeUrl={(collection as any).youtubeVideoUrl || collection.youtubeUrl || undefined}
          />
        </div>

        {/* Social Media Sharing */}
        <div className="mb-12">
          <SocialMediaDisplay
            data={{
              instagramPostUrl: (collection as any).instagramPostUrl || undefined,
              twitterPostUrl: (collection as any).twitterPostUrl || undefined,
              facebookPostUrl: (collection as any).facebookPostUrl || undefined,
              youtubeVideoUrl: (collection as any).youtubeVideoUrl || collection.youtubeUrl || undefined,
              socialMediaHashtags: (collection as any).socialMediaHashtags || undefined
            }}
            title="Follow this gallery on social media"
            compact={false}
            showHashtags={true}
          />
        </div>

        {/* YouTube Video Section */}
        {collection.youtubeUrl && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-brand-brown mb-2">
                Watch the Journey
              </h2>
              <p className="text-gray-600">
                Experience this adventure through video storytelling
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <YouTubePlayer 
                url={collection.youtubeUrl}
                title={`${collection.title} - Video Journey`}
                description="Follow along as we explore this incredible destination"
              />
            </div>
          </div>
        )}

        {/* Photo Grid - Simple Layout */}
        <div className="mb-8">
          <h2 className="font-playfair text-2xl font-bold text-brand-brown text-center mb-8">
            Photo Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16" data-testid="photo-grid">
            {collection.media.map((media, index) => (
              <div
                key={media.id}
                className="aspect-square cursor-pointer overflow-hidden rounded-lg card-hover"
                onClick={() => openLightbox(index)}
                data-testid={`photo-${index}`}
              >
                <img
                  src={media.url}
                  alt={media.caption || `Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {showLightbox && (
          <Lightbox
            collection={collection}
            initialIndex={lightboxIndex}
            onClose={closeLightbox}
            onIndexChange={setLightboxIndex}
          />
        )}
        
        {/* Bottom spacer */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
