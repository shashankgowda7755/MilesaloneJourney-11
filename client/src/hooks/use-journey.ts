import { useQuery } from "@tanstack/react-query";
import type { JourneyTracking } from "@shared/schema";

export function useJourney() {
  return useQuery<JourneyTracking>({
    queryKey: ['/api/journey'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
