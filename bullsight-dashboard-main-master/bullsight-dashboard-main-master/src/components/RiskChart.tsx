import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { generateRiskData } from "@/hooks/useSimulatedData";
import { useMemo } from "react";

export default function RiskChart() {
  const data = useMemo(() => generateRiskData(), []);

  return (
    <div className="glass-card p-5 animate-fade-in-up h-full">
      <h3 className="text-sm font-semibold text-foreground mb-4">Probability of Risk</h3>
      <div className="flex justify-center gap-6 mb-3">
        {data.map((d) => (
          <span key={d.name} className="text-[10px] font-mono text-muted-foreground">
            {d.value}%
          </span>
        ))}
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={24}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "hsl(230 15% 50%)", fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "hsl(232 35% 8% / 0.95)",
                border: "1px solid hsl(270 40% 25% / 0.5)",
                borderRadius: "10px",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill="url(#riskGrad)" opacity={0.6 + (i * 0.1)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
