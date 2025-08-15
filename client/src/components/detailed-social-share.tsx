import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Twitter, Facebook, Linkedin, Copy, Check, Instagram, Youtube } from 'lucide-react';
import { useState } from 'react';

interface DetailedSocialShareProps {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
  type?: 'destination' | 'blog';
  instagramUrl?: string;
  youtubeUrl?: string;
}

export default function DetailedSocialShare({ 
  title, 
  description, 
  url, 
  hashtags = [],
  type = 'blog',
  instagramUrl,
  youtubeUrl
}: DetailedSocialShareProps) {
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

  const openSocialMedia = (socialUrl: string) => {
    window.open(socialUrl, '_blank');
  };

  return (
    <Card className="w-full" data-testid="detailed-social-share">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Share2 className="h-5 w-5" />
          Share this {type === 'destination' ? 'destination' : 'story'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Sharing Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            onClick={handleNativeShare}
            className="bg-brand-orange text-white hover:bg-brand-orange/90"
            data-testid="native-share-button"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Button 
            variant="outline" 
            onClick={() => openShareUrl(shareUrls.twitter)}
            className="border-blue-400 text-blue-500 hover:bg-blue-50"
            data-testid="twitter-share-detailed"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>

          <Button 
            variant="outline" 
            onClick={() => openShareUrl(shareUrls.facebook)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            data-testid="facebook-share-detailed"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>

          <Button 
            variant="outline" 
            onClick={() => openShareUrl(shareUrls.linkedin)}
            className="border-blue-700 text-blue-700 hover:bg-blue-50"
            data-testid="linkedin-share-detailed"
          >
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </Button>
        </div>

        {/* Social Media Posts (if available) */}
        {(instagramUrl || youtubeUrl) && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-3">Follow on social media:</h4>
            <div className="flex gap-3">
              {instagramUrl && (
                <Button 
                  variant="outline"
                  onClick={() => openSocialMedia(instagramUrl)}
                  className="border-pink-400 text-pink-600 hover:bg-pink-50"
                  data-testid="instagram-post-link"
                >
                  <Instagram className="mr-2 h-4 w-4" />
                  Instagram
                </Button>
              )}
              {youtubeUrl && (
                <Button 
                  variant="outline"
                  onClick={() => openSocialMedia(youtubeUrl)}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  data-testid="youtube-video-link"
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  YouTube
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Copy URL */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-50 text-sm"
                data-testid="share-url-input"
              />
            </div>
            <Button 
              variant="outline"
              onClick={copyToClipboard}
              data-testid="copy-url-detailed"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Hashtags:</h4>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((hashtag, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => copyToClipboard()}
                  data-testid={`hashtag-${index}`}
                >
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}