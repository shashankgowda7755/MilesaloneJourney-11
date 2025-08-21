import { useQuery } from "@tanstack/react-query";
import type { HomePageContent } from "@shared/schema";

export function useHomeContent() {
  return useQuery<HomePageContent>({
    queryKey: ["/api/home-content"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export default useHomeContent;