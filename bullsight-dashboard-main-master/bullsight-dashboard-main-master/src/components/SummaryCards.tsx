import CircularProgress from "./CircularProgress";
import type { PortfolioSummary } from "@/hooks/useSimulatedData";
import { TrendingUp, TrendingDown, Clock, Wallet, Target, PieChart } from "lucide-react";

interface SummaryCardsProps {
  portfolio: PortfolioSummary;
}

export default function SummaryCards({ portfolio }: SummaryCardsProps) {
  const totalTarget = 300000;
  const daysRemaining = 552;
  const totalDays = 1075;
  const budgetUsed = 63;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
      {/* Portfolio Value */}
      <div className="glass-card p-5 flex items-center gap-4 group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
        <div className="relative">
          <CircularProgress
            value={portfolio.totalValue}
            max={totalTarget}
            size={80}
            strokeWidth={6}
            gradientId="portfolio-grad"
            colorStart="#8b5cf6"
            colorEnd="#06b6d4"
            label=""
            displayValue={`${Math.round((portfolio.totalValue / totalTarget) * 100)}%`}
          />
          <Wallet className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
        </div>
        <div>
          <p className="font-mono text-2xl font-bold text-foreground group-hover:neon-text transition-all">
            ${(portfolio.totalValue / 1000).toFixed(0)}K
          </p>
          <div className="flex items-center gap-1.5">
            <Target className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Portfolio Value</p>
          </div>
          <p className="text-[10px] font-mono text-gain mt-1 flex items-center gap-1">
            <TrendingUp className="h-2.5 w-2.5" />
            Target: ${(totalTarget / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Trading Days */}
      <div className="glass-card p-5 flex items-center gap-4 group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
        <div className="relative">
          <CircularProgress
            value={totalDays - daysRemaining}
            max={totalDays}
            size={80}
            strokeWidth={6}
            gradientId="days-grad"
            colorStart="#06b6d4"
            colorEnd="#8b5cf6"
            label=""
            displayValue={`${Math.round(((totalDays - daysRemaining) / totalDays) * 100)}%`}
          />
          <Clock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
        </div>
        <div>
          <p className="font-mono text-2xl font-bold text-foreground group-hover:neon-text transition-all">
            {daysRemaining}<span className="text-base text-muted-foreground ml-1 font-normal">Days</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Time Remaining</p>
          </div>
        </div>
      </div>

      {/* P&L Summary */}
      <div className="glass-card p-5 group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3" /> Total P&L
          </p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${portfolio.totalPnlPercent >= 0 ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"}`}>
            {portfolio.totalPnlPercent >= 0 ? "+" : ""}{portfolio.totalPnlPercent}%
          </span>
        </div>
        <p className="font-mono text-2xl font-bold neon-text group-hover:scale-105 transition-transform origin-left">
          ${portfolio.totalPnl > 0 ? "+" : ""}{portfolio.totalPnl.toLocaleString()}
        </p>
        <div className="flex items-center justify-between mt-3 bg-secondary/20 rounded-lg px-3 py-1.5">
          <span className="text-[10px] text-muted-foreground">Day Change</span>
          <span className={`font-mono text-sm font-bold flex items-center gap-1 ${portfolio.dayChange >= 0 ? "text-gain" : "text-loss"}`}>
            {portfolio.dayChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {portfolio.dayChange >= 0 ? "+" : ""}${portfolio.dayChange.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Budget Ring */}
      <div className="glass-card p-5 flex items-center justify-center group hover:scale-[1.02] transition-transform duration-300 cursor-pointer relative overflow-hidden">
        <div className="absolute -right-4 -top-4 h-16 w-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
        <CircularProgress
          value={budgetUsed}
          max={100}
          size={100}
          strokeWidth={8}
          gradientId="budget-grad"
          colorStart="#f472b6"
          colorEnd="#8b5cf6"
          label="Budget Utilized"
          displayValue={`${budgetUsed}%`}
        />
        <PieChart className="absolute bottom-4 right-4 h-4 w-4 text-primary/20 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
