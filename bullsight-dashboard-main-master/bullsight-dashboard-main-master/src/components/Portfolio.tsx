import { TrendingUp, TrendingDown, Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { PortfolioSummary, PositionData } from "@/hooks/useSimulatedData";
import { useState } from "react";

interface PortfolioProps {
  portfolio: PortfolioSummary;
}

export default function Portfolio({ portfolio }: PortfolioProps) {
  const [search, setSearch] = useState("");

  const filteredPositions = portfolio.positions.filter(pos => 
    pos.symbol.toLowerCase().includes(search.toLowerCase()) || 
    pos.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Portfolio Holdings</h3>
          <p className="text-xs text-muted-foreground">Manage and track your active positions</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary/30 border border-border/50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary w-full md:w-64 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full">
          <thead>
            <tr className="text-muted-foreground border-b border-border/50">
              <th className="text-left pb-4 font-medium text-xs uppercase tracking-wider">Asset</th>
              <th className="text-right pb-4 font-medium text-xs uppercase tracking-wider">Quantity</th>
              <th className="text-right pb-4 font-medium text-xs uppercase tracking-wider">Avg. Price</th>
              <th className="text-right pb-4 font-medium text-xs uppercase tracking-wider">Market Price</th>
              <th className="text-right pb-4 font-medium text-xs uppercase tracking-wider">Total P&L</th>
              <th className="text-right pb-4 font-medium text-xs uppercase tracking-wider">% Change</th>
              <th className="pb-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredPositions.map((pos) => (
              <PositionRow key={pos.symbol} position={pos} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PositionRow({ position: pos }: { position: PositionData }) {
  const up = pos.pnl >= 0;
  return (
    <tr className="group hover:bg-secondary/20 transition-all cursor-pointer">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm ${
            up ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"
          }`}>
            {pos.symbol[0]}
          </div>
          <div>
            <span className="font-bold text-foreground block">{pos.symbol}</span>
            <p className="text-[11px] text-muted-foreground">{pos.name}</p>
          </div>
        </div>
      </td>
      <td className="py-4 text-right">
        <span className="font-mono text-sm text-foreground">{pos.qty}</span>
      </td>
      <td className="py-4 text-right">
        <span className="font-mono text-sm text-muted-foreground">${pos.avgPrice.toFixed(2)}</span>
      </td>
      <td className="py-4 text-right">
        <span className="font-mono text-sm text-foreground">${pos.currentPrice.toFixed(2)}</span>
      </td>
      <td className="py-4 text-right">
        <div className={`flex flex-col items-end font-mono font-bold ${up ? "text-gain" : "text-loss"}`}>
          <span>{up ? "+" : ""}${pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          <span className="text-[10px] opacity-70 text-muted-foreground">Net Return</span>
        </div>
      </td>
      <td className="py-4 text-right">
        <span className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-full ${
          up ? "bg-gain/10 text-gain shadow-sm" : "bg-loss/10 text-loss shadow-sm"
        }`}>
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {up ? "+" : ""}{pos.pnlPercent.toFixed(2)}%
        </span>
      </td>
      <td className="py-4 text-right">
        <button className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
