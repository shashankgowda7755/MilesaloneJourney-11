import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Share2, Instagram, Twitter, Facebook, Youtube, Copy, ExternalLink, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialMediaData {
  instagramPostUrl?: string;
  twitterPostUrl?: string;
  facebookPostUrl?: string;
  youtubeVideoUrl?: string;
  instagramStoryUrl?: string;
  instagramReelUrl?: string;
  twitterUpdateUrl?: string;
  youtubeShortUrl?: string;
  socialMediaHashtags?: string[];
}

interface SocialMediaIntegrationProps {
  data: SocialMediaData;
  onUpdate: (data: SocialMediaData) => void;
  title: string;
  description?: string;
  url?: string;
  type?: 'blog' | 'destination' | 'journey' | 'travel-pin';
}

export function SocialMediaIntegration({ 
  data, 
  onUpdate, 
  title, 
  description, 
  url, 
  type = 'blog' 
}: SocialMediaIntegrationProps) {
  const { toast } = useToast();
  const [newHashtag, setNewHashtag] = useState('');

  const handleUrlUpdate = (platform: keyof SocialMediaData, value: string) => {
    onUpdate({
      ...data,
      [platform]: value || undefined
    });
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !data.socialMediaHashtags?.includes(newHashtag.trim())) {
      const updatedHashtags = [...(data.socialMediaHashtags || []), newHashtag.trim()];
      onUpdate({
        ...data,
        socialMediaHashtags: updatedHashtags
      });
      setNewHashtag('');
    }
  };

  const removeHashtag = (hashtag: string) => {
    const updatedHashtags = data.socialMediaHashtags?.filter(h => h !== hashtag) || [];
    onUpdate({
      ...data,
      socialMediaHashtags: updatedHashtags
    });
  };

  const shareToSocialMedia = (platform: string) => {
    const shareUrl = encodeURIComponent(url || window.location.href);
    const shareTitle = encodeURIComponent(title);
    const shareDescription = encodeURIComponent(description || '');
    const hashtags = data.socialMediaHashtags?.join(',') || '';

    let socialUrl = '';

    switch (platform) {
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}&hashtags=${hashtags}`;
        break;
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareTitle}`;
        break;
      case 'instagram':
        // Instagram doesn't allow direct sharing from web, but we can copy content
        navigator.clipboard.writeText(`${title}\n\n${description}\n\n${data.socialMediaHashtags?.map(h => `#${h}`).join(' ')}\n\n${url}`);
        toast({
          title: "Content Copied!",
          description: "Instagram post content copied to clipboard. Open Instagram to share.",
        });
        return;
      default:
        return;
    }

    if (socialUrl) {
      window.open(socialUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const openSocialUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Quick Share Buttons */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Share</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareToSocialMedia('twitter')}
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareToSocialMedia('facebook')}
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareToSocialMedia('instagram')}
              className="flex items-center gap-2"
            >
              <Instagram className="h-4 w-4" />
              Copy for Instagram
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(url || window.location.href, 'URL')}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>

        <Separator />

        {/* Social Media URLs */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Social Media Posts & Links</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instagram */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Instagram className="h-3 w-3" />
                Instagram Post URL
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://instagram.com/p/..."
                  value={data.instagramPostUrl || ''}
                  onChange={(e) => handleUrlUpdate('instagramPostUrl', e.target.value)}
                  className="text-sm"
                />
                {data.instagramPostUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openSocialUrl(data.instagramPostUrl!)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Twitter className="h-3 w-3" />
                Twitter Post URL
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://twitter.com/..."
                  value={data.twitterPostUrl || ''}
                  onChange={(e) => handleUrlUpdate('twitterPostUrl', e.target.value)}
                  className="text-sm"
                />
                {data.twitterPostUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openSocialUrl(data.twitterPostUrl!)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Facebook */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Facebook className="h-3 w-3" />
                Facebook Post URL
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://facebook.com/..."
                  value={data.facebookPostUrl || ''}
                  onChange={(e) => handleUrlUpdate('facebookPostUrl', e.target.value)}
                  className="text-sm"
                />
                {data.facebookPostUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openSocialUrl(data.facebookPostUrl!)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* YouTube */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Youtube className="h-3 w-3" />
                YouTube Video URL
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={data.youtubeVideoUrl || ''}
                  onChange={(e) => handleUrlUpdate('youtubeVideoUrl', e.target.value)}
                  className="text-sm"
                />
                {data.youtubeVideoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openSocialUrl(data.youtubeVideoUrl!)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Journey-specific fields */}
          {type === 'journey' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Instagram Story URL</Label>
                <Input
                  placeholder="https://instagram.com/stories/..."
                  value={data.instagramStoryUrl || ''}
                  onChange={(e) => handleUrlUpdate('instagramStoryUrl', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Instagram Reel URL</Label>
                <Input
                  placeholder="https://instagram.com/reel/..."
                  value={data.instagramReelUrl || ''}
                  onChange={(e) => handleUrlUpdate('instagramReelUrl', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Twitter Update URL</Label>
                <Input
                  placeholder="https://twitter.com/..."
                  value={data.twitterUpdateUrl || ''}
                  onChange={(e) => handleUrlUpdate('twitterUpdateUrl', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">YouTube Short URL</Label>
                <Input
                  placeholder="https://youtube.com/shorts/..."
                  value={data.youtubeShortUrl || ''}
                  onChange={(e) => handleUrlUpdate('youtubeShortUrl', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Hashtags */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Hash className="h-4 w-4" />
            Social Media Hashtags
          </Label>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter hashtag (without #)"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
              className="text-sm"
            />
            <Button onClick={addHashtag} size="sm">Add</Button>
          </div>

          {data.socialMediaHashtags && data.socialMediaHashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.socialMediaHashtags.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeHashtag(hashtag)}
                >
                  #{hashtag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        {data.socialMediaHashtags && data.socialMediaHashtags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Social Media Preview</Label>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div className="font-medium">{title}</div>
                {description && <div className="text-muted-foreground mt-1">{description}</div>}
                <div className="mt-2 text-blue-600">
                  {data.socialMediaHashtags.map(h => `#${h}`).join(' ')}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default SocialMediaIntegration;