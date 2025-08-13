import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Lock } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive weekly updates about the journey.",
      });
      setEmail("");
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate(email);
    }
  };

  return (
    <div className="max-w-md mx-auto" data-testid="newsletter-form">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-6 py-4 rounded-full border-0 focus:ring-4 focus:ring-white focus:ring-opacity-30 text-brand-brown"
            disabled={subscribeMutation.isPending}
            data-testid="newsletter-email-input"
          />
          <Button
            type="submit"
            className="bg-brand-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-orange/90 whitespace-nowrap disabled:opacity-50"
            disabled={subscribeMutation.isPending || !email}
            data-testid="newsletter-subscribe-button"
          >
            {subscribeMutation.isPending ? (
              "Subscribing..."
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </div>
        
        <p className="text-green-200 text-sm text-center" data-testid="newsletter-privacy">
          <Lock className="inline mr-1 h-3 w-3" />
          Your privacy is protected. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
