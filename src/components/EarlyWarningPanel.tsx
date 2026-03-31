
import React, { useState } from 'react';
import { ShieldAlert, Droplets, Wheat, Sprout, Building2, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import type { VillageData } from '../utils/dataSimulator';

interface EarlyWarningPanelProps {
  village: VillageData;
}

const EarlyWarningPanel: React.FC<EarlyWarningPanelProps> = ({ village }) => {
  const [expandedAction, setExpandedAction] = useState<number | null>(null);
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null);
  
  // Execution flow states
  const [executingActions, setExecutingActions] = useState<Record<number, boolean>>({});
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const [executingSchemes, setExecutingSchemes] = useState<Record<number, boolean>>({});
  const [completedSchemes, setCompletedSchemes] = useState<Record<number, boolean>>({});

  const handleExecuteAction = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (completedActions[index] || executingActions[index]) return;
    
    setExecutingActions(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setExecutingActions(prev => ({ ...prev, [index]: false }));
      setCompletedActions(prev => ({ ...prev, [index]: true }));
    }, 1500);
  };

  const handleExecuteScheme = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (completedSchemes[index] || executingSchemes[index]) return;
    
    setExecutingSchemes(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setExecutingSchemes(prev => ({ ...prev, [index]: false }));
      setCompletedSchemes(prev => ({ ...prev, [index]: true }));
    }, 2000);
  };

  const districtBaseline = Math.max(20, village.extractionScore * 0.85); // Simulated baseline
  const aboveEnvelope = (village.extractionScore / districtBaseline).toFixed(1);

  // Dynamic Actions
  interface ActionData {
    title: string;
    desc: string;
    icon: React.ReactNode;
    impact: string;
    budget: string;
    time: string;
  }
  
  const actions: ActionData[] = [];
  
  if (village.cropType.toLowerCase().includes('paddy') || village.cropType.toLowerCase().includes('sugarcane')) {
    actions.push({
      title: "Crop Diversification",
      desc: `Switch from ${village.cropType} to Millet/Pulses for the upcoming season to reduce extraction by 40%.`,
      icon: <Wheat className="text-brand-orange" size={24} />,
      impact: "High Impact",
      budget: "₹15,000 / ha",
      time: "Pre-Monsoon"
    });
  } else {
    actions.push({
      title: "Drought-Resistant Seeds",
      desc: `Provision drought-resistant variants of ${village.cropType} to withstand moisture stress.`,
      icon: <Wheat className="text-brand-yellow" size={24} />,
      impact: "Yield Protection",
      budget: "₹5,000 / ha",
      time: "Sowing Phase"
    });
  }

  if (village.extractionScore > 60) {
    actions.push({
      title: "Micro-Irrigation Setup",
      desc: "Install drip irrigation system. Eligible for up to 80% subsidy under state schemes.",
      icon: <Sprout className="text-brand-teal" size={24} />,
      impact: "Reduced Waste",
      budget: "₹85,000 / unit",
      time: "2-4 Weeks"
    });
  }

  if (village.riskLevel === 'Critical' || village.riskLevel === 'High') {
    actions.push({
      title: "Check-Dam Restoration",
      desc: "Restore local percolation tanks before monsoon to increase recharge potential.",
      icon: <Droplets className="text-blue-400" size={24} />,
      impact: "Recharge Boost",
      budget: "₹4.5 Lakhs",
      time: "3 Months"
    });
  }

  // Dynamic Schemes
  const schemes: string[] = ["Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)"];
  if (village.extractionScore > 65) schemes.push("Atal Bhujal Yojana (ABY) - Community Wells");
  if (village.cropType.toLowerCase().includes('paddy') || village.cropType.toLowerCase().includes('sugarcane')) schemes.push("National Mission on Sustainable Agriculture (NMSA)");
  if (village.riskLevel === 'Critical') schemes.push("Emergency Drought Relief Fund");

  return (
    <div className="space-y-10">
      {/* Alert Banner - More Dramatic */}
      {village.riskLevel === 'Critical' && (
        <div className="bg-brand-red/10 border border-brand-red/30 p-6 rounded-[2rem] flex items-start gap-6 animate-pulse">
          <div className="p-3 bg-brand-red/20 rounded-2xl">
            <ShieldAlert className="text-brand-red" size={28} />
          </div>
          <div>
            <h4 className="text-brand-red font-black uppercase text-[10px] tracking-[0.2em] mb-1">Critical Early Warning</h4>
            <p className="text-sm text-white/80 font-medium leading-relaxed">Local borewell dry-out probability exceeds 85% for next 2 seasons. Immediate extraction suspension or crop switching is highly recommended by District Water Boards.</p>
          </div>
        </div>
      )}

      {/* Comparison Tool - Refined */}
      <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-8 flex items-center gap-3">
          <MapPin className="text-teal-400" size={14} />
          Regional Benchmarking
        </h3>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-bold text-white/60 uppercase group-hover:text-white transition-colors">Village Extraction Intensity</span>
              <span className="text-sm font-black text-white">{village.extractionScore.toFixed(1)} kl/day</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-brand-orange shadow-[0_0_10px_#f9731666]" style={{ width: `${village.extractionScore}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline opacity-40">
              <span className="text-[10px] font-bold uppercase">District Cluster Baseline</span>
              <span className="text-sm font-black">{districtBaseline.toFixed(1)} kl/day</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white/20" style={{ width: `${Math.min(100, districtBaseline)}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-center mt-4">
             Result: <span className="text-brand-orange">{aboveEnvelope}x Above Regional Safety Envelope</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.25em] mb-4">Strategic Interventions</h3>
        <div className="grid grid-cols-1 gap-4">
          {actions.map((action, i) => (
            <div 
              key={i} 
              onClick={() => setExpandedAction(expandedAction === i ? null : i)}
              className="glass-panel group p-6 rounded-[2rem] flex flex-col gap-4 hover:border-teal-400/30 transition-all border border-transparent cursor-pointer"
            >
              <div className="flex items-start gap-6 w-full">
                <div className="p-4 bg-white/5 rounded-[1.5rem] group-hover:bg-teal-400/10 transition-colors">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-black text-white text-sm uppercase tracking-tight">{action.title}</h4>
                    <span className="text-[8px] bg-white/10 px-2 py-1 rounded-full uppercase font-black text-teal-400 tracking-widest border border-white/5">{action.impact}</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">{action.desc}</p>
                </div>
                {expandedAction === i ? (
                  <ChevronDown className="text-teal-400 transition-colors self-center shrink-0" size={20} />
                ) : (
                  <ChevronRight className="text-white/10 group-hover:text-teal-400 transition-colors self-center shrink-0" size={20} />
                )}
              </div>
              
              {expandedAction === i && (
                <div className="mt-2 pt-4 border-t border-white/5 w-full animate-in slide-in-from-top-2 fade-in duration-300">
                   <div className="bg-black/20 rounded-2xl p-4 flex flex-col gap-3">
                     <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Estimated Budget: <span className="text-white">{action.budget}</span></p>
                     <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Implementation: <span className="text-white">{action.time}</span></p>
                     {completedActions[i] ? (
                       <button 
                         onClick={(e) => e.stopPropagation()}
                         className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-[0.2em] rounded-xl border border-green-500/30 cursor-default"
                       >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                         Intervention Activated
                       </button>
                     ) : (
                       <button 
                         onClick={(e) => handleExecuteAction(e, i)}
                         disabled={executingActions[i]}
                         className={`mt-2 w-full py-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all border flex items-center justify-center gap-2 ${
                           executingActions[i] 
                             ? 'bg-teal-500/5 text-teal-400/50 border-teal-500/10 cursor-wait'
                             : 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border-teal-500/30 hover:border-teal-400'
                         }`}
                       >
                         {executingActions[i] ? (
                           <>
                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                             Processing...
                           </>
                         ) : 'Initiate Intervention'}
                       </button>
                     )}
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Govt Schemes - Premium List */}
      <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 border-l-brand-teal border-l-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-8 flex items-center gap-3">
          <Building2 className="text-teal-400" size={14} />
          Scheme Eligibility Engine
        </h3>
        <ul className="space-y-4">
          {schemes.map((scheme, i) => (
            <li 
              key={i} 
              onClick={() => setExpandedScheme(expandedScheme === i ? null : i)}
              className="flex flex-col bg-white/5 p-4 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{scheme}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-teal-400 bg-teal-400/10 px-2 py-1 rounded-full border border-teal-400/20">Eligible</span>
                  {expandedScheme === i ? (
                    <ChevronDown className="text-teal-400 ml-2" size={14} />
                  ) : (
                    <ChevronRight className="text-white/20 group-hover:text-teal-400 ml-2" size={14} />
                  )}
                </div>
              </div>
              
              {expandedScheme === i && (
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1">
                  <p className="text-[10px] text-white/50 leading-relaxed font-medium">Verify farmers documentation and generate the digital submission packet for rapid approval.</p>
                  {completedSchemes[i] ? (
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="py-2.5 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-500/20 flex items-center justify-center gap-1.5 cursor-default mt-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      Application Approved
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => handleExecuteScheme(e, i)}
                      disabled={executingSchemes[i]}
                      className={`py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 mt-1 border ${
                        executingSchemes[i]
                          ? 'bg-white/5 border-transparent text-white/30 cursor-wait'
                          : 'bg-white/5 hover:bg-white/10 text-white/90 border-transparent hover:border-white/10'
                      }`}
                    >
                      {executingSchemes[i] ? (
                         <>
                           <svg className="animate-spin h-3.5 w-3.5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           Generating Packet...
                         </>
                      ) : 'Process Application'}
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EarlyWarningPanel;
