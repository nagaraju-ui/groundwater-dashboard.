import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import CommandBar from "./components/layout/CommandBar";
import RiskMap from "./components/RiskMap";
import Dashboard from "./components/Dashboard";
import { generateSimulatedData, generateSingleVillage, type VillageData } from "./utils/dataSimulator";
import { ShieldAlert } from "lucide-react";

import InsightsPanel from "./components/analytics/InsightsPanel";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"map" | "analytics" | "alerts">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillage, setSelectedVillage] = useState<VillageData | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "data">("map");
  
  const allVillages = useMemo(() => generateSimulatedData(2500), []);
  const [filteredVillages, setFilteredVillages] = useState<VillageData[]>(allVillages);

  // Auto search and navigation logic with real Nominatim Geocoding
  useEffect(() => {
    if (!searchQuery) {
      setFilteredVillages(allVillages);
      setSelectedVillage(null);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allVillages.filter(v => 
      v.name.toLowerCase().includes(query) || 
      v.district.toLowerCase().includes(query)
    );

    if (results.length > 0) {
      setFilteredVillages(results);
      if (query.length >= 3) {
        setSelectedVillage(results[0]);
      }
    } else if (query.length >= 3) {
      // Async geocoding fetch for unknown places
      const debounceTimeout = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=1`, {
            headers: { "Accept-Language": "en-US,en;q=0.9" }
          });
          const data = await res.json();
          if (data && data.length > 0) {
            const loc = data[0];
            const CapitalizedName = query.charAt(0).toUpperCase() + query.slice(1);
            const mockResult = generateSingleVillage(
              `${CapitalizedName} Central`,
              CapitalizedName,
              "India",
              parseFloat(loc.lat),
              parseFloat(loc.lon)
            );
            setFilteredVillages([mockResult]);
            setSelectedVillage(mockResult);
          } else {
             setFilteredVillages([]);
             setSelectedVillage(null);
          }
        } catch (err) {
          console.error("Geocoding failed", err);
        }
      }, 600); // 600ms debounce
      return () => clearTimeout(debounceTimeout);
    } else {
      setFilteredVillages([]);
      setSelectedVillage(null);
    }
  }, [searchQuery, allVillages]);

  const handleNearMe = () => {
    // Pick a random village or specific village to simulate "near me"
    const randomIdx = Math.floor(Math.random() * allVillages.length);
    setSelectedVillage(allVillages[randomIdx]);
  };

  return (
    <div className="flex h-screen w-screen bg-[#020617] overflow-hidden font-sans text-slate-200">
      {/* 1. Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 2. Main Area (Full Width Map with Overlays) */}
      <main className="flex-1 ml-[72px] relative w-full h-full">
        
        {/* Background Map layer spanning entirely */}
        {activeTab === 'analytics' ? (
           <InsightsPanel village={selectedVillage} nationalVillages={allVillages} />
        ) : activeTab === 'alerts' ? (
           <div className="flex h-full items-center justify-center p-8 text-slate-500 font-bold uppercase tracking-widest bg-brand-navy">Alerts module under maintenance</div>
        ) : (
          <RiskMap 
            villages={filteredVillages} 
            selectedVillage={selectedVillage} 
            onVillageSelect={setSelectedVillage} 
          />
        )}

        {/* Floating Search Bar (Top Centered below Alert) */}
        <CommandBar 
          onSearch={setSearchQuery} 
          onNearMe={handleNearMe} 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />

        {/* Alert Banner (Top Centered) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-3xl px-4">
           <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 pl-4 pr-12 py-3 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_#ef444440] animate-pulse">
             <ShieldAlert className="text-red-400 shrink-0" size={18} />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/90 text-center">
               Alert: 1259 Villages in 17 states analyzed. National Groundwater depletion at 0.8m/yr.
             </span>
             <button className="absolute right-4 text-white/50 hover:text-white top-1/2 -translate-y-1/2">
                &times;
             </button>
           </div>
        </div>

        {/* Dashboard Overlay (Conditional mapping to side view) */}
        {selectedVillage && (
          <Dashboard 
            village={selectedVillage} 
            onClose={() => setSelectedVillage(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
