import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send } from "lucide-react";

const subjects = [
  "General Question",
  "Travel Recommendation",
  "Collaboration Inquiry",
  "Technical Issue",
  "Media/Press Inquiry",
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="contact-form">
      <h3 className="font-playfair text-2xl font-bold text-brand-brown mb-6">Send a Message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-brand-brown mb-2">
            Your Name
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your full name"
            required
            disabled={contactMutation.isPending}
            data-testid="contact-name-input"
          />
        </div>

        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-brand-brown mb-2">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="your.email@example.com"
            required
            disabled={contactMutation.isPending}
            data-testid="contact-email-input"
          />
        </div>

        <div>
          <Label htmlFor="subject" className="block text-sm font-medium text-brand-brown mb-2">
            Subject
          </Label>
          <Select 
            value={formData.subject} 
            onValueChange={(value) => handleChange("subject", value)}
          >
            <SelectTrigger data-testid="contact-subject-select">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message" className="block text-sm font-medium text-brand-brown mb-2">
            Message
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Share your thoughts, questions, or travel stories..."
            rows={5}
            required
            disabled={contactMutation.isPending}
            className="resize-none"
            data-testid="contact-message-textarea"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-orange text-white hover:bg-brand-orange/90 py-4 font-semibold disabled:opacity-50"
          disabled={contactMutation.isPending || !formData.name || !formData.email || !formData.subject || !formData.message}
          data-testid="contact-submit-button"
        >
          {contactMutation.isPending ? (
            "Sending..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
