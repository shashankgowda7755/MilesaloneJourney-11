import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import type { GalleryCollectionWithMedia } from "@shared/schema";

interface LightboxProps {
  collection: GalleryCollectionWithMedia;
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function Lightbox({ collection, initialIndex, onClose, onIndexChange }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentMedia = collection.media[currentIndex];

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? collection.media.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === collection.media.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!currentMedia) return null;

  return (
    <div 
      className="fixed inset-0 z-60 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
      data-testid="lightbox-overlay"
    >
      <div className="relative max-w-4xl max-h-screen p-4 w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 hover:bg-opacity-70"
          data-testid="lightbox-close-button"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Navigation Buttons */}
        {collection.media.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 hover:bg-opacity-70"
              data-testid="lightbox-previous-button"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 hover:bg-opacity-70"
              data-testid="lightbox-next-button"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Media Content */}
        <div className="flex items-center justify-center h-full" data-testid="lightbox-content">
          {currentMedia.type === 'video' ? (
            <div className="relative">
              <video
                src={currentMedia.url}
                controls
                className="max-w-full max-h-full rounded-lg"
                data-testid="lightbox-video"
              />
            </div>
          ) : (
            <img
              src={currentMedia.url}
              alt={currentMedia.caption || `Media ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              data-testid="lightbox-image"
            />
          )}
        </div>

        {/* Caption and Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center bg-black bg-opacity-50 rounded-lg p-4 max-w-lg">
          {currentMedia.caption && (
            <p className="mb-2 text-lg" data-testid="lightbox-caption">
              {currentMedia.caption}
            </p>
          )}
          <p className="text-sm opacity-75" data-testid="lightbox-counter">
            {currentIndex + 1} of {collection.media.length}
          </p>
        </div>
      </div>
    </div>
  );
}
