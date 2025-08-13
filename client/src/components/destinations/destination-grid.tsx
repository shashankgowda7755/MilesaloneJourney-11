import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DestinationCard from "./destination-card";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw } from "lucide-react";
import type { Destination } from "@shared/schema";

const categories = [
  "All Categories",
  "Mountain Destination",
  "Historical Site",
  "Beach Location",
  "Cultural Hub",
  "Natural Wonder",
  "Coastal Destination",
];

const regions = [
  "All Regions",
  "North India",
  "South India",
  "West India",
  "East India",
  "Central India",
  "Northeast India",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "a-z", label: "A to Z" },
  { value: "z-a", label: "Z to A" },
  { value: "rating", label: "Highest Rated" },
];

export default function DestinationGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [sortBy, setSortBy] = useState("rating");

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedRegion("All Regions");
    setSortBy("rating");
  };

  const hasActiveFilters = searchTerm !== "" || 
    selectedCategory !== "All Categories" || 
    selectedRegion !== "All Regions" || 
    sortBy !== "rating";

  const { data: destinations = [], isLoading } = useQuery<Destination[]>({
    queryKey: [
      "/api/destinations", 
      selectedCategory !== "All Categories" ? selectedCategory : undefined,
      selectedRegion !== "All Regions" ? selectedRegion : undefined
    ],
  });

  const filteredAndSortedDestinations = destinations
    .filter(destination => {
      const matchesSearch = searchTerm === "" || 
        destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.state.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "a-z":
          return a.name.localeCompare(b.name);
        case "z-a":
          return b.name.localeCompare(a.name);
        case "rating":
        default:
          return b.rating - a.rating;
      }
    });

  return (
    <div className="space-y-8" data-testid="destination-grid">
      {/* Filters */}
      <div className="bg-brand-cream rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <Input
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              data-testid="destination-search-input"
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="destination-category-select">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger data-testid="destination-region-select">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="destination-sort-select">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Reset Filter Button */}
          <div className="flex items-center">
            <Button
              onClick={resetFilters}
              variant="outline"
              disabled={!hasActiveFilters}
              className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="reset-filters-button"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-center text-gray-600" data-testid="destination-results-info">
        {isLoading ? (
          "Loading destinations..."
        ) : (
          `${filteredAndSortedDestinations.length} ${filteredAndSortedDestinations.length === 1 ? 'destination' : 'destinations'} found`
        )}
      </div>

      {/* Destinations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-56 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : filteredAndSortedDestinations.length === 0 ? (
        <div className="text-center py-16" data-testid="no-destinations-message">
          <p className="text-gray-500 text-lg">No destinations found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="destinations-grid">
          {filteredAndSortedDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}
