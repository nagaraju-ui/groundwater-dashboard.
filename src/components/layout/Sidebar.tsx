import React from "react";
import { Map, BarChart3, AlertTriangle, Settings } from "lucide-react";
const Sidebar: React.FC<{ activeTab: string, onTabChange: (t: any) => void }> = ({ activeTab, onTabChange }) => (
  <aside className="fixed left-0 top-0 bottom-0 w-[72px] bg-[#020617] border-r border-white/5 flex flex-col items-center py-8 z-[100]">
    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-12 border border-cyan-400/20">
      <div className="w-4 h-4 bg-cyan-400 rounded-sm animate-pulse" />
    </div>
    <nav className="flex-1 flex flex-col gap-8">
      {[ { id: "map", icon: Map }, { id: "analytics", icon: BarChart3 }, { id: "alerts", icon: AlertTriangle } ].map(item => (
        <button key={item.id} onClick={() => onTabChange(item.id)} className={`p-3 rounded-xl transition-all ${activeTab === item.id ? "bg-white/10 text-cyan-400 ring-1 ring-white/20" : "text-slate-500 hover:text-slate-300"}`}>
          <item.icon size={20} />
        </button>
      ))}
    </nav>
    <div className="flex flex-col gap-6 mt-auto">
      <button className="text-slate-600 hover:text-slate-400 Transition-all"><Settings size={20} /></button>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-500">ADM</div>
    </div>
  </aside>
);
export default Sidebar;
