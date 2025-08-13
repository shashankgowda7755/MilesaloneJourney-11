import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { journeyWaypoints, getMarkerIcon } from "@/lib/map-utils";
import type { JourneyWaypoint } from "@/types";

interface InteractiveMapProps {
  height?: string;
  showRoute?: boolean;
}

export default function InteractiveMap({ height = "500px", showRoute = true }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each waypoint
    journeyWaypoints.forEach((waypoint: JourneyWaypoint) => {
      const iconConfig = getMarkerIcon(waypoint);
      const icon = L.divIcon(iconConfig);

      const marker = L.marker([waypoint.lat, waypoint.lng], { icon })
        .bindPopup(`
          <div class="p-2">
            <strong class="text-brand-brown">${waypoint.name}</strong><br>
            <span class="text-sm text-gray-600">Status: ${waypoint.status}</span><br>
            ${waypoint.description ? `<span class="text-sm">${waypoint.description}</span>` : ''}
          </div>
        `)
        .addTo(map);
    });

    // Draw route line if enabled
    if (showRoute) {
      const routeCoords = journeyWaypoints.map(waypoint => [waypoint.lat, waypoint.lng] as [number, number]);
      L.polyline(routeCoords, {
        color: '#E07A3E',
        weight: 3,
        opacity: 0.8
      }).addTo(map);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showRoute]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }} 
      className="rounded-2xl shadow-lg"
      data-testid="interactive-map"
    />
  );
}
