import { useQuery } from "@tanstack/react-query";
import { Images, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Destination, GalleryCollection, BlogPost } from "@shared/schema";

interface RelatedContentProps {
  destination: Destination;
}

export default function RelatedContent({ destination }: RelatedContentProps) {
  // Fetch related gallery if exists
  const { data: relatedGallery } = useQuery<GalleryCollection>({
    queryKey: ["/api/gallery", destination.relatedGalleryId],
    queryFn: async () => {
      if (!destination.relatedGalleryId) return null;
      const response = await fetch(`/api/gallery/${destination.relatedGalleryId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!destination.relatedGalleryId,
  });

  // Fetch related blog posts
  const { data: relatedBlogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/by-ids", destination.relatedBlogPosts],
    queryFn: async () => {
      if (!destination.relatedBlogPosts?.length) return [];
      const promises = destination.relatedBlogPosts.map(async (id) => {
        const response = await fetch(`/api/blog-posts/by-id/${id}`);
        if (!response.ok) return null;
        return response.json();
      });
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    },
    enabled: !!(destination.relatedBlogPosts?.length),
  });

  const hasRelatedContent = relatedGallery || relatedBlogPosts.length > 0;

  if (!hasRelatedContent) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="related-content">
      {/* Related Gallery */}
      {relatedGallery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Images className="w-5 h-5 text-brand-orange" />
              <span>Photo Gallery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img
                src={relatedGallery.coverImage}
                alt={relatedGallery.title}
                className="w-24 h-24 object-cover rounded-lg"
                data-testid="gallery-cover-image"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-brand-brown mb-1" data-testid="gallery-title">
                  {relatedGallery.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2" data-testid="gallery-description">
                  {relatedGallery.description}
                </p>
                <Badge variant="secondary" className="text-xs" data-testid="gallery-media-count">
                  {relatedGallery.mediaCount} photos
                </Badge>
              </div>
              <Link href={`/gallery/${relatedGallery.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
                  data-testid="view-gallery-button"
                >
                  <Images className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Blog Posts */}
      {relatedBlogPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-brand-orange" />
              <span>Travel Stories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedBlogPosts.map((post) => (
                <div key={post.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-20 h-20 object-cover rounded-lg"
                    data-testid={`blog-image-${post.slug}`}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-brown mb-1" data-testid={`blog-title-${post.slug}`}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2" data-testid={`blog-excerpt-${post.slug}`}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {post.readingTime} min read
                      </span>
                    </div>
                  </div>
                  <Link href={`/letters/${post.slug}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-brand-orange hover:bg-brand-orange hover:text-white"
                      data-testid={`read-blog-button-${post.slug}`}
                    >
                      Read Story
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}