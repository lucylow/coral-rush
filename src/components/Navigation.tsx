import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  Settings
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/voice-agent", label: "Voice Agent", icon: Mic },
    { path: "/coral-orchestrator", label: "Coral Protocol", icon: Network },
    { path: "/", label: "Live Demo", icon: PlayCircle },
    { path: "/vm-dashboard", label: "VM Dashboard", icon: Monitor },
    { path: "/payment", label: "Payment", icon: CreditCard },
    { path: "/orgo-utility", label: "SOL Utility", icon: Coins },
    { path: "/fraud-detection", label: "Fraud Detection", icon: Shield },
    { path: "/token-info", label: "Token Info", icon: Info },
    { path: "/wallet", label: "Wallet", icon: Wallet },
    { path: "/history", label: "History", icon: History },
    { path: "/api-health", label: "API Health", icon: Settings }
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
              RUSH Payment Agent
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
            </p>
          </div>
        </div>
        
        <nav className="flex flex-wrap gap-1 justify-center">
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
                  "h-10 px-3 transition-all duration-200 hover:scale-105",
                  isActive && "shadow-md bg-primary text-primary-foreground",
                  !isActive && "hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;