import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ArrowRightLeft, Bell } from "lucide-react";

interface Activity {
  id: string;
  type: "trade" | "alert" | "gain" | "loss";
  message: string;
  time: string;
  value?: string;
}

const ACTIVITIES: Activity[] = [
  { id: "1", type: "trade", message: "BUY 50 NVDA @ $495.22", time: "2m ago", value: "+$24,761" },
  { id: "2", type: "gain", message: "AAPL up 1.23% today", time: "5m ago", value: "+$2,601" },
  { id: "3", type: "alert", message: "TSLA hit target $240", time: "12m ago" },
  { id: "4", type: "loss", message: "META down 0.58%", time: "18m ago", value: "-$334" },
  { id: "5", type: "trade", message: "SELL 30 JPM @ $172.88", time: "25m ago", value: "+$530" },
];

const ICONS = {
  trade: ArrowRightLeft,
  alert: Bell,
  gain: TrendingUp,
  loss: TrendingDown,
};

const COLORS = {
  trade: "text-primary bg-primary/10",
  alert: "text-yellow-400 bg-yellow-400/10",
  gain: "text-gain bg-gain/10",
  loss: "text-loss bg-loss/10",
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState(ACTIVITIES);

  useEffect(() => {
    const interval = setInterval(() => {
      const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN"];
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const isGain = Math.random() > 0.4;
      const pct = (Math.random() * 3).toFixed(2);
      const val = Math.round(Math.random() * 2000 + 200);
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: isGain ? "gain" : "loss",
        message: `${sym} ${isGain ? "up" : "down"} ${pct}%`,
        time: "just now",
        value: `${isGain ? "+" : "-"}$${val}`,
      };
      setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-5 animate-fade-in-up">
      <h3 className="text-sm font-semibold text-foreground mb-3">Live Activity</h3>
      <div className="space-y-1.5">
        {activities.map((a) => {
          const Icon = ICONS[a.type];
          return (
            <div key={a.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent/20 transition-all">
              <div className={`p-1.5 rounded-md ${COLORS[a.type]}`}>
                <Icon className="h-3 w-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-foreground truncate">{a.message}</p>
                <p className="text-[9px] text-muted-foreground">{a.time}</p>
              </div>
              {a.value && (
                <span className={`text-[10px] font-mono font-semibold ${a.value.startsWith("+") ? "text-gain" : "text-loss"}`}>
                  {a.value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
