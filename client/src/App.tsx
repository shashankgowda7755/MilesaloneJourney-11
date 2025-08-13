import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Journey from "@/pages/journey";
import Letters from "@/pages/letters";
import Gallery from "@/pages/gallery";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";

function Router() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/journey" component={Journey} />
        <Route path="/letters" component={Letters} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/about" component={About} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
