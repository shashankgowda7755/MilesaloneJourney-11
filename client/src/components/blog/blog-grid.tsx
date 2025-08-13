import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BlogCard from "./blog-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";

const categories = [
  { value: "all", label: "All Stories" },
  { value: "adventure", label: "Adventure" },
  { value: "culture", label: "Culture" },
  { value: "food", label: "Food" },
  { value: "people", label: "People" },
  { value: "places", label: "Places" },
];

export default function BlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts", selectedCategory !== "all" ? selectedCategory : undefined],
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8" data-testid="blog-grid">
      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              data-testid="blog-search-input"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="blog-category-select">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.value)}
            className={selectedCategory === category.value 
              ? "bg-brand-orange text-white hover:bg-brand-orange/90" 
              : "bg-white text-brand-brown hover:bg-brand-orange hover:text-white"
            }
            data-testid={`category-filter-${category.value}`}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Results Info */}
      <div className="text-center text-gray-600" data-testid="blog-results-info">
        {isLoading ? (
          "Loading stories..."
        ) : (
          `${filteredPosts.length} ${filteredPosts.length === 1 ? 'story' : 'stories'} found`
        )}
      </div>

      {/* Blog Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16" data-testid="no-posts-message">
          <p className="text-gray-500 text-lg">No stories found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-posts-grid">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
