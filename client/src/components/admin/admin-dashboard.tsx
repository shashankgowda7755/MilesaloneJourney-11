import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Camera, FileText, Map } from "lucide-react";

interface AdminDashboardProps {
  onNewPost?: () => void;
  onAddDestination?: () => void;
  onUploadPhotos?: () => void;
  onUpdateLocation?: () => void;
}

export default function AdminDashboard({ onNewPost, onAddDestination, onUploadPhotos, onUpdateLocation }: AdminDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-testid="admin-dashboard">
      <div className="lg:col-span-2">
        <Card className="bg-white p-6 shadow-sm">
          <h3 className="font-playfair text-xl font-bold text-brand-brown mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="bg-brand-orange text-white p-6 rounded-xl font-medium hover:bg-brand-orange/90 h-auto flex-col space-y-2"
              onClick={onNewPost}
            >
              <Plus className="h-6 w-6" />
              <div>New Post</div>
            </Button>
            
            <Button 
              className="bg-brand-green text-white p-6 rounded-xl font-medium hover:bg-brand-green/90 h-auto flex-col space-y-2"
              onClick={onAddDestination}
            >
              <Map className="h-6 w-6" />
              <div>Add Destination</div>
            </Button>
            
            <Button 
              className="bg-blue-500 text-white p-6 rounded-xl font-medium hover:bg-blue-500/90 h-auto flex-col space-y-2"
              onClick={onUploadPhotos}
            >
              <Camera className="h-6 w-6" />
              <div>Upload Photos</div>
            </Button>
            
            <Button 
              className="bg-purple-500 text-white p-6 rounded-xl font-medium hover:bg-purple-500/90 h-auto flex-col space-y-2"
              onClick={onUpdateLocation}
            >
              <MapPin className="h-6 w-6" />
              <div>Update Location</div>
            </Button>
          </div>
        </Card>
      </div>
      
      <div>
        <Card className="bg-white p-6 shadow-sm">
          <h3 className="font-playfair text-xl font-bold text-brand-brown mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm">
                <p className="font-medium text-brand-brown">New blog post published</p>
                <p className="text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm">
                <p className="font-medium text-brand-brown">Location updated to Mysuru</p>
                <p className="text-gray-500">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm">
                <p className="font-medium text-brand-brown">Gallery collection added</p>
                <p className="text-gray-500">3 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm">
                <p className="font-medium text-brand-brown">New destination guide created</p>
                <p className="text-gray-500">5 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
