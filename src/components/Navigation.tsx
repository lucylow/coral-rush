import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { 
  PlayCircle, 
  Monitor, 
  CreditCard, 
  Coins, 
  Shield, 
  Info, 
  Wallet, 
  History,
  Mic,
  Network,
  Settings,
  ChevronUp,
  RefreshCw,
  Headphones,
  MessageSquare
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navItems = [
    { path: "/voice-agent", label: "Voice Agent", icon: Mic },
    { path: "/coral-orchestrator", label: "Coral Protocol", icon: Network },
    { path: "/vm-dashboard", label: "VM Dashboard", icon: Monitor },
    { path: "/payment", label: "Payment", icon: CreditCard },
    { path: "/support-dashboard", label: "Support Hub", icon: Headphones },
    { path: "/nft-refunds", label: "NFT Refunds", icon: RefreshCw },
    { path: "/customer-support", label: "Support", icon: MessageSquare },
    { path: "/orgo-utility", label: "SOL Utility", icon: Coins },
    { path: "/fraud-detection", label: "Fraud Detection", icon: Shield },
    { path: "/token-info", label: "Token Info", icon: Info },
    { path: "/wallet", label: "Wallet", icon: Wallet },
    { path: "/history", label: "History", icon: History },
    { path: "/api-health", label: "API Health", icon: Settings }
  ];

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="scroll-indicator">
        <div 
          className="scroll-progress" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className={cn(
        "border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 transition-all duration-300",
        isScrolled && "shadow-lg bg-card/80"
      )}>
        <div className="container-responsive">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="text-center flex-1">
              <h1 className="heading-responsive font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
                RUSH Payment Agent
              </h1>
              <p className="text-muted-foreground mt-2 text-responsive">
              </p>
            </div>
            
            {/* Scroll to Top Button */}
            {isScrolled && (
              <Button
                onClick={scrollToTop}
                size="sm"
                variant="outline"
                className="ml-4 touch-target opacity-80 hover:opacity-100 transition-opacity"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <nav className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "h-10 px-2 sm:px-3 transition-all duration-200 hover:scale-105 touch-target",
                    "text-xs sm:text-sm",
                    isActive && "shadow-md bg-primary text-primary-foreground",
                    !isActive && "hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-1 sm:gap-2">
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium hidden sm:inline">{item.label}</span>
                    <span className="font-medium sm:hidden">{item.label.split(' ')[0]}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navigation;