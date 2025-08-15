import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook } from "lucide-react";
import { useState } from "react";
import type { BlogPost } from "@shared/schema";

interface BlogCardShareProps {
  post: BlogPost;
}

export default function BlogCardShare({ post }: BlogCardShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const shareUrl = `${window.location.origin}/letters/${post.slug}`;
  const shareText = `${post.title} - ${post.excerpt}`;
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
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

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="relative">
      <Button 
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="text-gray-500 hover:text-brand-orange"
        data-testid={`blog-card-share-${post.slug}`}
      >
        <Share2 className="w-4 h-4" />
      </Button>
      
      {isOpen && !navigator.share && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border p-2 z-10">
          <div className="flex gap-2">
            <Button 
              variant="ghost"
              size="sm"
              onClick={(e) => openShareUrl(e, twitterUrl)}
              className="text-blue-500 hover:text-blue-700"
              data-testid="twitter-share"
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={(e) => openShareUrl(e, facebookUrl)}
              className="text-blue-600 hover:text-blue-800"
              data-testid="facebook-share"
            >
              <Facebook className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}