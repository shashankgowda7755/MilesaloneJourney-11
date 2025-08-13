import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MapPin, Images, Mail, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminStats } from "@/types";

export default function AdminStats() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="admin-stats-loading">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: "text-brand-orange",
    },
    {
      title: "Destinations",
      value: stats?.totalDestinations || 0,
      icon: MapPin,
      color: "text-brand-green",
    },
    {
      title: "Gallery Items",
      value: stats?.totalGalleryItems || 0,
      icon: Images,
      color: "text-blue-500",
    },
    {
      title: "Subscribers",
      value: stats?.totalSubscribers || 0,
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="admin-stats">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium" data-testid={`stat-label-${index}`}>
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-brand-brown" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
