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
          {/* Interactive Map Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 flex items-center justify-center border border-brand-orange/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent),radial-gradient(circle_at_70%_30%,rgba(34,197,94,0.1),transparent)]"></div>
            <div className="text-center text-brand-brown relative z-10">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-brand-orange" />
              <p className="text-lg font-semibold mb-1">Location Preview</p>
              <p className="text-sm text-gray-600 mb-2">{destination.name}</p>
              <p className="text-xs text-gray-500">Coordinates: {destination.coordinates.lat}, {destination.coordinates.lng}</p>
              <p className="text-xs text-brand-orange mt-2 font-medium">Click "View in Maps" for interactive navigation</p>
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