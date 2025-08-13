import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Destination } from "@shared/schema";

interface DestinationMapProps {
  destination: Destination;
}

export default function DestinationMap({ destination }: DestinationMapProps) {
  const handleOpenInMaps = () => {
    const { lat, lng } = destination.coordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const handleGetDirections = () => {
    const { lat, lng } = destination.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <Card className="mb-8" data-testid="destination-map">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-brand-orange" />
          <span>Location & Navigation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map placeholder - In production this would be a real map */}
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Interactive Map</p>
              <p className="text-xs">Coordinates: {destination.coordinates.lat}, {destination.coordinates.lng}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleOpenInMaps}
              className="bg-brand-orange text-white hover:bg-brand-orange/90"
              data-testid="open-maps-button"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View in Maps
            </Button>
            <Button
              onClick={handleGetDirections}
              variant="outline"
              className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
              data-testid="get-directions-button"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Region:</strong> {destination.region}</p>
            <p><strong>State:</strong> {destination.state}</p>
            <p><strong>Accessibility:</strong> {destination.difficulty} terrain</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}