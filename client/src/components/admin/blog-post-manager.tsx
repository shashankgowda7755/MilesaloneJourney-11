import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const categories = ["adventure", "culture", "food", "people", "places"];

export default function BlogPostManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      return apiRequest('POST', '/api/blog-posts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBlogPost> }) => {
      return apiRequest('PUT', `/api/blog-posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setEditingPost(null);
      editForm.reset();
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      return apiRequest('PUT', `/api/blog-posts/${id}`, { isVisible: !isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Success",
        description: "Blog post visibility updated successfully",
      });
    },
  });

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "adventure",
      tags: [],
      readingTime: 5,
      isFeatured: false,
      isVisible: true,
      publishedAt: new Date(),
    },
  });

  const editForm = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
  });

  const onSubmit = (data: InsertBlogPost) => {
    // Auto-generate slug from title
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Split tags by comma
    if (typeof data.tags === 'string') {
      data.tags = (data.tags as any).split(',').map((tag: string) => tag.trim());
    }
    createMutation.mutate(data);
  };

  const onUpdate = (data: InsertBlogPost) => {
    if (!editingPost) return;
    // Auto-generate slug from title
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Split tags by comma
    if (typeof data.tags === 'string') {
      data.tags = (data.tags as any).split(',').map((tag: string) => tag.trim());
    }
    updateMutation.mutate({ id: editingPost.id, data });
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    editForm.reset({
      ...post,
      tags: post.tags.join(', '),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="blog-post-manager">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Blog Posts Management</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90" data-testid="create-blog-post-button">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Create a new blog post for your travel journey. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter blog post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description of the post" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your travel story..." 
                            className="min-h-[200px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="readingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reading Time (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma separated)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="travel, adventure, culture" 
                            value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input 
                              type="checkbox" 
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded"
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Featured Post</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isVisible"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input 
                              type="checkbox" 
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded"
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Visible</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-brand-orange text-white hover:bg-brand-orange/90"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Post'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts?.map((post) => (
            <div key={post.id} className="border rounded-lg p-4" data-testid={`blog-post-${post.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <Badge variant={post.isFeatured ? "default" : "secondary"}>
                      {post.category}
                    </Badge>
                    {post.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span>{post.readingTime} min read</span>
                    <div className="flex gap-1">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/letters/${post.slug}`, '_blank')}
                    data-testid={`view-blog-post-${post.id}`}
                    title="View post"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleVisibilityMutation.mutate({ id: post.id, isVisible: post.isVisible ?? true })}
                    data-testid={`toggle-visibility-blog-post-${post.id}`}
                    title={post.isVisible ? 'Hide post' : 'Show post'}
                  >
                    {post.isVisible ? '👁️' : '🙈'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(post)}
                    data-testid={`edit-blog-post-${post.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this blog post?')) {
                        deleteMutation.mutate(post.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    data-testid={`delete-blog-post-${post.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {posts?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No blog posts found. Create your first post to get started.
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the blog post details below.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onUpdate)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the post" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your travel story..." 
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="readingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reading Time (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editForm.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="travel, adventure, culture" 
                          value={typeof field.value === 'string' ? field.value : field.value?.join(', ') || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input 
                            type="checkbox" 
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Featured Post</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="isVisible"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input 
                            type="checkbox" 
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Visible</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-brand-orange text-white hover:bg-brand-orange/90"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Update Post'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}