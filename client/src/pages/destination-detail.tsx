import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Calendar, DollarSign, Star, Activity, Clock, Navigation } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DestinationMap from "@/components/destinations/destination-map";
import RelatedContent from "@/components/destinations/related-content";
import SocialMediaDisplay from "@/components/social-media-display";
import DetailedSocialShare from "@/components/detailed-social-share";
import { Destination } from "@shared/schema";

export default function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: destination, isLoading, error } = useQuery<Destination>({
    queryKey: ["/api/destinations", slug],
    queryFn: async () => {
      const response = await fetch(`/api/destinations/${slug}`);
      if (!response.ok) {
        throw new Error('Destination not found');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 lg:py-24" data-testid="destination-loading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-brand-cream py-16 lg:py-24 flex items-center justify-center" data-testid="destination-error">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="font-playfair text-2xl font-bold text-brand-brown mb-4">
              Destination Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The destination you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/journey">
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Journey
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Moderate: "bg-yellow-100 text-yellow-800",
    Challenging: "bg-red-100 text-red-800"
  };

  const categoryColors = {
    "Trek Place": "bg-green-100 text-green-800",
    "Tourist Spot": "bg-blue-100 text-blue-800",
    "Beach": "bg-cyan-100 text-cyan-800",
    "Historical": "bg-amber-100 text-amber-800",
    "Cultural": "bg-purple-100 text-purple-800",
    "Adventure": "bg-orange-100 text-orange-800"
  };

  return (
    <div className="min-h-screen bg-brand-cream py-16 lg:py-24 destination-detail-page" data-testid="destination-page">
      <div className="max-w-6xl mx-auto px-6 page-content">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/journey">
            <Button variant="ghost" className="text-brand-brown hover:bg-brand-brown/10" data-testid="back-to-journey">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journey
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl" data-testid="destination-hero">
          <img
            src={destination.featuredImage}
            alt={destination.name}
            className="w-full h-96 lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Badge 
                className={`${categoryColors[destination.category as keyof typeof categoryColors]} text-sm`}
                data-testid="destination-category"
              >
                {destination.category}
              </Badge>
              <Badge 
                className={`${difficultyColors[destination.difficulty as keyof typeof difficultyColors]} text-sm`}
                data-testid="destination-difficulty"
              >
                {destination.difficulty}
              </Badge>
              {destination.isCurrentLocation && (
                <Badge className="bg-brand-orange text-white animate-pulse">
                  Current Location
                </Badge>
              )}
            </div>
            <h1 className="font-playfair text-3xl lg:text-5xl font-bold mb-2" data-testid="destination-title">
              {destination.name}
            </h1>
            <div className="flex items-center text-white/90">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{destination.state}, {destination.region}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card data-testid="destination-description">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl text-brand-brown">
                  About {destination.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {destination.description}
                </p>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: destination.detailedDescription.replace(/\n/g, '<br />') }}
                />
              </CardContent>
            </Card>

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <Card data-testid="destination-highlights">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-brand-brown">
                    Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {destination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-brand-orange flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activities */}
            {destination.activities && destination.activities.length > 0 && (
              <Card data-testid="destination-activities">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-brand-brown">
                    Activities & Experiences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {destination.activities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-brand-green flex-shrink-0" />
                        <span className="text-gray-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card data-testid="destination-quick-info">
              <CardHeader>
                <CardTitle className="font-playfair text-xl text-brand-brown">
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Best Time</div>
                    <div className="text-gray-600">{destination.bestTimeToVisit}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Budget Range</div>
                    <div className="text-gray-600">{destination.budgetRange}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Recommended Stay</div>
                    <div className="text-gray-600">{destination.recommendedStay}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Rating</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < destination.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-gray-600">({destination.rating}/5)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Map Component */}
            <DestinationMap destination={destination} />

            {/* Detailed Social Sharing */}
            <DetailedSocialShare
              title={destination.name}
              description={destination.description}
              url={window.location.href}
              hashtags={destination.socialMediaHashtags || []}
              type="destination"
              instagramUrl={destination.instagramPostUrl || undefined}
              youtubeUrl={destination.youtubeVideoUrl || undefined}
            />

            {/* Social Media Integration */}
            <SocialMediaDisplay
              data={{
                instagramPostUrl: destination.instagramPostUrl || undefined,
                twitterPostUrl: destination.twitterPostUrl || undefined,
                facebookPostUrl: destination.facebookPostUrl || undefined,
                youtubeVideoUrl: destination.youtubeVideoUrl || undefined,
                socialMediaHashtags: destination.socialMediaHashtags || undefined
              }}
              title="Follow this destination on social media"
              compact={false}
              showHashtags={true}
            />
          </div>
        </div>


        {/* Maps and Photos Section */}
        <div className="mt-12 space-y-6 mb-16">
          <RelatedContent destination={destination} />
        </div>
      </div>
    </div>
  );
}