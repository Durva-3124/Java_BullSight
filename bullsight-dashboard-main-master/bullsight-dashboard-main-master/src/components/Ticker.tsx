import { TrendingUp, TrendingDown } from "lucide-react";
import type { StockData } from "@/hooks/useSimulatedData";

interface TickerProps {
  stocks: StockData[];
  onStockClick: (stock: StockData) => void;
}

export default function Ticker({ stocks, onStockClick }: TickerProps) {
  const doubled = [...stocks, ...stocks, ...stocks];

  return (
    <div className="w-full overflow-hidden border-b border-border/50 py-2 bg-secondary/20 backdrop-blur-md">
      <div className="animate-ticker flex whitespace-nowrap hover:[animation-play-state:paused]">
        {doubled.map((s, i) => {
          const up = s.change >= 0;
          return (
            <div 
              key={`${s.symbol}-${i}`} 
              className="inline-flex items-center gap-3 px-8 group cursor-pointer border-r border-border/30 last:border-r-0 transition-colors hover:bg-primary/5"
              onClick={() => onStockClick(s)}
            >
              <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{s.symbol}</span>
              <span className="font-mono text-sm text-foreground/90">${s.price.toFixed(2)}</span>
              <span className={`flex items-center gap-1 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-all ${
                up ? "text-gain bg-gain/10" : "text-loss bg-loss/10"
              }`}>
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {up ? "+" : ""}{s.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
