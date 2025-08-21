import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, LogOut, Plus, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminStats from "@/components/admin/admin-stats";
import AdminDashboard from "@/components/admin/admin-dashboard";
import BlogPostManager from "@/components/admin/blog-post-manager";
import DestinationManager from "@/components/admin/destination-manager";
import TravelPinsManager from "@/components/admin/travel-pins-manager";
import GalleryManager from "@/components/admin/gallery-manager";
import MessageManager from "@/components/admin/message-manager";
import HomeContentManager from "@/components/admin/home-content-manager";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication status
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Invalid password",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      loginMutation.mutate({ username, password });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUsername("");
      setPassword("");
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4" data-testid="user-login">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto text-brand-orange text-4xl mb-4" />
            <CardTitle className="font-playfair text-2xl font-bold text-brand-brown">
              Login
            </CardTitle>
            <p className="text-gray-600">
              Sign in to your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={loginMutation.isPending}
                  data-testid="username-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loginMutation.isPending}
                  data-testid="password-input"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-brand-brown text-white hover:bg-brand-brown/90"
                disabled={loginMutation.isPending || !username.trim() || !password.trim()}
                data-testid="login-button"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => window.history.back()}
                  className="text-gray-500 hover:text-gray-700"
                  data-testid="cancel-login-button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream" data-testid="admin-dashboard">
      {/* Admin Header */}
      <div className="bg-brand-brown text-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="text-brand-orange h-6 w-6" />
              <span className="font-playfair text-xl font-bold">Admin Dashboard</span>
            </div>
            <Button 
              onClick={handleLogout}
              className="bg-brand-orange text-white hover:bg-brand-orange/90"
              data-testid="logout-button"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Exit Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <AdminStats />

        {/* Admin Tabs */}
        <Tabs defaultValue="dashboard" className="mt-8" data-testid="admin-tabs">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="home-content">Home Page</TabsTrigger>
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="travel-pins">Travel Map</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="home-content" className="mt-6">
            <HomeContentManager />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <AdminDashboard 
              onNewPost={() => {
                // Switch to posts tab and trigger create
                const tabsTrigger = document.querySelector('[value="posts"]') as HTMLElement;
                tabsTrigger?.click();
                setTimeout(() => {
                  const createButton = document.querySelector('[data-testid="create-blog-post-button"]') as HTMLElement;
                  createButton?.click();
                }, 100);
              }}
              onAddDestination={() => {
                // Switch to destinations tab and trigger create
                const tabsTrigger = document.querySelector('[value="destinations"]') as HTMLElement;
                tabsTrigger?.click();
                setTimeout(() => {
                  const createButton = document.querySelector('[data-testid="create-destination-button"]') as HTMLElement;
                  createButton?.click();
                }, 100);
              }}
              onUploadPhotos={() => {
                // Switch to gallery tab
                const tabsTrigger = document.querySelector('[value="gallery"]') as HTMLElement;
                tabsTrigger?.click();
              }}
              onUpdateLocation={() => {
                // Switch to destinations tab
                const tabsTrigger = document.querySelector('[value="destinations"]') as HTMLElement;
                tabsTrigger?.click();
              }}
              onEditPost={(post) => {
                // Switch to posts tab and trigger edit for specific post
                const tabsTrigger = document.querySelector('[value="posts"]') as HTMLElement;
                tabsTrigger?.click();
                setTimeout(() => {
                  // Find and click edit button for this specific post
                  const editButtons = document.querySelectorAll('[data-testid^="edit-blog-post-"]');
                  const targetButton = Array.from(editButtons).find(btn => 
                    btn.getAttribute('data-testid')?.includes(post.id)
                  ) as HTMLElement;
                  targetButton?.click();
                }, 200);
              }}
              onEditDestination={(destination) => {
                // Switch to destinations tab and trigger edit for specific destination
                const tabsTrigger = document.querySelector('[value="destinations"]') as HTMLElement;
                tabsTrigger?.click();
                setTimeout(() => {
                  // Find and click edit button for this specific destination
                  const editButtons = document.querySelectorAll('[data-testid^="edit-destination-"]');
                  const targetButton = Array.from(editButtons).find(btn => 
                    btn.getAttribute('data-testid')?.includes(destination.id)
                  ) as HTMLElement;
                  targetButton?.click();
                }, 200);
              }}
              onEditGallery={(collection) => {
                // Switch to gallery tab and trigger edit for specific collection
                const tabsTrigger = document.querySelector('[value="gallery"]') as HTMLElement;
                tabsTrigger?.click();
                setTimeout(() => {
                  // Find and click edit button for this specific collection
                  const editButtons = document.querySelectorAll('[data-testid^="edit-gallery-"]');
                  const targetButton = Array.from(editButtons).find(btn => 
                    btn.getAttribute('data-testid')?.includes(collection.id)
                  ) as HTMLElement;
                  targetButton?.click();
                }, 200);
              }}
            />
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
            <BlogPostManager />
          </TabsContent>

          <TabsContent value="destinations" className="mt-6">
            <DestinationManager />
          </TabsContent>

          <TabsContent value="travel-pins" className="mt-6">
            <TravelPinsManager />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <MessageManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
