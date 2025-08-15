import { useState } from "react";
import { X, Star, Calendar, Clock, MapPin, DollarSign, Activity, Navigation, Mountain, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DetailedSocialShare from "@/components/detailed-social-share";
import type { Destination } from "@shared/schema";

interface DestinationDetailDialogProps {
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  "Mountain Destination": "bg-blue-500 text-white",
  "Historical Site": "bg-purple-500 text-white",
  "Beach Location": "bg-cyan-500 text-white",
  "Cultural Hub": "bg-green-500 text-white",
  "Natural Wonder": "bg-teal-500 text-white",
  "Coastal Destination": "bg-blue-400 text-white",
};

const difficultyColors: Record<string, string> = {
  "Easy": "bg-green-100 text-green-800",
  "Moderate": "bg-yellow-100 text-yellow-800",
  "Challenging": "bg-red-100 text-red-800",
};

export default function DestinationDetailDialog({ destination, isOpen, onClose }: DestinationDetailDialogProps) {
  const handleOpenInMaps = () => {
    const { lat, lng } = destination.coordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="destination-detail-dialog">
        <DialogTitle className="sr-only">{destination.name} - Destination Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {destination.name} including description, activities, and travel information.
        </DialogDescription>
        
        {/* Header Image */}
        <div className="relative -m-6 mb-6">
          <img
            src={destination.featuredImage}
            alt={destination.name}
            className="w-full h-64 object-cover"
            data-testid="destination-dialog-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="font-playfair text-3xl font-bold mb-2" data-testid="destination-dialog-title">
              {destination.name}
            </h1>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{destination.state}, {destination.region}</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <Badge 
              className={categoryColors[destination.category] || "bg-gray-500 text-white"}
              data-testid="destination-dialog-category"
            >
              {destination.category}
            </Badge>
            {destination.isCurrentLocation && (
              <Badge className="bg-brand-orange text-white" data-testid="destination-dialog-current">
                Current Location
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Rating and Quick Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1" data-testid="destination-dialog-rating">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{(destination.rating / 10).toFixed(1)}</span>
              <span className="text-gray-500">/ 5.0</span>
            </div>
            <Badge 
              className={difficultyColors[destination.difficulty] || "bg-gray-100 text-gray-800"}
              data-testid="destination-dialog-difficulty"
            >
              {destination.difficulty}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-600 leading-relaxed" data-testid="destination-dialog-description">
              {destination.detailedDescription}
            </p>
          </div>

          <Separator />

          {/* Travel Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-playfair text-lg font-semibold text-brand-brown">Travel Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3" data-testid="destination-dialog-best-time">
                  <Calendar className="w-5 h-5 text-brand-orange" />
                  <div>
                    <div className="font-medium">Best Time to Visit</div>
                    <div className="text-sm text-gray-600">{destination.bestTimeToVisit}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3" data-testid="destination-dialog-duration">
                  <Clock className="w-5 h-5 text-brand-orange" />
                  <div>
                    <div className="font-medium">Recommended Stay</div>
                    <div className="text-sm text-gray-600">{destination.recommendedStay}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3" data-testid="destination-dialog-budget">
                  <DollarSign className="w-5 h-5 text-brand-orange" />
                  <div>
                    <div className="font-medium">Budget Range</div>
                    <div className="text-sm text-gray-600">{destination.budgetRange}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-playfair text-lg font-semibold text-brand-brown">Activities</h3>
              <div className="flex flex-wrap gap-2" data-testid="destination-dialog-activities">
                {destination.activities.map((activity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Highlights */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-brand-brown mb-3">Highlights</h3>
            <ul className="space-y-2" data-testid="destination-dialog-highlights">
              {destination.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Mountain className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleOpenInMaps}
              className="flex-1 bg-brand-orange text-white hover:bg-brand-orange/90"
              data-testid="destination-dialog-maps-button"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Open in Maps
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              data-testid="destination-dialog-gallery-button"
            >
              <Camera className="w-4 h-4 mr-2" />
              View Gallery
            </Button>
          </div>

          <Separator />

          {/* Detailed Social Sharing */}
          <div className="pt-4">
            <DetailedSocialShare
              title={destination.name}
              description={destination.description}
              url={`${window.location.origin}/journey/${destination.slug}`}
              hashtags={destination.socialMediaHashtags || []}
              type="destination"
              instagramUrl={destination.instagramPostUrl || undefined}
              youtubeUrl={destination.youtubeVideoUrl || undefined}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}