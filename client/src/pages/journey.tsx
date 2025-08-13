import InteractiveMap from "@/components/journey/interactive-map";
import DestinationGrid from "@/components/destinations/destination-grid";
import { useJourney } from "@/hooks/use-journey";

export default function Journey() {
  const { data: journey } = useJourney();

  return (
    <div className="min-h-screen bg-brand-cream py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-testid="journey-header">
          <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6">
            Journey Through India
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the destinations that shaped this incredible journey. From snow-capped mountains to tropical coastlines, each place offers unique experiences and authentic insights.
          </p>
        </div>

        {/* Journey Map Overview */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg" data-testid="journey-map-overview">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-4 h-4 bg-brand-orange rounded-full animate-pulse"></div>
                <span className="font-semibold text-brand-brown" data-testid="current-location-status">
                  Currently in: {journey?.currentLocation || "Mysuru, Karnataka"}
                </span>
              </div>
              <p className="text-gray-600">Exploring the royal heritage and palace architecture</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-orange" data-testid="journey-completion">
                {journey?.journeyProgress || 65}%
              </div>
              <div className="text-sm text-gray-600">Journey Complete</div>
            </div>
          </div>
          
          <InteractiveMap height="400px" />
        </div>

        {/* Destinations Section */}
        <div data-testid="destinations-section">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-2xl lg:text-4xl font-bold text-brand-brown mb-4">
              Explore Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each destination offers its own unique character, challenges, and rewards. Filter by category, region, or search for specific places.
            </p>
          </div>

          <DestinationGrid />
        </div>
      </div>
    </div>
  );
}
