import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Edit, Trash2, Images, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGalleryCollectionSchema, type GalleryCollectionWithMedia, type InsertGalleryCollection } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function GalleryManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<GalleryCollectionWithMedia | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: collections, isLoading } = useQuery<GalleryCollectionWithMedia[]>({
    queryKey: ['/api/gallery'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGalleryCollection) => {
      return apiRequest('/api/gallery', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Gallery collection created successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/gallery/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Success",
        description: "Gallery collection deleted successfully",
      });
    },
  });

  const form = useForm<InsertGalleryCollection>({
    resolver: zodResolver(insertGalleryCollectionSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: "",
      location: "",
    },
  });

  const onSubmit = (data: InsertGalleryCollection) => {
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="gallery-manager">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gallery Management</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white hover:bg-blue-500/90" data-testid="create-gallery-collection-button">
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Gallery Collection</DialogTitle>
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
                          <Input placeholder="Enter collection title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe this photo collection" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/cover-image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Where were these photos taken?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                      className="bg-blue-500 text-white hover:bg-blue-500/90"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Collection'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections?.map((collection) => (
            <Card key={collection.id} className="overflow-hidden" data-testid={`gallery-collection-${collection.id}`}>
              <div className="aspect-video bg-gray-100 relative">
                {collection.coverImage ? (
                  <img
                    src={collection.coverImage}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  <Images className="inline mr-1 h-3 w-3" />
                  {collection.mediaCount}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{collection.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{collection.description}</p>
                {collection.location && (
                  <p className="text-gray-500 text-xs mb-3">{collection.location}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(collection.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCollection(collection)}
                      data-testid={`edit-collection-${collection.id}`}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this collection and all its photos?')) {
                          deleteMutation.mutate(collection.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      data-testid={`delete-collection-${collection.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {collections?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Camera className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No gallery collections found. Create your first collection to get started.</p>
            </div>
          )}
        </div>
        
        {/* Placeholder for future photo management within collections */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center text-gray-600">
            <Images className="mx-auto h-8 w-8 mb-2" />
            <p className="font-medium mb-1">Photo Management</p>
            <p className="text-sm">Individual photo upload and management will be available in the next update.</p>
            <p className="text-sm">For now, you can create collections and reference photo URLs directly.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}