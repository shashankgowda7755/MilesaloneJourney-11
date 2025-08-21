import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TravelPin } from "@shared/schema";

interface InteractiveMapProps {
  height?: string;
  showPins?: boolean;
}

export default function InteractiveMap({ height = "500px", showPins = true }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const { data: travelPins } = useQuery<TravelPin[]>({
    queryKey: ['/api/travel-pins'],
  });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map - centered on India
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add travel pins if data is available and showPins is true
    if (showPins && travelPins) {
      travelPins.forEach((pin: TravelPin) => {
        // Create custom icon based on pin type and color
        const icon = L.divIcon({
          className: 'custom-pin-marker',
          html: `
            <div style="
              background-color: ${pin.pinColor};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: white;
              position: relative;
            ">
              ${getPinIcon(pin.pinType)}
              <div style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 8px solid ${pin.pinColor};
              "></div>
            </div>
          `,
          iconSize: [20, 28],
          iconAnchor: [10, 28],
          popupAnchor: [0, -28]
        });

        const marker = L.marker([pin.coordinates.lat, pin.coordinates.lng], { icon })
          .bindPopup(`
            <div class="p-3 min-w-[200px]">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-3 h-3 rounded-full" style="background-color: ${pin.pinColor}"></div>
                <strong class="text-brand-brown text-lg">${pin.name}</strong>
              </div>
              ${pin.city ? `<p class="text-sm text-gray-600 mb-1">${pin.city}, ${pin.country}</p>` : `<p class="text-sm text-gray-600 mb-1">${pin.country}</p>`}
              ${pin.description ? `<p class="text-sm text-gray-700 mb-2">${pin.description}</p>` : ''}
              ${pin.rating && pin.rating > 0 ? `
                <div class="flex items-center space-x-1 mb-2">
                  ${Array.from({ length: 5 }, (_, i) => 
                    `<span class="text-yellow-400">${i < (pin.rating || 0) ? '★' : '☆'}</span>`
                  ).join('')}
                  <span class="text-xs text-gray-500">(${pin.rating}/5)</span>
                </div>
              ` : ''}
              <div class="flex items-center justify-between">
                <span class="inline-block px-2 py-1 text-xs rounded-full" style="
                  background-color: ${pin.pinColor}20;
                  color: ${pin.pinColor};
                  border: 1px solid ${pin.pinColor}40;
                ">${getPinTypeLabel(pin.pinType)}</span>
                ${pin.visitedDate ? `
                  <span class="text-xs text-gray-500">
                    ${new Date(pin.visitedDate).toLocaleDateString()}
                  </span>
                ` : ''}
              </div>
              ${pin.notes ? `<p class="text-xs text-gray-600 mt-2 italic">${pin.notes}</p>` : ''}
            </div>
          `)
          .addTo(map);
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showPins, travelPins]);

  const getPinIcon = (pinType: string) => {
    switch (pinType) {
      case 'current': return '📍';
      case 'planned': return '📌';
      case 'favorite': return '❤️';
      default: return '🌍';
    }
  };

  const getPinTypeLabel = (pinType: string) => {
    switch (pinType) {
      case 'current': return 'Current Location';
      case 'planned': return 'Planned';
      case 'favorite': return 'Favorite';
      default: return 'Visited';
    }
  };

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }} 
      className="rounded-2xl shadow-lg"
      data-testid="interactive-map"
    />
  );
}
