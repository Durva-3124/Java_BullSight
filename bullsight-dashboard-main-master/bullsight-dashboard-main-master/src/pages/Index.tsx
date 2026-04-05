import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useSimulatedData } from "@/hooks/useSimulatedData";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import SummaryCards from "@/components/SummaryCards";
import PriceChart from "@/components/PriceChart";
import RiskChart from "@/components/RiskChart";
import SectorDonut from "@/components/SectorDonut";
import MonthlyPerformance from "@/components/MonthlyPerformance";
import Portfolio from "@/components/Portfolio";
import AlertPanel from "@/components/AlertPanel";
import OrderBook from "@/components/OrderBook";
import ActivityFeed from "@/components/ActivityFeed";
import DashboardSidebar, { DashboardView } from "@/components/DashboardSidebar";
import StockDetails from "@/components/StockDetails";
import ProModal from "@/components/ProModal";
import { StockData } from "@/hooks/useSimulatedData";

export default function Index() {
  const { alerts, isConnected } = useWebSocket();
  const { stocks, portfolio, isLive } = useSimulatedData();
  const [currentView, setCurrentView] = useState<DashboardView>("dashboard");
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  useEffect(() => {
    if (alerts.length > 0) {
      const latest = alerts[alerts.length - 1];
      toast.warning(`🚨 Alert: ${latest.symbol} hit $${latest.targetPrice}`, {
        description: `Condition: ${latest.condition}`,
      });
    }
  }, [alerts]);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <SummaryCards portfolio={portfolio} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PriceChart />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <RiskChart />
                <SectorDonut />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed />
              </div>
              <div className="lg:col-span-1">
                <OrderBook />
              </div>
              <div className="lg:col-span-1">
                <AlertPanel />
              </div>
            </div>
            <MonthlyPerformance />
            <Portfolio portfolio={portfolio} />
          </div>
        );
      case "portfolio":
        return <Portfolio portfolio={portfolio} />;
      case "markets":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PriceChart />
            <SectorDonut />
            <RiskChart />
          </div>
        );
      case "orders":
        return <OrderBook />;
      case "alerts":
        return <AlertPanel />;
      case "settings":
        return (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-1">Settings</h2>
              <p className="text-sm text-muted-foreground mb-8">Manage your account and platform preferences.</p>
              
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Platform Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border/50">
                      <div>
                        <p className="text-sm font-bold">Live Data Refresh</p>
                        <p className="text-xs text-muted-foreground">Update prices and portfolio in real-time.</p>
                      </div>
                      <div className="h-6 w-10 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border/50">
                      <div>
                        <p className="text-sm font-bold">AI Predictions</p>
                        <p className="text-xs text-muted-foreground">Show BullSight AI price targets on charts.</p>
                      </div>
                      <div className="h-6 w-10 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border/50">
                      <div>
                        <p className="text-sm font-bold">Browser Push Alerts</p>
                        <p className="text-xs text-muted-foreground">Get notified when price alerts are triggered.</p>
                      </div>
                      <div className="h-6 w-10 bg-secondary rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="pt-4 flex gap-3">
                  <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                    Save Changes
                  </button>
                  <button className="px-6 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-bold hover:bg-secondary/80 transition-all active:scale-95">
                    Reset Defaults
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 border-loss/20">
              <h3 className="text-sm font-bold uppercase tracking-wider text-loss mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Clear Trading History</p>
                  <p className="text-xs text-muted-foreground">Permanently delete all order and alert logs.</p>
                </div>
                <button className="px-4 py-2 bg-loss/10 text-loss border border-loss/20 rounded-xl text-xs font-bold hover:bg-loss/20 transition-all">
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar 
        isConnected={isLive} 
        alertCount={alerts.length} 
        onHomeClick={() => setCurrentView("dashboard")}
        onSettingsClick={() => setCurrentView("settings")}
        onProClick={() => setIsProModalOpen(true)}
      />
      <Ticker stocks={stocks} onStockClick={setSelectedStock} />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-4 md:p-6 space-y-4 overflow-auto animate-fade-in">
          {renderView()}
        </main>
      </div>

      <StockDetails stock={selectedStock} onClose={() => setSelectedStock(null)} />
      <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </div>
  );
}
