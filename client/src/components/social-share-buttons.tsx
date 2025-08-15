import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareButtonsProps {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
}

export default function SocialShareButtons({ 
  title, 
  description, 
  url, 
  hashtags = [] 
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${title} - ${description}`
    )}&url=${encodeURIComponent(url)}&hashtags=${hashtags.join(',')}`,
    
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const openShareUrl = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-wrap items-center gap-3" data-testid="social-share-buttons">
      <span className="text-sm font-medium text-gray-700">Share:</span>
      
      {/* Native Share / Copy URL */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleNativeShare}
        data-testid="native-share-button"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </>
        )}
      </Button>

      {/* Twitter */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => openShareUrl(shareUrls.twitter)}
        className="text-blue-500 hover:text-blue-700"
        data-testid="twitter-share-button"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      {/* Facebook */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => openShareUrl(shareUrls.facebook)}
        className="text-blue-600 hover:text-blue-800"
        data-testid="facebook-share-button"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      {/* LinkedIn */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => openShareUrl(shareUrls.linkedin)}
        className="text-blue-700 hover:text-blue-900"
        data-testid="linkedin-share-button"
      >
        <Linkedin className="h-4 w-4" />
      </Button>

      {/* Copy URL */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={copyToClipboard}
        data-testid="copy-url-button"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}