import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { VillageData } from "../../utils/dataSimulator";

const createCustomIcon = (riskLevel: string, isSelected: boolean) => {
  const colors: Record<string, string> = {
    Critical: '#ef4444',
    High: '#f97316',
    Moderate: '#eab308',
    Safe: '#22c55e'
  };
  const color = colors[riskLevel] || '#22c55e';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 15px ${color}66; ${isSelected ? `box-shadow: 0 0 25px ${color}; transform: scale(1.3);` : ''} transition: all 0.3s ease;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const GeospatialMap: React.FC<{ villages: VillageData[], selectedVillage: VillageData | null, onSelectVillage: (v: VillageData | null) => void, searchQuery: string }> = ({ villages, selectedVillage, onSelectVillage, searchQuery }) => {
  const filteredVillages = useMemo(() => {
    return villages.filter(v => (!searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.district.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [villages, searchQuery]);

  const center: [number, number] = selectedVillage ? [selectedVillage.lat, selectedVillage.lng] : [20.5937, 78.9629];
  const zoom = selectedVillage ? 9 : 5;

  return (
    <div className="w-full h-full bg-[#020617] rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", background: "#020617" }} zoomControl={false} preferCanvas={true}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        {selectedVillage && <ChangeView center={center} zoom={zoom} />}

        {filteredVillages.map(v => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={createCustomIcon(v.riskLevel, selectedVillage?.id === v.id)} eventHandlers={{ click: () => onSelectVillage(v) }}>
            <Popup className="premium-popup">
              <div className="p-1 min-w-[160px] bg-[#0f172a] text-slate-200">
                <h3 className="font-black text-xs uppercase tracking-tighter mb-1 text-white">{v.name}</h3>
                <p className="text-[9px] text-slate-400 mb-3 tracking-widest font-bold uppercase">{v.district}, {v.state}</p>
                <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Risk Level</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    v.riskLevel === 'Critical' ? 'text-red-400 bg-red-400/10' : 
                    v.riskLevel === 'High' ? 'text-orange-400 bg-orange-400/10' :
                    v.riskLevel === 'Moderate' ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10'
                  }`}>
                    {v.riskLevel}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating National Risk Legend */}
      <div className="absolute bottom-6 flex items-center gap-6 left-6 z-[1000] bg-white/5 backdrop-blur-2xl p-4 rounded-full border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mr-2">Risk Legend</h4>
        {[
          { level: 'Critical', color: 'bg-red-500', shadow: 'shadow-[0_0_10px_#ef4444]' },
          { level: 'High', color: 'bg-orange-500', shadow: 'shadow-[0_0_10px_#f97316]' },
          { level: 'Moderate', color: 'bg-yellow-500', shadow: 'shadow-[0_0_10px_#eab308]' },
          { level: 'Safe', color: 'bg-green-500', shadow: 'shadow-[0_0_10px_#22c55e]' },
        ].map((item) => (
          <div key={item.level} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color} ${item.shadow}`} />
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{item.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GeospatialMap;
