import React from "react";
import { Droplets, TrendingDown, ShieldAlert } from "lucide-react";
const InsightStrip: React.FC<{ insights: any }> = ({ insights }) => (
  <div className="h-12 bg-[#020617] border-b border-white/5 flex items-center px-8 gap-12 overflow-hidden whitespace-nowrap">
    <div className="flex items-center gap-6 animate-marquee">
      { [ { label: "National Critical Villages", value: insights.criticalCount, icon: ShieldAlert, color: "text-red-400" },
          { label: "Avg Depletion Rate", value: `${insights.avgDepletion}m/y`, icon: TrendingDown, color: "text-orange-400" },
          { label: "Water Level Trend", value: "NEUTRAL", icon: Droplets, color: "text-cyan-400" } ].map((item, i) => (
        <div key={i} className="flex items-center gap-2 uppercase tracking-widest text-[9px] font-black">
          <item.icon size={12} className={item.color} />
          <span className="text-slate-500">{item.label}:</span>
          <span className="text-white">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);
export default InsightStrip;
