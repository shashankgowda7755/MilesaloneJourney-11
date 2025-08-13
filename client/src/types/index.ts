export interface JourneyWaypoint {
  lat: number;
  lng: number;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'start' | 'waypoint' | 'current' | 'end';
  description?: string;
  date?: string;
}

export interface FilterState {
  search: string;
  category: string;
  region: string;
  sort: string;
}

export interface AdminStats {
  totalPosts: number;
  totalDestinations: number;
  totalGalleryItems: number;
  totalSubscribers: number;
  unreadMessages: number;
}
