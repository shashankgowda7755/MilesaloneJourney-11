import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Camera, FileText, Map, Edit2, ExternalLink } from "lucide-react";
import type { BlogPost, Destination, GalleryCollectionWithMedia } from "@shared/schema";

interface AdminDashboardProps {
  onNewPost?: () => void;
  onAddDestination?: () => void;
  onUploadPhotos?: () => void;
  onUpdateLocation?: () => void;
  onEditPost?: (post: BlogPost) => void;
  onEditDestination?: (destination: Destination) => void;
  onEditGallery?: (collection: GalleryCollectionWithMedia) => void;
}

export default function AdminDashboard({ 
  onNewPost, 
  onAddDestination, 
  onUploadPhotos, 
  onUpdateLocation, 
  onEditPost, 
  onEditDestination, 
  onEditGallery 
}: AdminDashboardProps) {
  // Fetch recent data for activity items
  const { data: blogPosts } = useQuery<BlogPost[]>({ queryKey: ['/api/blog-posts'] });
  const { data: destinations } = useQuery<Destination[]>({ queryKey: ['/api/destinations'] });
  const { data: collections } = useQuery<GalleryCollectionWithMedia[]>({ queryKey: ['/api/gallery'] });

  // Get most recent items
  const latestPost = blogPosts?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const latestDestination = destinations?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  const currentLocation = destinations?.find(d => d.isCurrentLocation);
  const latestCollection = collections?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const handleEditActivity = (type: 'post' | 'destination' | 'location' | 'gallery') => {
    switch (type) {
      case 'post':
        if (latestPost && onEditPost) onEditPost(latestPost);
        break;
      case 'destination':
        if (latestDestination && onEditDestination) onEditDestination(latestDestination);
        break;
      case 'location':
        if (currentLocation && onEditDestination) onEditDestination(currentLocation);
        break;
      case 'gallery':
        if (latestCollection && onEditGallery) onEditGallery(latestCollection);
        break;
    }
  };

  const handleViewActivity = (type: 'post' | 'destination' | 'location' | 'gallery') => {
    switch (type) {
      case 'post':
        if (latestPost) window.open(`/blog/${latestPost.slug}`, '_blank');
        break;
      case 'destination':
        if (latestDestination) window.open(`/destinations/${latestDestination.slug}`, '_blank');
        break;
      case 'location':
        if (currentLocation) window.open(`/destinations/${currentLocation.slug}`, '_blank');
        break;
      case 'gallery':
        if (latestCollection) window.open(`/gallery`, '_blank');
        break;
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-testid="admin-dashboard">
      <div className="lg:col-span-2">
        <Card className="bg-white p-6 shadow-sm">
          <h3 className="font-playfair text-xl font-bold text-brand-brown mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="bg-brand-orange text-white p-6 rounded-xl font-medium hover:bg-brand-orange/90 h-auto flex-col space-y-2"
              onClick={onNewPost}
            >
              <Plus className="h-6 w-6" />
              <div>New Post</div>
            </Button>
            
            <Button 
              className="bg-brand-green text-white p-6 rounded-xl font-medium hover:bg-brand-green/90 h-auto flex-col space-y-2"
              onClick={onAddDestination}
            >
              <Map className="h-6 w-6" />
              <div>Add Destination</div>
            </Button>
            
            <Button 
              className="bg-blue-500 text-white p-6 rounded-xl font-medium hover:bg-blue-500/90 h-auto flex-col space-y-2"
              onClick={onUploadPhotos}
            >
              <Camera className="h-6 w-6" />
              <div>Upload Photos</div>
            </Button>
            
            <Button 
              className="bg-purple-500 text-white p-6 rounded-xl font-medium hover:bg-purple-500/90 h-auto flex-col space-y-2"
              onClick={onUpdateLocation}
            >
              <MapPin className="h-6 w-6" />
              <div>Update Location</div>
            </Button>
          </div>
        </Card>
      </div>
      
      <div>
        <Card className="bg-white p-6 shadow-sm">
          <h3 className="font-playfair text-xl font-bold text-brand-brown mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Latest Blog Post */}
            <div className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg -m-2 transition-colors">
              <div className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm flex-1">
                <p className="font-medium text-brand-brown">
                  {latestPost ? `Blog post: "${latestPost.title}"` : 'New blog post published'}
                </p>
                <p className="text-gray-500">
                  {latestPost ? new Date(latestPost.createdAt).toLocaleDateString() : '2 hours ago'}
                </p>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewActivity('post')}
                  className="h-8 w-8 p-0"
                  title="View post"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditActivity('post')}
                  className="h-8 w-8 p-0"
                  title="Edit post"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Current Location */}
            <div className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg -m-2 transition-colors">
              <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm flex-1">
                <p className="font-medium text-brand-brown">
                  {currentLocation ? `Location: ${currentLocation.name}` : 'Location updated to Mysuru'}
                </p>
                <p className="text-gray-500">
                  {currentLocation ? new Date(currentLocation.updatedAt).toLocaleDateString() : '1 day ago'}
                </p>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewActivity('location')}
                  className="h-8 w-8 p-0"
                  title="View location"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditActivity('location')}
                  className="h-8 w-8 p-0"
                  title="Edit location"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Latest Gallery Collection */}
            <div className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg -m-2 transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm flex-1">
                <p className="font-medium text-brand-brown">
                  {latestCollection ? `Gallery: "${latestCollection.title}"` : 'Gallery collection added'}
                </p>
                <p className="text-gray-500">
                  {latestCollection ? new Date(latestCollection.createdAt).toLocaleDateString() : '3 days ago'}
                </p>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewActivity('gallery')}
                  className="h-8 w-8 p-0"
                  title="View gallery"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditActivity('gallery')}
                  className="h-8 w-8 p-0"
                  title="Edit gallery"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Latest Destination */}
            <div className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg -m-2 transition-colors">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm flex-1">
                <p className="font-medium text-brand-brown">
                  {latestDestination ? `Destination: "${latestDestination.name}"` : 'New destination guide created'}
                </p>
                <p className="text-gray-500">
                  {latestDestination ? new Date(latestDestination.createdAt).toLocaleDateString() : '5 days ago'}
                </p>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewActivity('destination')}
                  className="h-8 w-8 p-0"
                  title="View destination"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditActivity('destination')}
                  className="h-8 w-8 p-0"
                  title="Edit destination"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
