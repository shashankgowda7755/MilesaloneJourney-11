import type { JourneyWaypoint } from '@/types';

export const journeyWaypoints: JourneyWaypoint[] = [
  {
    lat: 34.0837,
    lng: 74.7973,
    name: "Srinagar, Kashmir",
    status: "completed",
    type: "start",
    description: "Journey begins - Dal Lake, Srinagar",
    date: "August 1, 2025"
  },
  {
    lat: 32.2190,
    lng: 76.3234,
    name: "Dharamshala, Himachal Pradesh",
    status: "completed",
    type: "waypoint",
    description: "Mountain retreat - Dharamshala",
    date: "August 15, 2025"
  },
  {
    lat: 28.7041,
    lng: 77.1025,
    name: "Delhi, National Capital",
    status: "completed",
    type: "waypoint",
    description: "Urban exploration - New Delhi",
    date: "September 1, 2025"
  },
  {
    lat: 26.9124,
    lng: 75.7873,
    name: "Jaipur, Rajasthan",
    status: "completed",
    type: "waypoint",
    description: "Pink city adventure - Jaipur",
    date: "September 10, 2025"
  },
  {
    lat: 23.0225,
    lng: 72.5714,
    name: "Ahmedabad, Gujarat",
    status: "completed",
    type: "waypoint",
    description: "Gandhi's legacy - Ahmedabad",
    date: "September 20, 2025"
  },
  {
    lat: 19.0760,
    lng: 72.8777,
    name: "Mumbai, Maharashtra",
    status: "completed",
    type: "waypoint",
    description: "City of dreams - Mumbai",
    date: "October 1, 2025"
  },
  {
    lat: 15.2993,
    lng: 74.1240,
    name: "Goa, Coastal Paradise",
    status: "completed",
    type: "waypoint",
    description: "Coastal relaxation - Goa beaches",
    date: "October 10, 2025"
  },
  {
    lat: 12.2958,
    lng: 76.6394,
    name: "Mysuru, Karnataka",
    status: "current",
    type: "current",
    description: "Currently in: Mysuru, Karnataka",
    date: "October 20, 2025"
  },
  {
    lat: 11.0168,
    lng: 76.9558,
    name: "Coimbatore, Tamil Nadu",
    status: "upcoming",
    type: "waypoint",
    description: "Next destination - Coimbatore",
    date: "November 1, 2025"
  },
  {
    lat: 8.0883,
    lng: 77.0200,
    name: "Kanyakumari, Tamil Nadu",
    status: "upcoming",
    type: "end",
    description: "Journey's end - Land's End India",
    date: "November 15, 2025"
  }
];

export const getMarkerIcon = (waypoint: JourneyWaypoint) => {
  switch (waypoint.type) {
    case 'start':
      return {
        html: '<i class="fas fa-flag text-green-500 text-2xl"></i>',
        className: 'custom-div-icon',
        iconSize: [30, 30] as [number, number],
        iconAnchor: [15, 30] as [number, number]
      };
    case 'current':
      return {
        html: '<i class="fas fa-map-pin text-orange-500 text-3xl animate-pulse"></i>',
        className: 'custom-div-icon',
        iconSize: [40, 40] as [number, number],
        iconAnchor: [20, 40] as [number, number]
      };
    case 'end':
      return {
        html: '<i class="fas fa-flag-checkered text-red-500 text-2xl"></i>',
        className: 'custom-div-icon',
        iconSize: [30, 30] as [number, number],
        iconAnchor: [15, 30] as [number, number]
      };
    default:
      const color = waypoint.status === 'completed' ? 'blue-500' : 'gray-400';
      return {
        html: `<i class="fas fa-circle text-${color} text-lg"></i>`,
        className: 'custom-div-icon',
        iconSize: [20, 20] as [number, number],
        iconAnchor: [10, 20] as [number, number]
      };
  }
};
