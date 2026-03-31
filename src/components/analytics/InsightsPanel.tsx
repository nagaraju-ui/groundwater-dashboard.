import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, AlertCircle, Droplets, MapPin } from "lucide-react";
import type { VillageData } from "../../utils/dataSimulator";

const InsightsPanel: React.FC<{ village: VillageData | null, nationalVillages: VillageData[] }> = ({ village, nationalVillages }) => {
  const chartData = useMemo(() => {
    if (!village) return [];
    return village.historicalTrend.map((v, i) => ({ name: `M${i}`, value: v }));
  }, [village]);

  if (!village) return <div className="h-full flex flex-col items-center justify-center p-12 text-slate-500"><MapPin className="w-12 h-12 mb-4 opacity-20" />Select a region</div>;

  return (
    <div className="h-full flex flex-col p-8 bg-[#020617]">
      <h2 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-1">{village.district}</h2>
      <h1 className="text-3xl font-black text-white mb-8">{village.name}</h1>
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Depth</p>
          <p className="text-2xl font-black text-white">{village.historicalTrend[village.historicalTrend.length - 1]}m</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Depletion</p>
          <p className="text-2xl font-black text-red-400">-{village.depletionRate}m/y</p>
        </div>
      </div>
      <div className="h-64 mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" hide />
            <YAxis reversed hide />
            <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="rgba(34,211,238,0.1)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default InsightsPanel;
