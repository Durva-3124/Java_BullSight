import { useState } from "react";
import { Bell, Plus, ArrowUp, ArrowDown, Loader2, X, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import type { PriceAlert } from "@/types/stock.types";
import axios from "axios";

const MOCK_ALERTS: PriceAlert[] = [
  { id: "1", userId: "Durva_Pawar", symbol: "AAPL", targetPrice: 195, condition: "ABOVE", active: true, createdAt: "2024-03-01" },
  { id: "2", userId: "Durva_Pawar", symbol: "TSLA", targetPrice: 240, condition: "BELOW", active: true, createdAt: "2024-03-02" },
  { id: "3", userId: "Durva_Pawar", symbol: "NVDA", targetPrice: 500, condition: "ABOVE", active: false, createdAt: "2024-02-28", triggeredAt: "2024-03-03" },
];

export default function AlertPanel() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(MOCK_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"ABOVE" | "BELOW">("ABOVE");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!symbol.trim() || !targetPrice.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      // We use URLSearchParams because the Backend uses @RequestParam 
      const params = new URLSearchParams();
      params.append('symbol', symbol.toUpperCase());
      params.append('targetPrice', targetPrice.toString());
      params.append('condition', condition); // Must be 'ABOVE' or 'BELOW' 

      const response = await axios.post('http://localhost:8080/api/alerts', null, { params });
      console.log("Alert Created:", response.data);
      toast.success(`Alert created for ${symbol.toUpperCase()}`);
      
      // Update local state if successful (optional, depending on if you want to wait for refetch)
      const newAlert: PriceAlert = {
        id: response.data.id || Date.now().toString(),
        userId: "Durva_Pawar",
        symbol: symbol.toUpperCase(),
        targetPrice: parseFloat(targetPrice),
        condition,
        active: true,
        createdAt: new Date().toISOString(),
      };
      setAlerts((prev) => [newAlert, ...prev]);
    } catch (error) {
      console.error("Error creating alert:", error);
      // Fallback for demo purposes if backend is not running
      const newAlert: PriceAlert = {
        id: Date.now().toString(),
        userId: "Durva_Pawar",
        symbol: symbol.toUpperCase(),
        targetPrice: parseFloat(targetPrice),
        condition,
        active: true,
        createdAt: new Date().toISOString(),
      };
      setAlerts((prev) => [newAlert, ...prev]);
      toast.success(`Alert created locally for ${symbol.toUpperCase()} (Demo Mode)`);
    } finally {
      setSubmitting(false);
      setShowForm(false);
      setSymbol("");
      setTargetPrice("");
    }
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success("Alert deleted");
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-primary/10">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          Price Alerts
        </h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`p-2.5 rounded-xl transition-all ${
            showForm ? "bg-loss/10 text-loss hover:bg-loss/20 rotate-45" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          }`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/30 rounded-2xl p-4 mb-6 space-y-4 border border-border/50 animate-in fade-in zoom-in duration-200">
          <div className="space-y-3">
            <div className="group">
              <label className="text-[10px] font-bold text-muted-foreground mb-1 block uppercase tracking-wider group-focus-within:text-primary transition-colors">Symbol</label>
              <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. AAPL" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div className="group">
              <label className="text-[10px] font-bold text-muted-foreground mb-1 block uppercase tracking-wider group-focus-within:text-primary transition-colors">Target Price ($)</label>
              <input value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} placeholder="0.00" type="number" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
          <div className="flex gap-2">
            {(["ABOVE", "BELOW"] as const).map((c) => (
              <button 
                key={c} 
                onClick={() => setCondition(c)} 
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  condition === c 
                    ? (c === "ABOVE" ? "bg-gain/20 text-gain border-gain/30" : "bg-loss/20 text-loss border-loss/30") 
                    : "bg-secondary/50 text-muted-foreground border border-transparent"
                }`}
              >
                {c === "ABOVE" ? "Above ↑" : "Below ↓"}
              </button>
            ))}
          </div>
          <button onClick={handleCreate} disabled={submitting} className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Create Alert"}
          </button>
        </div>
      )}

      <div className="space-y-3 flex-1 overflow-auto pr-1 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
            <Bell className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No alerts set. Click '+' to create one.</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div key={`${alert.id}-${index}`} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all hover:border-primary/30 hover:bg-primary/[0.02] ${alert.active ? "border-border/50 bg-secondary/10" : "border-border/30 opacity-60 grayscale-[0.5]"}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${alert.condition === "ABOVE" ? "bg-gain/10" : "bg-loss/10"}`}>
                  {alert.condition === "ABOVE" ? <ArrowUp className="h-4 w-4 text-gain" /> : <ArrowDown className="h-4 w-4 text-loss" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{alert.symbol}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {alert.condition.toLowerCase()} <span className="font-mono font-bold text-foreground/80">${alert.targetPrice}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {alert.active ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                    <Clock className="h-3 w-3" /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gain bg-gain/10 px-2 py-1 rounded-lg">
                    <CheckCircle2 className="h-3 w-3" /> Triggered
                  </span>
                )}
                <button 
                  onClick={() => deleteAlert(alert.id)}
                  className="p-1.5 rounded-lg hover:bg-loss/10 text-muted-foreground hover:text-loss opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
