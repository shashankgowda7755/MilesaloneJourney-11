import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Link } from "lucide-react";
import { useState } from "react";
import type { Destination } from "@shared/schema";

interface DestinationCardShareProps {
  destination: Destination;
}

export default function DestinationCardShare({ destination }: DestinationCardShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/journey/${destination.slug}`;
  const shareText = `Check out ${destination.name} - ${destination.description}`;
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: destination.name,
        text: shareText,
        url: shareUrl,
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  const openShareUrl = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const copyUrl = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="relative">
      <Button 
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="text-gray-500 hover:text-brand-orange p-2"
        data-testid={`destination-card-share-${destination.slug}`}
      >
        <Share2 className="w-4 h-4" />
      </Button>
      
      {isOpen && !navigator.share && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border p-3 z-20">
          <div className="text-xs text-gray-600 mb-2">Share destination:</div>
          <div className="flex gap-2">
            <Button 
              variant="ghost"
              size="sm"
              onClick={(e) => openShareUrl(e, twitterUrl)}
              className="text-blue-500 hover:text-blue-700 p-2"
              data-testid="twitter-share"
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={(e) => openShareUrl(e, facebookUrl)}
              className="text-blue-600 hover:text-blue-800 p-2"
              data-testid="facebook-share"
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={copyUrl}
              className={`p-2 ${copied ? 'text-green-600' : 'text-gray-600 hover:text-gray-800'}`}
              data-testid="copy-url"
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}