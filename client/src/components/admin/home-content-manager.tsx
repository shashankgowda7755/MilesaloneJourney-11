import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { insertHomePageContentSchema, type HomePageContent, type InsertHomePageContent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function HomeContentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current home page content
  const { data: homeContent, isLoading } = useQuery<HomePageContent>({
    queryKey: ["/api/home-content"],
  });

  const form = useForm<InsertHomePageContent>({
    resolver: zodResolver(insertHomePageContentSchema),
    defaultValues: homeContent || {
      heroTitle: "Raw Roads,\nReal Discovery",
      heroSubtitle: "Join Shashank's authentic 4-month journey across India, from Kashmir's valleys to Kanyakumari's shores, on just ₹500 per day",
      heroBackgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      exploreButtonText: "Explore Journey",
      diariesButtonText: "Read Diaries",
      dailyBudget: "₹500",
      mapSectionTitle: "Live Journey Tracker",
      mapSectionDescription: "Follow the real-time progress from the serene valleys of Kashmir to the southern tip of Kanyakumari. Each pin tells a story of discovery, challenge, and authentic Indian experiences.",
      storiesSectionTitle: "Latest Travel Stories",
      storiesSectionDescription: "Authentic stories from the road - the struggles, discoveries, and unexpected connections that make solo travel transformative.",
      guidesSectionTitle: "Travel Guides",
      guidesSectionDescription: "Comprehensive guides to the most incredible destinations on this journey. From planning to experiencing, get insider tips for authentic travel.",
      gallerySectionTitle: "Visual Journey",
      gallerySectionDescription: "Every photograph tells a story of discovery, challenge, and the incredible diversity of landscapes, cultures, and moments that define authentic India travel.",
      newsletterTitle: "Join the Journey",
      newsletterDescription: "Get weekly updates about new destinations, travel stories, and behind-the-scenes insights from the road. No spam, just authentic travel content.",
      newsletterSubscribersCount: 342,
      weeklyStoriesCount: 24,
      readRate: 95,
      journeyStartDate: "August 1, 2025",
      journeyStartLocation: "Srinagar, Kashmir",
      journeyStartDescription: "Dal Lake houseboats and mountain serenity",
      finalDestination: "Kanyakumari, Tamil Nadu",
      finalDestinationDescription: "Land's end where three seas meet",
    },
  });

  // Update form values when data loads
  useState(() => {
    if (homeContent) {
      Object.keys(homeContent).forEach((key) => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
          form.setValue(key as keyof InsertHomePageContent, homeContent[key as keyof HomePageContent] as any);
        }
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsertHomePageContent>) =>
      apiRequest("PUT", "/api/home-content", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-content"] });
      toast({
        title: "Success",
        description: "Home page content updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update home page content",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertHomePageContent) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading home page content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Home Page Content</h2>
          <p className="text-gray-600">Edit all content displayed on the home page</p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={updateMutation.isPending}
          className="bg-brand-orange hover:bg-brand-orange/90"
          data-testid="save-home-content-button"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="sections">Section Titles</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="journey">Journey Info</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Textarea
                    id="heroTitle"
                    {...form.register("heroTitle")}
                    placeholder="Main hero title"
                    rows={3}
                    data-testid="input-hero-title"
                  />
                  <p className="text-sm text-gray-500">Use \n for line breaks</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    {...form.register("heroSubtitle")}
                    placeholder="Hero subtitle description"
                    rows={3}
                    data-testid="input-hero-subtitle"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroBackgroundImage">Background Image URL</Label>
                  <Input
                    id="heroBackgroundImage"
                    {...form.register("heroBackgroundImage")}
                    placeholder="https://..."
                    data-testid="input-hero-background"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exploreButtonText">Explore Button Text</Label>
                    <Input
                      id="exploreButtonText"
                      {...form.register("exploreButtonText")}
                      placeholder="Explore Journey"
                      data-testid="input-explore-button"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diariesButtonText">Diaries Button Text</Label>
                    <Input
                      id="diariesButtonText"
                      {...form.register("diariesButtonText")}
                      placeholder="Read Diaries"
                      data-testid="input-diaries-button"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyBudget">Daily Budget Text</Label>
                    <Input
                      id="dailyBudget"
                      {...form.register("dailyBudget")}
                      placeholder="₹500"
                      data-testid="input-daily-budget"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Section Titles & Descriptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Map Section</h4>
                  <div className="space-y-2">
                    <Label htmlFor="mapSectionTitle">Title</Label>
                    <Input
                      id="mapSectionTitle"
                      {...form.register("mapSectionTitle")}
                      data-testid="input-map-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mapSectionDescription">Description</Label>
                    <Textarea
                      id="mapSectionDescription"
                      {...form.register("mapSectionDescription")}
                      rows={3}
                      data-testid="input-map-description"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Stories Section</h4>
                  <div className="space-y-2">
                    <Label htmlFor="storiesSectionTitle">Title</Label>
                    <Input
                      id="storiesSectionTitle"
                      {...form.register("storiesSectionTitle")}
                      data-testid="input-stories-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storiesSectionDescription">Description</Label>
                    <Textarea
                      id="storiesSectionDescription"
                      {...form.register("storiesSectionDescription")}
                      rows={3}
                      data-testid="input-stories-description"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Guides Section</h4>
                  <div className="space-y-2">
                    <Label htmlFor="guidesSectionTitle">Title</Label>
                    <Input
                      id="guidesSectionTitle"
                      {...form.register("guidesSectionTitle")}
                      data-testid="input-guides-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guidesSectionDescription">Description</Label>
                    <Textarea
                      id="guidesSectionDescription"
                      {...form.register("guidesSectionDescription")}
                      rows={3}
                      data-testid="input-guides-description"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Gallery Section</h4>
                  <div className="space-y-2">
                    <Label htmlFor="gallerySectionTitle">Title</Label>
                    <Input
                      id="gallerySectionTitle"
                      {...form.register("gallerySectionTitle")}
                      data-testid="input-gallery-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gallerySectionDescription">Description</Label>
                    <Textarea
                      id="gallerySectionDescription"
                      {...form.register("gallerySectionDescription")}
                      rows={3}
                      data-testid="input-gallery-description"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newsletterTitle">Newsletter Title</Label>
                  <Input
                    id="newsletterTitle"
                    {...form.register("newsletterTitle")}
                    data-testid="input-newsletter-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newsletterDescription">Newsletter Description</Label>
                  <Textarea
                    id="newsletterDescription"
                    {...form.register("newsletterDescription")}
                    rows={3}
                    data-testid="input-newsletter-description"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journey" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Journey Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="journeyStartDate">Journey Start Date</Label>
                    <Input
                      id="journeyStartDate"
                      {...form.register("journeyStartDate")}
                      data-testid="input-journey-start-date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="journeyStartLocation">Journey Start Location</Label>
                    <Input
                      id="journeyStartLocation"
                      {...form.register("journeyStartLocation")}
                      data-testid="input-journey-start-location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journeyStartDescription">Journey Start Description</Label>
                  <Input
                    id="journeyStartDescription"
                    {...form.register("journeyStartDescription")}
                    data-testid="input-journey-start-description"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="finalDestination">Final Destination</Label>
                  <Input
                    id="finalDestination"
                    {...form.register("finalDestination")}
                    data-testid="input-final-destination"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finalDestinationDescription">Final Destination Description</Label>
                  <Input
                    id="finalDestinationDescription"
                    {...form.register("finalDestinationDescription")}
                    data-testid="input-final-destination-description"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newsletterSubscribersCount">Subscribers Count</Label>
                    <Input
                      id="newsletterSubscribersCount"
                      type="number"
                      {...form.register("newsletterSubscribersCount", { valueAsNumber: true })}
                      data-testid="input-subscribers-count"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weeklyStoriesCount">Weekly Stories Count</Label>
                    <Input
                      id="weeklyStoriesCount"
                      type="number"
                      {...form.register("weeklyStoriesCount", { valueAsNumber: true })}
                      data-testid="input-weekly-stories-count"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readRate">Read Rate (%)</Label>
                    <Input
                      id="readRate"
                      type="number"
                      {...form.register("readRate", { valueAsNumber: true })}
                      data-testid="input-read-rate"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-brand-orange hover:bg-brand-orange/90"
            data-testid="submit-home-content-button"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}