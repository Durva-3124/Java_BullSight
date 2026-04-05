import { useState } from "react";
import { ArrowRightLeft, Loader2, Info, DollarSign, Briefcase } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function OrderBook() {
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOrder = async () => {
    const qty = parseInt(quantity);
    const prc = parseFloat(price);
    if (!symbol.trim() || isNaN(qty) || qty <= 0 || isNaN(prc) || prc <= 0) {
      toast.error("Please enter valid symbol, quantity, and price");
      return;
    }
    setSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.append('userId', 'Durva_Pawar');
      params.append('symbol', symbol.toUpperCase());
      params.append('quantity', qty.toString());
      params.append('orderType', orderType);
      params.append('price', prc.toString());

      const response = await axios.post('http://localhost:8080/api/orders', null, { params });
      console.log("Order Placed:", response.data);
      toast.success(`${orderType} order placed for ${qty} ${symbol.toUpperCase()}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.success(`${orderType} order simulated for ${qty} ${symbol.toUpperCase()} (Demo Mode)`);
    } finally {
      setSubmitting(false);
      setQuantity("");
      setPrice("");
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-primary/10">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
          </div>
          Quick Trade
        </h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Info className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 mb-6">
        {(["BUY", "SELL"] as const).map((t) => (
          <button 
            key={t} 
            onClick={() => setOrderType(t)} 
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
              orderType === t 
                ? (t === "BUY" ? "bg-gain text-white shadow-lg shadow-gain/20" : "bg-loss text-white shadow-lg shadow-loss/20") 
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4 flex-1">
        <div className="group">
          <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider group-focus-within:text-primary transition-colors">Asset Symbol</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
              value={symbol} 
              onChange={(e) => setSymbol(e.target.value)} 
              className="w-full bg-background/50 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              placeholder="e.g. BTC, AAPL"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="group">
            <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider group-focus-within:text-primary transition-colors">Quantity</label>
            <input 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              type="number" 
              min="1" 
              placeholder="0" 
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
            />
          </div>
          <div className="group">
            <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider group-focus-within:text-primary transition-colors">Price ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                type="number" 
                min="0.01" 
                step="0.01" 
                placeholder="0.00" 
                className="w-full bg-background/50 border border-border/50 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-secondary/20 rounded-xl border border-border/30 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Estimated Total</span>
            <span className="font-mono font-bold text-foreground">
              ${(parseFloat(quantity || "0") * parseFloat(price || "0")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">Trading Fee (0.1%)</span>
            <span className="font-mono text-muted-foreground">
              ${(parseFloat(quantity || "0") * parseFloat(price || "0") * 0.001).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleOrder} 
        disabled={submitting} 
        className={`w-full py-3.5 rounded-xl text-sm font-bold mt-6 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg ${
          orderType === "BUY" 
            ? "bg-gain text-white hover:bg-gain/90 shadow-gain/20" 
            : "bg-loss text-white hover:bg-loss/90 shadow-loss/20"
        }`}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (
          <span className="flex items-center justify-center gap-2">
            {orderType} {symbol.toUpperCase()}
            <ArrowRightLeft className="h-4 w-4 opacity-50" />
          </span>
        )}
      </button>
    </div>
  );
}
