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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Images, Camera, Eye, Youtube, Video, Link, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGalleryCollectionSchema, insertGalleryMediaSchema, type GalleryCollectionWithMedia, type InsertGalleryCollection, type InsertGalleryMedia } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const mediaTypes = [
  { value: "photo", label: "Photo", icon: Camera },
  { value: "video", label: "Video File", icon: Video },
  { value: "youtube", label: "YouTube Video", icon: Youtube },
  { value: "embedded_video", label: "Embedded Video", icon: Video },
  { value: "link", label: "External Link", icon: ExternalLink }
];

export default function GalleryManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<GalleryCollectionWithMedia | null>(null);
  const [manageMediaCollection, setManageMediaCollection] = useState<GalleryCollectionWithMedia | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: collections, isLoading } = useQuery<GalleryCollectionWithMedia[]>({
    queryKey: ['/api/gallery'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGalleryCollection) => {
      return apiRequest('POST', '/api/gallery', data);
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

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<InsertGalleryCollection> }) => {
      return apiRequest('PUT', `/api/gallery/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setEditingCollection(null);
      editForm.reset();
      toast({
        title: "Success",
        description: "Gallery collection updated successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Success",
        description: "Gallery collection deleted successfully",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string, isVisible: boolean }) => {
      return apiRequest('PUT', `/api/gallery/${id}`, { isVisible: !isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Success",
        description: "Gallery visibility updated successfully",
      });
    },
  });

  const addMediaMutation = useMutation({
    mutationFn: async (data: InsertGalleryMedia) => {
      return apiRequest('POST', '/api/gallery/media', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      mediaForm.reset();
      toast({
        title: "Success",
        description: "Media added to collection successfully",
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
      youtubeUrl: "",
      isVisible: true,
    },
  });

  const editForm = useForm<InsertGalleryCollection>({
    resolver: zodResolver(insertGalleryCollectionSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: "",
      location: "",
      youtubeUrl: "",
      isVisible: true,
    },
  });

  const mediaForm = useForm<InsertGalleryMedia>({
    resolver: zodResolver(insertGalleryMediaSchema),
    defaultValues: {
      collectionId: "",
      type: "photo",
      url: "",
      caption: "",
      title: "",
      thumbnailUrl: "",
      embedCode: "",
      linkUrl: "",
      sortOrder: 0,
    },
  });

  const onSubmit = (data: InsertGalleryCollection) => {
    createMutation.mutate(data);
  };

  const onUpdate = (data: InsertGalleryCollection) => {
    if (!editingCollection) return;
    updateMutation.mutate({ id: editingCollection.id, data });
  };

  const onAddMedia = (data: InsertGalleryMedia) => {
    if (!manageMediaCollection) return;
    addMediaMutation.mutate({ ...data, collectionId: manageMediaCollection.id });
  };

  const openEditDialog = (collection: GalleryCollectionWithMedia) => {
    setEditingCollection(collection);
    editForm.reset({
      title: collection.title,
      description: collection.description,
      coverImage: collection.coverImage,
      location: collection.location || "",
      youtubeUrl: collection.youtubeUrl || "",
      isVisible: collection.isVisible,
    });
  };

  const openManageMediaDialog = (collection: GalleryCollectionWithMedia) => {
    setManageMediaCollection(collection);
    mediaForm.reset({
      collectionId: collection.id,
      type: "photo",
      url: "",
      caption: "",
      title: "",
      thumbnailUrl: "",
      embedCode: "",
      linkUrl: "",
      sortOrder: collection.media?.length || 0,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading gallery collections...</div>
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
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90" data-testid="create-gallery-button">
                <Plus className="mr-2 h-4 w-4" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Gallery Collection</DialogTitle>
                <DialogDescription>
                  Create a new photo and media collection for your travel journey.
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
                          <Textarea placeholder="Description of the collection" {...field} />
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
                        <FormLabel>Location (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Location where photos were taken" value={field.value || ""} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Video URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/watch?v=..." value={field.value || ""} onChange={field.onChange} />
                        </FormControl>
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
                        <FormLabel className="text-sm font-normal">Visible to visitors</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-brand-orange text-white hover:bg-brand-orange/90" disabled={createMutation.isPending}>
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
        <div className="space-y-4">
          {collections?.map((collection) => (
            <div key={collection.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{collection.title}</h3>
                    {!collection.isVisible && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">Hidden</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{collection.description}</p>
                  {collection.location && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <Camera className="h-3 w-3 mr-1" />
                      {collection.location}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Images className="h-3 w-3 mr-1" />
                      {collection.mediaCount || 0} media items
                    </span>
                    {collection.youtubeUrl && (
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        <Youtube className="h-3 w-3 mr-1" />
                        YouTube
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/gallery`, '_blank')}
                    data-testid={`view-gallery-${collection.id}`}
                    title="View gallery"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleVisibilityMutation.mutate({ id: collection.id, isVisible: collection.isVisible ?? true })}
                    data-testid={`toggle-visibility-gallery-${collection.id}`}
                    title={collection.isVisible ? 'Hide collection' : 'Show collection'}
                  >
                    {collection.isVisible ? '👁️' : '🙈'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openManageMediaDialog(collection)}
                    data-testid={`manage-media-${collection.id}`}
                    title="Manage media"
                  >
                    <Images className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(collection)}
                    data-testid={`edit-gallery-${collection.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this gallery collection?')) {
                        deleteMutation.mutate(collection.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    data-testid={`delete-gallery-${collection.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {collections?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No gallery collections found. Create your first collection to get started.
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Gallery Collection Dialog */}
      <Dialog open={!!editingCollection} onOpenChange={() => setEditingCollection(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gallery Collection</DialogTitle>
            <DialogDescription>
              Update the gallery collection details below.
            </DialogDescription>
          </DialogHeader>
          {editingCollection && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onUpdate)} className="space-y-4">
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description of the collection" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Location where photos were taken" value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/watch?v=..." value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
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
                      <FormLabel className="text-sm font-normal">Visible to visitors</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setEditingCollection(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-green text-white hover:bg-brand-green/90" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Updating...' : 'Update Collection'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Media Dialog */}
      <Dialog open={!!manageMediaCollection} onOpenChange={() => setManageMediaCollection(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Media - {manageMediaCollection?.title}</DialogTitle>
            <DialogDescription>
              Add and manage photos, videos, YouTube embeds, and links for this collection.
            </DialogDescription>
          </DialogHeader>
          {manageMediaCollection && (
            <Tabs defaultValue="add" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">Add Media</TabsTrigger>
                <TabsTrigger value="existing">Existing Media ({manageMediaCollection.media?.length || 0})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="add" className="space-y-4">
                <Form {...mediaForm}>
                  <form onSubmit={mediaForm.handleSubmit(onAddMedia)} className="space-y-4">
                    <FormField
                      control={mediaForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select media type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mediaTypes.map((type) => {
                                const IconComponent = type.icon;
                                return (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center">
                                      <IconComponent className="h-4 w-4 mr-2" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={mediaForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {mediaForm.watch("type") === "photo" && "Image URL"}
                            {mediaForm.watch("type") === "video" && "Video File URL"}
                            {mediaForm.watch("type") === "youtube" && "YouTube Video URL"}
                            {mediaForm.watch("type") === "link" && "Link URL"}
                            {mediaForm.watch("type") === "embedded_video" && "Video URL"}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={
                                mediaForm.watch("type") === "photo" ? "https://example.com/photo.jpg" :
                                mediaForm.watch("type") === "video" ? "https://example.com/video.mp4" :
                                mediaForm.watch("type") === "youtube" ? "https://youtube.com/watch?v=..." :
                                mediaForm.watch("type") === "link" ? "https://example.com" :
                                "https://example.com/video.mp4"
                              }
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(mediaForm.watch("type") === "link" || mediaForm.watch("type") === "embedded_video") && (
                      <FormField
                        control={mediaForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Title for the content" value={field.value || ""} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {(mediaForm.watch("type") === "video" || mediaForm.watch("type") === "youtube" || mediaForm.watch("type") === "link") && (
                      <FormField
                        control={mediaForm.control}
                        name="thumbnailUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thumbnail URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/thumbnail.jpg" value={field.value || ""} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {mediaForm.watch("type") === "embedded_video" && (
                      <FormField
                        control={mediaForm.control}
                        name="embedCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Embed Code (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="<iframe src='...' width='560' height='315'></iframe>"
                                value={field.value || ""} 
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {mediaForm.watch("type") === "link" && (
                      <FormField
                        control={mediaForm.control}
                        name="linkUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Link URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Custom display URL" value={field.value || ""} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={mediaForm.control}
                      name="caption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Caption (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Caption or description for this media" value={field.value || ""} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={mediaForm.control}
                      name="sortOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sort Order</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => mediaForm.reset()}>
                        Clear
                      </Button>
                      <Button type="submit" className="bg-brand-green text-white hover:bg-brand-green/90" disabled={addMediaMutation.isPending}>
                        {addMediaMutation.isPending ? 'Adding...' : 'Add Media'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="existing" className="space-y-4">
                {manageMediaCollection.media?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No media items found. Add your first media item using the "Add Media" tab.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manageMediaCollection.media?.map((media) => {
                      const MediaIcon = mediaTypes.find(t => t.value === media.type)?.icon || Images;
                      return (
                        <div key={media.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <MediaIcon className="h-4 w-4 text-gray-600" />
                              <Badge variant="outline" className="text-xs">
                                {mediaTypes.find(t => t.value === media.type)?.label || media.type}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">#{media.sortOrder}</div>
                          </div>
                          {media.title && (
                            <h4 className="font-medium text-sm">{media.title}</h4>
                          )}
                          {media.caption && (
                            <p className="text-xs text-gray-600">{media.caption}</p>
                          )}
                          <div className="text-xs text-gray-500 break-all">{media.url}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}