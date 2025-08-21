import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Calendar, User, MessageSquare } from "lucide-react";
import { type ContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MessageManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact/messages'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('PATCH', `/api/contact/messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact/messages'] });
      toast({
        title: "Success",
        description: "Message marked as read",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unreadMessages = messages?.filter(msg => !msg.isRead) || [];
  const readMessages = messages?.filter(msg => msg.isRead) || [];

  return (
    <Card data-testid="message-manager">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Contact Messages
          </CardTitle>
          <div className="flex items-center space-x-2">
            {unreadMessages.length > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadMessages.length} unread
              </Badge>
            )}
            <Badge variant="outline">
              {messages?.length || 0} total
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Unread Messages */}
          {unreadMessages.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center text-red-600">
                <Mail className="mr-2 h-4 w-4" />
                Unread Messages ({unreadMessages.length})
              </h3>
              <div className="space-y-4">
                {unreadMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4"
                    data-testid={`unread-message-${message.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{message.subject}</h4>
                          <Badge className="bg-red-500 text-white">New</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {message.name}
                          </span>
                          <span className="flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {message.email}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(message.id)}
                        disabled={markAsReadMutation.isPending}
                        className="bg-green-600 text-white hover:bg-green-700"
                        data-testid={`mark-read-${message.id}`}
                      >
                        <MailOpen className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read Messages */}
          {readMessages.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-600">
                <MailOpen className="mr-2 h-4 w-4" />
                Read Messages ({readMessages.length})
              </h3>
              <div className="space-y-4">
                {readMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className="border rounded-lg p-4 bg-gray-50"
                    data-testid={`read-message-${message.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{message.subject}</h4>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Read
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {message.name}
                          </span>
                          <span className="flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {message.email}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Messages */}
          {messages?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p>Contact messages will appear here when visitors reach out through your website.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}