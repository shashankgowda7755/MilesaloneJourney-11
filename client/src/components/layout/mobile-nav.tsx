import { useLocation } from "wouter";
import { Home, Map, BookOpen, Images, User } from "lucide-react";

export default function MobileNav() {
  const [location, navigate] = useLocation();

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
    <nav className="mobile-bottom-nav lg:hidden mt-[-12px] mb-[-12px]" data-testid="mobile-bottom-nav">
      <div className="flex justify-around items-center h-16 mt-[-2px] mb-[-2px]">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <button
              key={item.name}
              className="flex flex-col items-center space-y-1 px-2 py-1 transition-all cursor-pointer relative text-gray-600 hover:text-brand-orange pt-[2px] pb-[2px] pl-[12px] pr-[12px] ml-[0px] mr-[0px]"
              data-testid={`mobile-nav-${item.name.toLowerCase()}`}
              onClick={() => {
                navigate(item.href);
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
