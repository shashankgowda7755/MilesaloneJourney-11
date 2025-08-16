import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Image, Camera, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { GalleryCollectionWithMedia } from "@shared/schema";

interface GalleryGridProps {
  searchQuery?: string;
}

export default function GalleryGrid({ searchQuery = "" }: GalleryGridProps) {
  const { data: allCollections = [], isLoading, error } = useQuery<GalleryCollectionWithMedia[]>({
    queryKey: ["/api/gallery"],
  });

  console.log('GalleryGrid - isLoading:', isLoading, 'data:', allCollections, 'error:', error);

  // Filter collections based on search query
  const collections = allCollections.filter(collection => 
    collection.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (collection.location && collection.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (error) {
    console.error('Gallery loading error:', error);
    return (
      <div className="text-center py-16" data-testid="gallery-error">
        <p className="text-red-500 text-lg">Error loading gallery collections</p>
        <p className="text-gray-400 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 gallery-grid" data-testid="gallery-grid">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-16" data-testid="no-collections-message">
          <p className="text-gray-500 text-lg">No gallery collections found.</p>
          <p className="text-gray-400 mt-2">Check back later for new photo collections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="gallery-collections-grid">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/gallery/${collection.id}`}>
              <Card className="overflow-hidden shadow-lg card-hover bg-white cursor-pointer gallery-collection-card"
                    data-testid={`gallery-collection-${collection.id}`}>
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
                </div>
                
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4" data-testid="collection-description">
                    {collection.description}
                  </p>
                  
                  {/* Media thumbnails strip */}
                  <div className="flex space-x-2 overflow-x-auto pb-2 mb-4" data-testid="collection-thumbnails">
                    {collection.media?.slice(0, 4).map((media, index) => (
                      <div
                        key={media?.id || index}
                        className="relative w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden"
                        data-testid={`thumbnail-${index}`}
                      >
                        <img
                          src={media?.url || collection.coverImage}
                          alt={media?.caption || `Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {media?.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                            <Play className="w-4 h-4 text-white fill-current" />
                          </div>
                        )}
                      </div>
                    )) || []}
                    {collection.mediaCount > 4 && (
                      <div className="w-20 h-12 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        +{collection.mediaCount - 4}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500" data-testid="collection-location">
                      {collection.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                        data-testid={`collection-view-button-${collection.id}`}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        View Collection
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const shareUrl = `${window.location.origin}/gallery/${collection.id}`;
                          if (navigator.share) {
                            navigator.share({
                              title: collection.title,
                              text: collection.description,
                              url: shareUrl,
                            });
                          } else {
                            navigator.clipboard.writeText(shareUrl);
                          }
                        }}
                        className="text-gray-500 hover:text-brand-orange"
                        data-testid={`gallery-card-share-${collection.id}`}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}