
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import type { VillageData, RiskLevel } from '../utils/dataSimulator';
import { FileText, TrendingDown, ArrowRight, Filter, SortAsc } from 'lucide-react';

interface DistrictOverviewProps {
  villages: VillageData[];
  onVillageSelect: (village: VillageData) => void;
}

const DistrictOverview: React.FC<DistrictOverviewProps> = ({ villages, onVillageSelect }) => {
  const sortedVillages = [...villages].sort((a, b) => b.riskScore - a.riskScore);
  
  const districtStats = {
    avgRisk: Math.round(villages.reduce((acc, v) => acc + v.riskScore, 0) / villages.length),
    criticalCount: villages.filter(v => v.riskLevel === 'Critical').length,
    highCount: villages.filter(v => v.riskLevel === 'High').length,
  };

  const barData = sortedVillages.slice(0, 8).map(v => ({
    name: v.name.split(' ')[0],
    score: v.riskScore,
    level: v.riskLevel
  }));

  const getColor = (level: RiskLevel) => {
    switch(level) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f97316';
      case 'Moderate': return '#eab308';
      default: return '#22c55e';
    }
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">District Master View</h1>
          <p className="text-white/40 text-sm">Aggregated early warning data across all mandals and panchayats.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
          <FileText size={16} />
          Full District Report (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl border-l-4 border-brand-red">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Critical Villages</span>
          <div className="text-4xl font-bold text-white mt-2">{districtStats.criticalCount}</div>
          <p className="text-xs text-white/30 mt-2">Requires immediate policy intervention.</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-brand-yellow">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Average Risk Score</span>
          <div className="text-4xl font-bold text-white mt-2">{districtStats.avgRisk}</div>
          <p className="text-xs text-white/30 mt-2">Historical trend: <span className="text-red-400">+12% vs last decade</span></p>
        </div>
        <div className="glass p-6 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Projected Depletion</span>
          <div className="text-4xl font-bold text-white mt-2">0.82m/yr</div>
          <p className="text-xs text-white/30 mt-2 flex items-center gap-1">
             <TrendingDown size={12} className="text-red-400" />
             Accelerating trend across 14 clusters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 text-white tracking-tight">Top 8 Villages at Risk</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} stroke="#ffffff60" fontSize={12} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                <Bar dataKey="score">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.level as RiskLevel)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-lg font-bold text-white tracking-tight">Risk Leaderboard</h3>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40"><Filter size={16} /></button>
              <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40"><SortAsc size={16} /></button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[300px] flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-white/30 tracking-widest bg-white/2">
                  <th className="px-6 py-3">Village Name</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedVillages.slice(0, 15).map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => onVillageSelect(v)}>
                    <td className="px-6 py-4 font-medium text-sm text-white/80">{v.name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white">{v.riskScore}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        v.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                        v.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {v.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <ArrowRight size={14} className="text-white/20 group-hover:text-teal-400 transition-colors inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictOverview;
