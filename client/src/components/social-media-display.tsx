import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Twitter, Facebook, Youtube, ExternalLink, Hash } from 'lucide-react';

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

interface SocialMediaDisplayProps {
  data: SocialMediaData;
  title?: string;
  compact?: boolean;
  showHashtags?: boolean;
}

export function SocialMediaDisplay({ 
  data, 
  title,
  compact = false,
  showHashtags = true 
}: SocialMediaDisplayProps) {
  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const hasAnySocialLinks = Object.entries(data).some(([key, value]) => 
    key !== 'socialMediaHashtags' && value
  );

  const hasHashtags = data.socialMediaHashtags && data.socialMediaHashtags.length > 0;

  if (!hasAnySocialLinks && !hasHashtags) {
    return null;
  }

  const SocialButton = ({ url, icon: Icon, label, variant = 'outline' }: {
    url: string;
    icon: any;
    label: string;
    variant?: 'outline' | 'secondary';
  }) => (
    <Button
      variant={variant}
      size={compact ? 'sm' : 'default'}
      onClick={() => openUrl(url)}
      className="flex items-center gap-2"
    >
      <Icon className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
      {!compact && label}
    </Button>
  );

  if (compact) {
    return (
      <div className="space-y-3">
        {hasAnySocialLinks && (
          <div className="flex flex-wrap gap-2">
            {data.instagramPostUrl && (
              <SocialButton url={data.instagramPostUrl} icon={Instagram} label="Instagram" />
            )}
            {data.twitterPostUrl && (
              <SocialButton url={data.twitterPostUrl} icon={Twitter} label="Twitter" />
            )}
            {data.facebookPostUrl && (
              <SocialButton url={data.facebookPostUrl} icon={Facebook} label="Facebook" />
            )}
            {data.youtubeVideoUrl && (
              <SocialButton url={data.youtubeVideoUrl} icon={Youtube} label="YouTube" />
            )}
            {data.instagramStoryUrl && (
              <SocialButton url={data.instagramStoryUrl} icon={Instagram} label="Story" />
            )}
            {data.instagramReelUrl && (
              <SocialButton url={data.instagramReelUrl} icon={Instagram} label="Reel" />
            )}
            {data.twitterUpdateUrl && (
              <SocialButton url={data.twitterUpdateUrl} icon={Twitter} label="Update" />
            )}
            {data.youtubeShortUrl && (
              <SocialButton url={data.youtubeShortUrl} icon={Youtube} label="Short" />
            )}
          </div>
        )}
        
        {showHashtags && hasHashtags && (
          <div className="flex flex-wrap gap-1">
            {data.socialMediaHashtags!.map((hashtag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{hashtag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {title && (
            <h3 className="text-lg font-semibold">Follow the Journey</h3>
          )}

          {hasAnySocialLinks && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {data.instagramPostUrl && (
                  <SocialButton url={data.instagramPostUrl} icon={Instagram} label="Instagram Post" />
                )}
                {data.twitterPostUrl && (
                  <SocialButton url={data.twitterPostUrl} icon={Twitter} label="Twitter Post" />
                )}
                {data.facebookPostUrl && (
                  <SocialButton url={data.facebookPostUrl} icon={Facebook} label="Facebook Post" />
                )}
                {data.youtubeVideoUrl && (
                  <SocialButton url={data.youtubeVideoUrl} icon={Youtube} label="YouTube Video" />
                )}
              </div>

              {/* Journey-specific additional links */}
              {(data.instagramStoryUrl || data.instagramReelUrl || data.twitterUpdateUrl || data.youtubeShortUrl) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t">
                  {data.instagramStoryUrl && (
                    <SocialButton url={data.instagramStoryUrl} icon={Instagram} label="Instagram Story" variant="secondary" />
                  )}
                  {data.instagramReelUrl && (
                    <SocialButton url={data.instagramReelUrl} icon={Instagram} label="Instagram Reel" variant="secondary" />
                  )}
                  {data.twitterUpdateUrl && (
                    <SocialButton url={data.twitterUpdateUrl} icon={Twitter} label="Twitter Update" variant="secondary" />
                  )}
                  {data.youtubeShortUrl && (
                    <SocialButton url={data.youtubeShortUrl} icon={Youtube} label="YouTube Short" variant="secondary" />
                  )}
                </div>
              )}
            </div>
          )}

          {showHashtags && hasHashtags && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Hash className="h-4 w-4" />
                Follow Along
              </div>
              <div className="flex flex-wrap gap-2">
                {data.socialMediaHashtags!.map((hashtag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    #{hashtag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default SocialMediaDisplay;