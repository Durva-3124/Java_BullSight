import { X, TrendingUp, TrendingDown, Activity, BarChart3, Globe, ShieldCheck } from "lucide-react";
import { StockData } from "@/hooks/useSimulatedData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface StockDetailsProps {
  stock: StockData | null;
  onClose: () => void;
}

const generateMockChartData = (basePrice: number) => {
  let price = basePrice;
  const points = 30;
  const data = [];
  
  for (let i = 0; i < points; i++) {
    const volatility = 0.005;
    const open = price;
    const change = price * volatility * (Math.random() - 0.45) * 2;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * price * 0.002;
    const low = Math.min(open, close) - Math.random() * price * 0.002;
    const volume = 100 + (i * 10) + Math.random() * 50;
    
    price = close;
    data.push({
      time: i,
      open,
      high,
      low,
      close,
      volume,
      isGain: close >= open
    });
  }
  
  // Calculate MA
  for (let i = 0; i < data.length; i++) {
    if (i >= 4) {
      const sum = data.slice(i - 4, i + 1).reduce((acc, curr) => acc + curr.close, 0);
      data[i].ma = sum / 5;
    }
  }
  
  return data;
};

const CandleStick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isGain = close >= open;
  const color = isGain ? "#22c55e" : "#ef4444";
  const wickX = x + width / 2;
  const bodyTop = y + (height * (high - Math.max(open, close))) / (high - low || 1);
  const bodyBottom = y + (height * (high - Math.min(open, close))) / (high - low || 1);
  return (
    <g>
      <line x1={wickX} y1={y} x2={wickX} y2={y + height} stroke={color} strokeWidth={1} />
      <rect x={x} y={bodyTop} width={width} height={Math.max(bodyBottom - bodyTop, 1)} fill={color} />
    </g>
  );
};

export default function StockDetails({ stock, onClose }: StockDetailsProps) {
  if (!stock) return null;

  const chartData = generateMockChartData(stock.price);
  const up = stock.change >= 0;

  return (
    <Dialog open={!!stock} onOpenChange={onClose}>
      <DialogContent className="glass-card p-0 max-w-2xl border-border/50 overflow-hidden rounded-4xl">
        <div className="p-6 border-b border-border/50 bg-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
              up ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"
            }`}>
              {stock.symbol[0]}
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-white">{stock.symbol}</DialogTitle>
              <p className="text-sm text-muted-foreground font-medium">{stock.name} • {stock.sector}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono font-bold text-white">${stock.price.toFixed(2)}</p>
            <p className={`text-sm font-mono font-bold flex items-center justify-end gap-1 ${up ? "text-gain" : "text-loss"}`}>
              {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {up ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary/50 transition-colors absolute top-4 right-4">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="h-56 w-full bg-secondary/10 rounded-2xl p-4 border border-border/50 relative overflow-hidden"
               style={{ background: "radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)" }}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: -10, left: -35, bottom: -10 }}>
                <defs>
                  <filter id="modalGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="modalVolGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid stroke="#1e293b" vertical={false} opacity={0.2} />
                
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} hide />
                
                <Bar dataKey="volume" fill="url(#modalVolGrad)" barSize={6} />
                
                <Bar
                  dataKey="close"
                  shape={<CandleStick />}
                  isAnimationActive={false}
                />

                <Line
                  type="monotone"
                  dataKey="ma"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                  filter="url(#modalGlow)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/20 p-4 rounded-2xl border border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Market Cap</p>
              <p className="text-sm font-bold text-white">$2.84T</p>
            </div>
            <div className="bg-secondary/20 p-4 rounded-2xl border border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Volume (24h)</p>
              <p className="text-sm font-bold text-white">{stock.volume.toLocaleString()}</p>
            </div>
            <div className="bg-secondary/20 p-4 rounded-2xl border border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">P/E Ratio</p>
              <p className="text-sm font-bold text-white">31.42</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
              Trade {stock.symbol}
            </button>
            <button className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl hover:bg-secondary/80 transition-all active:scale-[0.98]">
              Add to Watchlist
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
