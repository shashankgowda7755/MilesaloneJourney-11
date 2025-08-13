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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every photograph tells a story of discovery, challenge, and the incredible diversity of landscapes, cultures, and moments that define authentic India travel. These collections capture the essence of each destination and the emotions of the journey.
            </p>
          </div>

          {/* Gallery Collections */}
          <GalleryGrid />
          
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

        {/* Photo Grid */}
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
