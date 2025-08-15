import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertTravelPinSchema, type TravelPin, type InsertTravelPin } from "@shared/schema";
import { z } from "zod";
import SocialMediaIntegration from "@/components/social-media-integration";

const travelPinFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  visitedDate: z.string().optional(),
  pinType: z.enum(['visited', 'current', 'planned', 'favorite']),
  pinColor: z.string(),
  images: z.array(z.string()),
  tags: z.array(z.string()),
  rating: z.number().int().min(0).max(5),
  notes: z.string().optional(),
  isVisible: z.boolean(),
  instagramPostUrl: z.string().optional(),
  twitterPostUrl: z.string().optional(),
  facebookPostUrl: z.string().optional(),
  youtubeVideoUrl: z.string().optional(),
  socialMediaHashtags: z.array(z.string()),
});

export default function TravelPinsManager() {
  const [editingPin, setEditingPin] = useState<TravelPin | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pins, isLoading } = useQuery<TravelPin[]>({
    queryKey: ['/api/travel-pins'],
  });

  const form = useForm<z.infer<typeof travelPinFormSchema>>({
    resolver: zodResolver(travelPinFormSchema),
    defaultValues: {
      name: "",
      description: "",
      country: "",
      city: "",
      coordinates: { lat: 0, lng: 0 },
      pinType: "visited",
      pinColor: "#E07A3E",
      images: [],
      tags: [],
      rating: 0,
      notes: "",
      isVisible: true,
      instagramPostUrl: "",
      twitterPostUrl: "",
      facebookPostUrl: "",
      youtubeVideoUrl: "",
      socialMediaHashtags: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTravelPin) => {
      return apiRequest('POST', '/api/travel-pins', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel-pins'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Travel pin created successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Create pin error:', error);
      toast({
        title: "Error",
        description: "Failed to create travel pin. Please check all fields.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<InsertTravelPin> }) => {
      return apiRequest('PUT', `/api/travel-pins/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel-pins'] });
      setEditingPin(null);
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Travel pin updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Update pin error:', error);
      toast({
        title: "Error",
        description: "Failed to update travel pin. Please check all fields.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/travel-pins/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel-pins'] });
      toast({
        title: "Success",
        description: "Travel pin deleted successfully!",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string, isVisible: boolean }) => {
      return apiRequest('PUT', `/api/travel-pins/${id}`, { isVisible: !isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel-pins'] });
    },
  });

  const onSubmit = (data: z.infer<typeof travelPinFormSchema>) => {
    console.log('Form submission data:', data); // Debug log

    // Validate coordinates to prevent NaN values
    if (isNaN(data.coordinates.lat) || isNaN(data.coordinates.lng)) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude and longitude values.",
        variant: "destructive",
      });
      return;
    }

    // Transform data to match the backend schema - only include defined values
    const pinData: any = {
      name: data.name,
      country: data.country,
      coordinates: {
        lat: data.coordinates.lat,
        lng: data.coordinates.lng
      },
      pinType: data.pinType,
      pinColor: data.pinColor,
      images: data.images || [],
      tags: data.tags || [],
      isVisible: data.isVisible
    };

    // Only add optional fields if they have values
    if (data.description && data.description.trim() !== "") {
      pinData.description = data.description;
    }
    if (data.city && data.city.trim() !== "") {
      pinData.city = data.city;
    }
    if (data.visitedDate && data.visitedDate !== "") {
      pinData.visitedDate = data.visitedDate; // Send as string, backend will convert
    }
    if (data.rating && data.rating > 0) {
      pinData.rating = data.rating;
    }
    if (data.notes && data.notes.trim() !== "") {
      pinData.notes = data.notes;
    }
    if (data.instagramPostUrl && data.instagramPostUrl.trim() !== "") {
      pinData.instagramPostUrl = data.instagramPostUrl;
    }
    if (data.twitterPostUrl && data.twitterPostUrl.trim() !== "") {
      pinData.twitterPostUrl = data.twitterPostUrl;
    }
    if (data.facebookPostUrl && data.facebookPostUrl.trim() !== "") {
      pinData.facebookPostUrl = data.facebookPostUrl;
    }
    if (data.youtubeVideoUrl && data.youtubeVideoUrl.trim() !== "") {
      pinData.youtubeVideoUrl = data.youtubeVideoUrl;
    }
    if (data.socialMediaHashtags && data.socialMediaHashtags.length > 0) {
      pinData.socialMediaHashtags = data.socialMediaHashtags;
    }

    console.log('Transformed pin data:', pinData); // Debug log

    if (editingPin) {
      updateMutation.mutate({ id: editingPin.id, data: pinData });
    } else {
      createMutation.mutate(pinData);
    }
  };

  const handleEdit = (pin: TravelPin) => {
    setEditingPin(pin);
    form.reset({
      name: pin.name,
      description: pin.description || "",
      country: pin.country,
      city: pin.city || "",
      coordinates: pin.coordinates,
      pinType: pin.pinType,
      pinColor: pin.pinColor,
      images: pin.images || [],
      tags: pin.tags || [],
      rating: pin.rating || 0,
      notes: pin.notes || "",
      isVisible: pin.isVisible,
      visitedDate: pin.visitedDate ? new Date(pin.visitedDate).toISOString().split('T')[0] : "",
      instagramPostUrl: pin.instagramPostUrl || "",
      twitterPostUrl: pin.twitterPostUrl || "",
      facebookPostUrl: pin.facebookPostUrl || "",
      youtubeVideoUrl: pin.youtubeVideoUrl || "",
      socialMediaHashtags: pin.socialMediaHashtags || [],
    });
    setIsDialogOpen(true);
  };

  const getPinTypeIcon = (type: string) => {
    switch (type) {
      case 'current': return '📍';
      case 'planned': return '📌';
      case 'favorite': return '❤️';
      default: return '🌍';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return <div>Loading travel pins...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-brown">Travel Pins</h2>
          <p className="text-gray-600">Manage your travel destinations and pins on the map</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Travel Pin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPin ? 'Edit Travel Pin' : 'Add New Travel Pin'}
              </DialogTitle>
              <DialogDescription>
                Add your travel destinations with location details, photos, and social media integration.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Eiffel Tower, Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Paris" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="visitedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visit Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your experience..." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="coordinates.lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any" 
                            placeholder="e.g., 48.8584"
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                field.onChange(0);
                                return;
                              }
                              const parsedValue = parseFloat(value);
                              field.onChange(isNaN(parsedValue) ? 0 : parsedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coordinates.lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any" 
                            placeholder="e.g., 2.2945"
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                field.onChange(0);
                                return;
                              }
                              const parsedValue = parseFloat(value);
                              field.onChange(isNaN(parsedValue) ? 0 : parsedValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="pinType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pin Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="visited">🌍 Visited</SelectItem>
                            <SelectItem value="current">📍 Current</SelectItem>
                            <SelectItem value="planned">📌 Planned</SelectItem>
                            <SelectItem value="favorite">❤️ Favorite</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <Select onValueChange={(value) => {
                          const parsedValue = parseInt(value);
                          field.onChange(isNaN(parsedValue) ? 0 : parsedValue);
                        }} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Rate 1-5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">No Rating</SelectItem>
                            <SelectItem value="1">⭐ (1 star)</SelectItem>
                            <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                            <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                            <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                            <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pinColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pin Color</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your personal memories and notes..." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Social Media Integration */}
                <div className="space-y-4">
                  <SocialMediaIntegration
                    data={{
                      instagramPostUrl: form.watch('instagramPostUrl'),
                      twitterPostUrl: form.watch('twitterPostUrl'), 
                      facebookPostUrl: form.watch('facebookPostUrl'),
                      youtubeVideoUrl: form.watch('youtubeVideoUrl'),
                      socialMediaHashtags: form.watch('socialMediaHashtags')
                    }}
                    onUpdate={(data) => {
                      if (data.instagramPostUrl !== undefined) form.setValue('instagramPostUrl', data.instagramPostUrl);
                      if (data.twitterPostUrl !== undefined) form.setValue('twitterPostUrl', data.twitterPostUrl);
                      if (data.facebookPostUrl !== undefined) form.setValue('facebookPostUrl', data.facebookPostUrl);
                      if (data.youtubeVideoUrl !== undefined) form.setValue('youtubeVideoUrl', data.youtubeVideoUrl);
                      if (data.socialMediaHashtags !== undefined) form.setValue('socialMediaHashtags', data.socialMediaHashtags);
                    }}
                    title={form.watch('name') || 'Travel Pin'}
                    description={form.watch('description') || ''}
                    type="travel-pin"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingPin(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-brand-orange text-white hover:bg-brand-orange/90"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingPin ? 'Update Pin' : 'Create Pin'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pins?.map((pin) => (
          <Card key={pin.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getPinTypeIcon(pin.pinType)}</span>
                  <div>
                    <CardTitle className="text-lg">{pin.name}</CardTitle>
                    <p className="text-sm text-gray-600">{pin.city ? `${pin.city}, ` : ''}{pin.country}</p>
                  </div>
                </div>
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: pin.pinColor }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pin.description && (
                <p className="text-sm text-gray-700 line-clamp-2">{pin.description}</p>
              )}
              
              {pin.rating && pin.rating > 0 && (
                <div className="flex items-center space-x-1">
                  {renderStars(pin.rating)}
                  <span className="text-sm text-gray-600">({pin.rating}/5)</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Badge variant={pin.pinType === 'current' ? 'default' : 'secondary'}>
                  {pin.pinType}
                </Badge>
                {pin.visitedDate && (
                  <span className="text-xs text-gray-500">
                    {new Date(pin.visitedDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(pin)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleVisibilityMutation.mutate({ id: pin.id, isVisible: pin.isVisible })}
                  >
                    {pin.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://maps.google.com/?q=${pin.coordinates.lat},${pin.coordinates.lng}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteMutation.mutate(pin.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pins?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No travel pins yet</h3>
            <p className="text-gray-500 mb-4">Start adding places you've visited or plan to visit!</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-brand-orange text-white hover:bg-brand-orange/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Pin
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}