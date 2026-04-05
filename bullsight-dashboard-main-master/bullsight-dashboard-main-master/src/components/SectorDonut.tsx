import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { generateSectorData } from "@/hooks/useSimulatedData";
import { useMemo } from "react";

export default function SectorDonut() {
  const data = useMemo(() => generateSectorData(), []);
  const totalAlloc = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass-card p-5 animate-fade-in-up h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Sector Allocation</h3>
        <span className="font-mono text-lg font-bold neon-text">{totalAlloc}%</span>
      </div>
      <div className="h-44 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {data.map((d, i) => (
                <linearGradient key={i} id={`sector-${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={d.color} stopOpacity={0.5} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={`url(#sector-${i})`} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(232 35% 8% / 0.95)",
                border: "1px solid hsl(270 40% 25% / 0.5)",
                borderRadius: "10px",
                fontSize: "11px",
              }}
              formatter={(v: number, name: string) => [`${v}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-1">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            <span className="text-[10px] text-muted-foreground">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
