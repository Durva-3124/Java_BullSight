import { LayoutDashboard, PieChart, Bell, ArrowRightLeft, TrendingUp, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export type DashboardView = "dashboard" | "portfolio" | "markets" | "orders" | "alerts" | "settings";

interface NavItem {
  icon: any;
  label: string;
  view: DashboardView;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: PieChart, label: "Portfolio", view: "portfolio" },
  { icon: TrendingUp, label: "Markets", view: "markets" },
  { icon: ArrowRightLeft, label: "Orders", view: "orders" },
  { icon: Bell, label: "Alerts", view: "alerts" },
  { icon: Settings, label: "Settings", view: "settings" },
];

interface DashboardSidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export default function DashboardSidebar({ currentView, onViewChange }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col glass-card rounded-none border-t-0 border-b-0 border-l-0 transition-all duration-500 ease-in-out relative overflow-hidden ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-20 pointer-events-none" />
      
      <div className="flex-1 py-8 px-3 space-y-2 z-10">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold tracking-tight rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? "text-white bg-primary shadow-lg shadow-primary/30 scale-[1.02]" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              {!collapsed && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
              )}
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-popover text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5 z-10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-3 rounded-xl bg-secondary/30 text-muted-foreground hover:text-white hover:bg-secondary/50 transition-all"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
}
