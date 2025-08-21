import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Mountain, Menu, X } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Journey", href: "/journey" },
    { name: "Letters", href: "/letters" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block bg-white shadow-sm sticky top-0 z-50" data-testid="desktop-header">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2" data-testid="logo-desktop">
              <Mountain className="text-brand-orange text-2xl" />
              <span className="font-playfair text-2xl font-bold text-brand-brown">Milesalone</span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-all duration-300 font-medium transform hover:scale-105 ${
                    isActive(item.href)
                      ? "text-brand-orange"
                      : "text-brand-brown hover:text-brand-orange"
                  }`}
                  data-testid={`nav-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/admin">
                <Button className="bg-brand-orange text-white hover:bg-brand-orange/90" data-testid="admin-button-desktop">
                  Login
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm sticky top-0 z-50" data-testid="mobile-header">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-mobile">
            <Mountain className="text-brand-orange text-xl" />
            <span className="font-playfair text-xl font-bold text-brand-brown">Milesalone</span>
          </Link>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="mobile-menu-trigger">
                <Menu className="h-6 w-6 text-brand-brown" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <Mountain className="text-brand-orange text-xl" />
                  <span className="font-playfair text-xl font-bold text-brand-brown">Milesalone</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                  data-testid="mobile-menu-close"
                >
                  <X className="h-6 w-6 text-brand-brown" />
                </Button>
              </div>
              
              <nav className="space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block transition-colors font-medium text-lg ${
                      isActive(item.href)
                        ? "text-brand-orange"
                        : "text-brand-brown hover:text-brand-orange"
                    }`}
                    data-testid={`mobile-nav-link-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <Button 
                    className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
                    data-testid="admin-button-mobile"
                  >
                    Login
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
