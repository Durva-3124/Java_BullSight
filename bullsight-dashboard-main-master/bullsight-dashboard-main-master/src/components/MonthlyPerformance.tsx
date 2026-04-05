import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { generateMonthlyPerformance } from "@/hooks/useSimulatedData";
import { useMemo } from "react";

export default function MonthlyPerformance() {
  const data = useMemo(() => generateMonthlyPerformance(), []);

  return (
    <div className="glass-card p-5 animate-fade-in-up h-full">
      <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Performance</h3>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={16}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4c1d95" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="barGradCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0e7490" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 8, fill: "hsl(230 15% 50%)", fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 8, fill: "hsl(230 15% 50%)", fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(232 35% 8% / 0.95)",
                border: "1px solid hsl(270 40% 25% / 0.5)",
                borderRadius: "10px",
                fontSize: "11px",
                fontFamily: "JetBrains Mono",
              }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.gain >= 0 ? "url(#barGrad)" : "url(#barGradCyan)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
