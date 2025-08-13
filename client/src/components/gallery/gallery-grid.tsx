import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Image, Expand } from "lucide-react";
import Lightbox from "./lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import type { GalleryCollectionWithMedia } from "@shared/schema";

export default function GalleryGrid() {
  const [selectedCollection, setSelectedCollection] = useState<GalleryCollectionWithMedia | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: collections = [], isLoading } = useQuery<GalleryCollectionWithMedia[]>({
    queryKey: ["/api/gallery"],
  });

  const openLightbox = (collection: GalleryCollectionWithMedia, startIndex = 0) => {
    setSelectedCollection(collection);
    setLightboxIndex(startIndex);
  };

  const closeLightbox = () => {
    setSelectedCollection(null);
  };

  return (
    <div className="space-y-8" data-testid="gallery-grid">
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
            <Card 
              key={collection.id} 
              className="overflow-hidden shadow-lg card-hover bg-white cursor-pointer"
              data-testid={`gallery-collection-${collection.id}`}
              onClick={() => openLightbox(collection)}
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
                      openLightbox(collection);
                    }}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white hover:bg-white hover:bg-opacity-30"
                    data-testid="collection-expand-button"
                  >
                    <Expand className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4" data-testid="collection-description">
                  {collection.description}
                </p>
                
                {/* Media thumbnails strip */}
                <div className="flex space-x-2 overflow-x-auto pb-2 mb-4" data-testid="collection-thumbnails">
                  {collection.media.slice(0, 4).map((media, index) => (
                    <div
                      key={media.id}
                      className="relative w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(collection, index);
                      }}
                      data-testid={`thumbnail-${index}`}
                    >
                      <img
                        src={media.url}
                        alt={media.caption || `Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {media.type === 'video' && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(collection);
                  }}
                  className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
                  data-testid="view-collection-button"
                >
                  <Image className="h-4 w-4 mr-2" />
                  View Full Collection
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedCollection && (
        <Lightbox
          collection={selectedCollection}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
