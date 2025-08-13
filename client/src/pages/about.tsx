import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Bell, Calendar, Route, Coins, Backpack } from "lucide-react";
import { Link } from "wouter";
import ContactForm from "@/components/contact/contact-form";
import { useJourney } from "@/hooks/use-journey";

export default function About() {
  const { data: journey } = useJourney();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24" data-testid="about-section">
          <div>
            {/* Portrait photo placeholder */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000"
                alt="Shashank with backpack in mountain setting"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                data-testid="traveler-portrait"
              />
              <div className="absolute -bottom-6 -right-6 bg-brand-orange text-white p-4 rounded-2xl shadow-lg">
                <div className="text-center" data-testid="completion-badge">
                  <div className="text-2xl font-bold">{journey?.journeyProgress || 65}%</div>
                  <div className="text-sm">Complete</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6" data-testid="about-title">
              About the Journey
            </h1>
            <p className="text-xl text-gray-600 mb-6" data-testid="about-intro">
              I'm Shashank, and this is my attempt to document the real India - not the Instagram-perfect version, but the authentic, challenging, beautiful, and transformative experience of traveling across this incredible country on a shoestring budget.
            </p>
            <p className="text-gray-600 mb-8" data-testid="about-description">
              Starting from the serene valleys of Kashmir and heading to the southern tip of Kanyakumari, this 4-month journey covers over 3,000 kilometers, 15+ states, and countless stories of human connection, cultural discovery, and personal growth. All on a budget of just ₹500 per day.
            </p>

            {/* Journey Details */}
            <div className="grid grid-cols-2 gap-6 mb-8" data-testid="journey-details">
              <Card className="bg-white p-4">
                <CardContent className="p-0">
                  <div className="flex items-center mb-2">
                    <Calendar className="text-brand-orange mr-3 h-5 w-5" />
                    <span className="font-semibold text-brand-brown">Duration</span>
                  </div>
                  <p className="text-gray-600">4 months (Aug - Nov 2025)</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white p-4">
                <CardContent className="p-0">
                  <div className="flex items-center mb-2">
                    <Route className="text-brand-orange mr-3 h-5 w-5" />
                    <span className="font-semibold text-brand-brown">Distance</span>
                  </div>
                  <p className="text-gray-600">3,000+ kilometers</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white p-4">
                <CardContent className="p-0">
                  <div className="flex items-center mb-2">
                    <Coins className="text-brand-orange mr-3 h-5 w-5" />
                    <span className="font-semibold text-brand-brown">Daily Budget</span>
                  </div>
                  <p className="text-gray-600">₹500 per day</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white p-4">
                <CardContent className="p-0">
                  <div className="flex items-center mb-2">
                    <Backpack className="text-brand-orange mr-3 h-5 w-5" />
                    <span className="font-semibold text-brand-brown">Style</span>
                  </div>
                  <p className="text-gray-600">Solo backpacking</p>
                </CardContent>
              </Card>
            </div>

            {/* Travel Philosophy */}
            <Card className="bg-brand-green bg-opacity-10 p-6 mb-8" data-testid="travel-philosophy">
              <CardContent className="p-0">
                <h3 className="font-playfair text-xl font-bold text-brand-brown mb-3">Travel Philosophy</h3>
                <p className="text-gray-600 italic">
                  "Slow travel isn't just about taking your time - it's about being present, building genuine connections, and understanding that the journey changes you as much as you experience it."
                </p>
              </CardContent>
            </Card>

            {/* Contact and Support */}
            <div className="flex flex-col sm:flex-row gap-4" data-testid="about-actions">
              <a href="mailto:hello@milesalone.com">
                <Button className="bg-brand-orange text-white hover:bg-brand-orange/90 px-6 py-3 font-medium">
                  <Mail className="mr-2 h-4 w-4" />
                  Get in Touch
                </Button>
              </a>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-6 py-3 font-medium"
              >
                <Bell className="mr-2 h-4 w-4" />
                Follow Journey
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 gap-12" data-testid="contact-section">
          <div>
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-brand-brown mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about the journey? Want to share your own travel experiences? Or maybe you have recommendations for upcoming destinations? I'd love to hear from you.
            </p>

            <ContactForm />
          </div>

          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <h3 className="font-playfair text-2xl font-bold text-brand-brown mb-6">Connect Directly</h3>
                <div className="space-y-4">
                  <a href="mailto:hello@milesalone.com" className="flex items-center text-gray-600 hover:text-brand-orange transition-colors">
                    <Mail className="text-brand-orange mr-4 h-5 w-5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div>hello@milesalone.com</div>
                    </div>
                  </a>
                  <div className="flex items-center text-gray-600">
                    <Route className="text-brand-orange mr-4 h-5 w-5" />
                    <div>
                      <div className="font-medium">Current Location</div>
                      <div>{journey?.currentLocation || "Mysuru, Karnataka, India"}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="text-brand-orange mr-4 h-5 w-5" />
                    <div>
                      <div className="font-medium">Response Time</div>
                      <div>Usually within 24 hours</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Journey Status */}
            <Card className="bg-brand-orange bg-opacity-10 p-8 border-2 border-brand-orange">
              <CardContent className="p-0">
                <h3 className="font-playfair text-xl font-bold text-brand-brown mb-4">Journey Update</h3>
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-brand-orange rounded-full animate-pulse mr-3"></div>
                  <span className="font-medium text-brand-brown">Currently in {journey?.currentLocation || "Mysuru"}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Exploring the royal heritage and palace architecture. Next stop: Coimbatore for textile culture exploration.
                </p>
                <div className="text-sm text-gray-500">
                  Last updated: 2 hours ago
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <h3 className="font-playfair text-xl font-bold text-brand-brown mb-4">Quick Questions</h3>
                <div className="space-y-3" data-testid="faq-section">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-brand-brown font-medium hover:text-brand-orange">How do you travel on ₹500/day?</summary>
                    <p className="text-gray-600 mt-2 pl-4">Budget hostels (₹200), local transport (₹100), street food (₹150), miscellaneous (₹50).</p>
                  </details>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-brand-brown font-medium hover:text-brand-orange">Can I follow your exact route?</summary>
                    <p className="text-gray-600 mt-2 pl-4">Yes! All route details, accommodations, and transport options are documented in destination guides.</p>
                  </details>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-brand-brown font-medium hover:text-brand-orange">Do you accept travel recommendations?</summary>
                    <p className="text-gray-600 mt-2 pl-4">Absolutely! Send location suggestions via the contact form above.</p>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Bottom spacer to prevent navigation overlap */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
