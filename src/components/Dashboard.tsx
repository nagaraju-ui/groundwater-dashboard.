
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import type { VillageData } from '../utils/dataSimulator';
import EarlyWarningPanel from './EarlyWarningPanel';
import { 
  Droplets, MapPin, ArrowDownRight
} from 'lucide-react';

interface DashboardProps {
  village: VillageData;
  onClose: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ village, onClose }) => {
  // Past 2 years (24 months) data processing
  const trendData = village.historicalTrend.map((val, i) => {
    // Generate some mock anomaly/rainfall from the depth value for visual consistency
    const cyclicVal = Math.sin((i / 12) * Math.PI * 2);
    return {
      month: i,
      level: val,
      anomaly: cyclicVal * 5 + (Math.random() - 0.5) * 2,
      rainfall: Math.max(0, (cyclicVal > 0 ? cyclicVal : 0) * 150 + Math.random() * 50)
    };
  }).slice(-24);

  const riskData = [
    { name: 'Depletion', value: village.riskScore * 0.35 },
    { name: 'Extraction', value: village.extractionScore * 0.30 },
    { name: 'Monsoon', value: Math.max(0, 40 - village.riskScore * 0.2) },
    { name: 'Recharge', value: (100 - village.extractionScore) * 0.15 }
  ];

  const pieColors = ['#ef4444', '#f97316', '#3b82f6', '#14b8a6'];

  return (
    <div className="fixed inset-y-0 right-0 w-[550px] max-w-full bg-[#020617]/95 backdrop-blur-3xl border-l border-white/5 z-[2000] overflow-y-auto p-6 md:p-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500 ease-out block pt-16">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-2 text-teal-400 mb-2 cursor-pointer hover:underline transition-all hover:text-cyan-300" onClick={onClose}>
            <MapPin size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{village.district}, {village.state}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">{village.name}</h1>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10 mt-1"
        >
          <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white/5 border border-white/5 p-5 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-red-500/30 transition-all">
          <span className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest">Risk Forecast</span>
          <div className={`text-2xl font-black uppercase tracking-tighter ${
            village.riskLevel === 'Critical' ? 'text-red-500' : 
            village.riskLevel === 'High' ? 'text-orange-500' : 'text-yellow-500'
          }`}>
            {village.riskLevel}
          </div>
          <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-wider">{Math.min(99, 45 + village.riskScore * 0.5).toFixed(0)}% Probability</span>
        </div>
        <div className="bg-white/5 py-5 px-3 rounded-3xl flex flex-col items-center justify-center text-center border border-white/5 border-l-4 border-l-cyan-400">
          <span className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest">Depletion Rate</span>
          <div className="text-2xl font-black text-white flex items-center gap-1 tracking-tighter">
            {village.depletionRate}m <ArrowDownRight className="text-red-400" size={16} />
          </div>
          <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-wider">Per Year (Avg)</span>
        </div>
        <div className="bg-white/5 py-5 px-3 rounded-3xl flex flex-col items-center justify-center text-center border border-white/5 border-l-4 border-l-orange-400">
          <span className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest">Extraction</span>
          <div className="text-2xl font-black text-white tracking-tighter">
            {village.extractionScore}
          </div>
          <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-wider">Level Index</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="space-y-6">
        {/* Groundwater Level Curve */}
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
              <Droplets className="text-cyan-400" size={16} />
              Water Level Trend (24 Mo)
            </h3>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Depth(m)</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" hide />
                <YAxis reversed domain={['dataMin - 1', 'dataMax + 1']} stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="level" stroke="#22d3ee" strokeWidth={3} fill="url(#colorLevel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Decomposition and Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
             <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-6">Risk Factors</h3>
             <div className="h-32 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                      {riskData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4">Regional Profile</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Crop</span>
                <span className="text-xs font-black text-white">{village.cropType}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Soil Type</span>
                <span className="text-xs font-black text-white">{village.soilType}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recharge</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-teal-400">{Math.max(0, 100 - village.extractionScore)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Early Warning Actions */}
        <div className="pt-2">
           <EarlyWarningPanel village={village} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
