import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
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
  RefreshCw,
  Headphones,
  MessageSquare
} from 'lucide-react';

const MobileNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/voice-agent", label: "Voice", icon: Mic },
    { path: "/coral-orchestrator", label: "Coral", icon: Network },
    { path: "/vm-dashboard", label: "VM", icon: Monitor },
    { path: "/payment", label: "Pay", icon: CreditCard },
    { path: "/support-dashboard", label: "Support", icon: Headphones },
    { path: "/nft-refunds", label: "Refunds", icon: RefreshCw },
    { path: "/customer-support", label: "Chat", icon: MessageSquare },
    { path: "/orgo-utility", label: "SOL", icon: Coins },
    { path: "/fraud-detection", label: "Fraud", icon: Shield },
    { path: "/token-info", label: "Token", icon: Info },
    { path: "/wallet", label: "Wallet", icon: Wallet },
    { path: "/history", label: "History", icon: History },
    { path: "/api-health", label: "API", icon: Settings }
  ];

  return (
    <nav className="mobile-nav">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "mobile-nav-item touch-target flex-1",
                "transition-all duration-200",
                isActive && "text-primary bg-primary/10",
                !isActive && "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link to={item.path}>
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
