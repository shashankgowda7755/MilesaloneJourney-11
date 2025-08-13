import { useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubePlayerProps {
  url: string;
  title: string;
  description?: string;
}

export default function YouTubePlayer({ url, title, description }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(url);
  
  if (!videoId) {
    return null;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  if (isPlaying) {
    return (
      <div className="relative w-full bg-black rounded-lg overflow-hidden" data-testid="youtube-player-active">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            data-testid="youtube-iframe"
          ></iframe>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 hover:bg-opacity-70"
          data-testid="youtube-close-button"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full cursor-pointer group rounded-lg overflow-hidden bg-black"
      onClick={() => setIsPlaying(true)}
      data-testid="youtube-thumbnail"
    >
      <div className="aspect-video relative">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          data-testid="youtube-thumbnail-image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-colors">
          <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </div>
        
        {/* Video title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg mb-1" data-testid="youtube-title">
            {title}
          </h3>
          {description && (
            <p className="text-white/80 text-sm" data-testid="youtube-description">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}