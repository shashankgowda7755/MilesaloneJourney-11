import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Calendar, Tag, Share2, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost as BlogPostType } from "@shared/schema";
import SocialMediaDisplay from "@/components/social-media-display";
import DetailedSocialShare from "@/components/detailed-social-share";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: ["/api/blog-posts", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${slug}`);
      if (!response.ok) {
        throw new Error('Blog post not found');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 lg:py-24" data-testid="blog-post-loading">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 lg:py-24 flex items-center justify-center" data-testid="blog-post-error">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="font-playfair text-2xl font-bold text-brand-brown mb-4">
              Story Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The travel story you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/letters">
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Letters
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoryColors = {
    adventure: "bg-green-100 text-green-800",
    culture: "bg-purple-100 text-purple-800",
    food: "bg-orange-100 text-orange-800",
    people: "bg-blue-100 text-blue-800",
    places: "bg-teal-100 text-teal-800"
  };

  return (
    <div className="min-h-screen bg-brand-cream py-16 lg:py-24" data-testid="blog-post-page">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/letters">
            <Button variant="ghost" className="text-brand-brown hover:bg-brand-brown/10" data-testid="back-to-letters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Letters
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl" data-testid="blog-post-hero">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-96 lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Article Header */}
        <div className="mb-8" data-testid="blog-post-header">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge 
              className={`${categoryColors[post.category as keyof typeof categoryColors]} text-sm font-medium`}
              data-testid="blog-post-category"
            >
              {post.category}
            </Badge>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="mr-1 h-4 w-4" />
              {formattedDate}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="mr-1 h-4 w-4" />
              {post.readingTime} min read
            </div>
          </div>
          
          <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6" data-testid="blog-post-title">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-6" data-testid="blog-post-excerpt">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6" data-testid="blog-post-tags">
              <Tag className="h-4 w-4 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Social Sharing */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              data-testid="share-button"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg" data-testid="blog-post-content">
          <div 
            className="prose prose-lg max-w-none
                     prose-headings:font-playfair prose-headings:text-brand-brown
                     prose-p:text-gray-700 prose-p:leading-relaxed
                     prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-brand-brown
                     prose-blockquote:border-l-4 prose-blockquote:border-brand-orange prose-blockquote:pl-4
                     prose-blockquote:italic prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Detailed Social Sharing */}
        <div className="mt-12 mb-8">
          <DetailedSocialShare
            title={post.title}
            description={post.excerpt}
            url={window.location.href}
            hashtags={[...(post.tags || []), ...(post.socialMediaHashtags || [])]}
            type="blog"
            instagramUrl={post.instagramPostUrl || undefined}
            youtubeUrl={post.youtubeVideoUrl || undefined}
          />
        </div>

        {/* Social Media Integration */}
        <div className="mt-8">
          <SocialMediaDisplay
            data={{
              instagramPostUrl: post.instagramPostUrl || undefined,
              twitterPostUrl: post.twitterPostUrl || undefined,
              facebookPostUrl: post.facebookPostUrl || undefined,
              youtubeVideoUrl: post.youtubeVideoUrl || undefined,
              socialMediaHashtags: post.socialMediaHashtags || undefined
            }}
            title="Follow this story on social media"
            compact={false}
            showHashtags={true}
          />
        </div>

        {/* Related Posts Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200" data-testid="related-posts">
          <div className="text-center py-8 mb-32">
            <h3 className="font-playfair text-2xl font-bold text-brand-brown mb-4">
              Continue Reading
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Dive deeper into more travel stories and experiences from the Kashmir to Kanyakumari journey
            </p>
            <Link href="/letters">
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90 px-8 py-3 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore More Stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}