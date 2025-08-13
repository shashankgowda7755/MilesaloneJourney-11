import { useLocation } from "wouter";
import { Home, Map, BookOpen, Images, User } from "lucide-react";
import { Link } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Journey", href: "/journey", icon: Map },
    { name: "Letters", href: "/letters", icon: BookOpen },
    { name: "Gallery", href: "/gallery", icon: Images },
    { name: "About", href: "/about", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <nav className="mobile-bottom-nav lg:hidden" data-testid="mobile-bottom-nav">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-1 px-2 py-1 transition-all ${
                active 
                  ? "mobile-nav-active text-white" 
                  : "text-gray-600 hover:text-brand-orange"
              }`}
              data-testid={`mobile-nav-${item.name.toLowerCase()}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
