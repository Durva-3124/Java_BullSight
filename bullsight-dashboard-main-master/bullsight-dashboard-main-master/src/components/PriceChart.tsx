import React, { useMemo } from "react";
import {
  PieChart as RePie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";

// Data matching the trading theme
const data = [
  { name: "Bitcoin", value: 45, color: "#60a5fa" }, // Neon Blue
  { name: "Ethereum", value: 25, color: "#22c55e" }, // Neon Green
  { name: "Solana", value: 20, color: "#8b5cf6" }, // Purple
  { name: "Other", value: 10, color: "#ef4444" },  // Neon Red
];

const ActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      {/* Outer glow effect for active sector */}
      <filter id="active-glow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        filter="url(#active-glow)"
      />
    </g>
  );
};

export default function PieChart() {
  const totalValue = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), []);

  return (
    <div 
      className="glass-card p-6 h-full flex flex-col relative overflow-hidden"
      style={{ background: "radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)" }}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="z-10 mb-4">
        <h3 className="text-sm font-black tracking-widest text-white/70 uppercase">Asset Allocation</h3>
      </div>

      <div className="flex-1 min-h-[300px] z-10 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RePie>
            <defs>
              {data.map((entry, index) => (
                <filter key={`glow-${index}`} id={`filter-${index}`}>
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={entry.color} />
                </filter>
              ))}
            </defs>
            
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              activeShape={<ActiveShape />}
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  filter={`url(#filter-${index})`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900/90 border border-white/10 p-2 rounded shadow-2xl backdrop-blur-md">
                      <p className="text-[10px] font-mono text-white">
                        {payload[0].name}: <span className="font-bold">{payload[0].value}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RePie>
        </ResponsiveContainer>

        {/* Center Text (Total) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
          <p className="text-[10px] uppercase font-bold text-white/40 tracking-tighter">Total Assets</p>
          <p className="text-2xl font-black text-white font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            100%
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 z-10">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
            <span className="text-[10px] font-mono text-white/70">{item.name}</span>
            <span className="text-[10px] font-mono text-white ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}