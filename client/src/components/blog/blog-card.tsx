import { Link } from "wouter";
import { Clock, Calendar, Images, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BlogCardShare from "./blog-card-share";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

const categoryColors: Record<string, string> = {
  adventure: "bg-brand-orange text-white",
  culture: "bg-brand-green text-white",
  food: "bg-yellow-500 text-white",
  people: "bg-purple-500 text-white",
  places: "bg-blue-500 text-white",
};

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(new Date(date));
  };

  const handleViewGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to gallery page
    window.open('/gallery', '_blank');
  };

  return (
    <Link href={`/letters/${post.slug}`} className="block" data-testid={`blog-card-link-${post.slug}`}>
      <Card className="overflow-hidden shadow-lg card-hover bg-white cursor-pointer" data-testid={`blog-card-${post.slug}`}>
        <div className="relative h-48">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            data-testid="blog-card-image"
          />
          <div className="absolute top-4 left-4">
            <Badge 
              className={categoryColors[post.category] || "bg-gray-500 text-white"}
              data-testid="blog-card-category"
            >
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <h3 className="font-playfair text-xl font-bold text-brand-brown mb-3 line-clamp-2" data-testid="blog-card-title">
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3" data-testid="blog-card-excerpt">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center" data-testid="blog-card-reading-time">
              <Clock className="w-4 h-4 mr-1" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center" data-testid="blog-card-date">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-brand-orange">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="font-medium">Read Story</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                data-testid="blog-card-view-gallery"
                onClick={handleViewGallery}
              >
                <Images className="w-4 h-4 mr-1" />
                View Photos
              </Button>
              <BlogCardShare post={post} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
