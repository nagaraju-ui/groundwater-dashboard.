import React from "react";
import { Search, Crosshair } from "lucide-react";
const CommandBar: React.FC<{ onSearch: (v: string) => void, onNearMe: () => void, viewMode: string, onViewModeChange: (v: any) => void }> = ({ onSearch, onNearMe, viewMode, onViewModeChange }) => (
  <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] w-[600px]">
    <div className="bg-[#020617]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 shadow-2xl flex items-center gap-2">
      <div className="flex-1 flex items-center gap-4 px-4">
        <Search size={18} className="text-slate-500" />
        <input type="text" onChange={(e) => onSearch(e.target.value)} placeholder="Search village, district, or coordinates..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600" />
      </div>
      <div className="h-8 w-px bg-white/5 mx-2" />
      <div className="flex items-center gap-1">
        <button onClick={onNearMe} className="p-2.5 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all"><Crosshair size={18} /></button>
        <button onClick={() => onViewModeChange(viewMode === "map" ? "data" : "map")} className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "map" ? "bg-cyan-400 text-[#020617]" : "text-slate-400 hover:text-white"}`}>{viewMode}</button>
      </div>
    </div>
  </div>
);
export default CommandBar;
