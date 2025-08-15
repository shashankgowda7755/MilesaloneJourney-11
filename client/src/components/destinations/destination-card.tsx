import { useState } from "react";
import { Star, Calendar, Clock, MapPin, Images, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DestinationDetailDialog from "./destination-detail-dialog";
import SocialMediaDisplay from "@/components/social-media-display";
import DestinationCardShare from "./destination-card-share";
import type { Destination } from "@shared/schema";

interface DestinationCardProps {
  destination: Destination;
}

const categoryColors: Record<string, string> = {
  "Mountain Destination": "bg-blue-500 text-white",
  "Historical Site": "bg-purple-500 text-white",
  "Beach Location": "bg-cyan-500 text-white",
  "Cultural Hub": "bg-green-500 text-white",
  "Natural Wonder": "bg-teal-500 text-white",
  "Coastal Destination": "bg-blue-400 text-white",
};

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = () => {
    setIsDialogOpen(true);
  };

  const handleOpenMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { lat, lng } = destination.coordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const handleViewGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to gallery page or show gallery for this destination
    window.open('/gallery', '_blank');
  };

  return (
    <>
      <Card 
        className="overflow-hidden shadow-lg card-hover bg-white cursor-pointer" 
        data-testid={`destination-card-${destination.slug}`}
        onClick={handleViewDetails}
      >
        <div className="relative h-56">
          <img
            src={destination.featuredImage}
            alt={destination.name}
            className="w-full h-full object-cover"
            data-testid="destination-card-image"
          />
          <div className="absolute top-4 left-4">
            <Badge 
              className={categoryColors[destination.category] || "bg-gray-500 text-white"}
              data-testid="destination-card-category"
            >
              {destination.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-full px-2 py-1" data-testid="destination-card-rating">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{(destination.rating / 10).toFixed(1)}</span>
            </div>
          </div>
          {destination.isCurrentLocation && (
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-brand-orange text-white" data-testid="current-location-badge">
                <MapPin className="w-3 h-3 mr-1" />
                Current Location
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-playfair text-xl font-bold text-brand-brown" data-testid="destination-card-title">
              {destination.name}
            </h3>
            <span className="text-sm text-gray-500" data-testid="destination-card-region">
              {destination.region}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4" data-testid="destination-card-description">
            {destination.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600" data-testid="destination-card-best-time">
              <Calendar className="w-4 h-4 mr-2" />
              Best time: {destination.bestTimeToVisit}
            </div>
            <div className="flex items-center text-sm text-gray-600" data-testid="destination-card-duration">
              <Clock className="w-4 h-4 mr-2" />
              Recommended stay: {destination.recommendedStay}
            </div>
            <div className="flex items-center text-sm text-gray-600" data-testid="destination-card-budget">
              <span className="mr-2">₹</span>
              Budget range: {destination.budgetRange}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4" data-testid="destination-card-highlights">
            {destination.highlights.slice(0, 3).map((highlight, index) => (
              <Badge key={index} variant="secondary" className="bg-brand-cream text-brand-brown">
                {highlight}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button 
              className="bg-brand-orange text-white hover:bg-brand-orange/90"
              size="sm"
              data-testid="destination-card-view-guide"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Guide
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
              data-testid="destination-card-open-map"
              onClick={handleOpenMap}
            >
              <Navigation className="w-4 h-4 mr-1" />
              Map
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
              data-testid="destination-card-view-gallery"
              onClick={handleViewGallery}
            >
              <Images className="w-4 h-4 mr-1" />
              Photos
            </Button>
          </div>
          
          {/* Action Row with Share */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-brand-orange">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">View Destination</span>
            </div>
            <DestinationCardShare destination={destination} />
          </div>

          {/* Social Media Sharing */}
          <div onClick={(e) => e.stopPropagation()}>
            <SocialMediaDisplay
              data={{
                instagramPostUrl: destination.instagramPostUrl || undefined,
                twitterPostUrl: destination.twitterPostUrl || undefined,
                facebookPostUrl: destination.facebookPostUrl || undefined,
                youtubeVideoUrl: destination.youtubeVideoUrl || undefined,
                socialMediaHashtags: destination.socialMediaHashtags || undefined
              }}
              compact={true}
              showHashtags={true}
            />
          </div>
        </CardContent>
      </Card>

      <DestinationDetailDialog
        destination={destination}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
