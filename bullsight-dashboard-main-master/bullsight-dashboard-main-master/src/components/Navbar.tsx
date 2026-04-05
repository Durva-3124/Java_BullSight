import { Activity, Bell, Wifi, WifiOff, Search, Home, User, Settings, LogOut, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface NavbarProps {
  isConnected: boolean;
  alertCount: number;
  onHomeClick: () => void;
  onSettingsClick: () => void;
  onProClick: () => void;
}

export default function Navbar({ isConnected, alertCount, onHomeClick, onSettingsClick, onProClick }: NavbarProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Search feature coming soon!");
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 px-6 py-3 flex items-center justify-between border-b border-border/50 bg-background/70 backdrop-blur-lg">
      <div className="flex items-center gap-4">
        <button 
          onClick={onHomeClick}
          className="p-2.5 rounded-xl hover:bg-secondary/50 transition-all group active:scale-95"
        >
          <Home className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onHomeClick}>
          <div className="p-2 rounded-xl bg-secondary/30 border border-border/50 group-hover:bg-secondary/50 transition-all">
            <Activity className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <span className="text-xl font-black tracking-tight">
            <span className="neon-text text-2xl">BULLSIGHT</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="hidden md:flex items-center bg-secondary/30 rounded-xl px-4 py-2 gap-2 w-80 border border-border/50 focus-within:border-primary/50 transition-all">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search stocks, alerts..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
        />
      </form>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
          isConnected
            ? "bg-gain/10 text-gain border-gain/20 shadow-sm"
            : "bg-loss/10 text-loss border-loss/20 shadow-sm"
        }`}>
          {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3 animate-pulse" />}
          {isConnected ? "Live" : "Offline"}
        </div>

        <button className="relative p-2 rounded-xl hover:bg-secondary/50 transition-colors group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
              {alertCount}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 rounded-full bg-secondary/30 border border-border/50 flex items-center justify-center text-primary text-sm font-bold hover:bg-secondary/50 transition-all active:scale-95 shadow-sm">
              D
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
            <DropdownMenuLabel className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary/30 flex items-center justify-center text-primary text-xs font-bold">D</div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Durva Pawar</span>
                <span className="text-[10px] text-muted-foreground">Pro Trader</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-primary/10">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick} className="gap-2 cursor-pointer focus:bg-primary/10">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onProClick} className="gap-2 cursor-pointer focus:bg-primary/10 text-primary font-bold">
              <Shield className="h-4 w-4" /> BullSight AI Pro
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-loss/10 text-loss">
              <LogOut className="h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
