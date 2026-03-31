
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { VillageData, RiskLevel } from '../utils/dataSimulator';

interface RiskMapProps {
  villages: VillageData[];
  selectedVillage: VillageData | null;
  onVillageSelect: (village: VillageData) => void;
}

const getMarkerIcon = (risk: RiskLevel) => {
  const colors = {
    Critical: '#ef4444',
    High: '#f97316',
    Moderate: '#eab308',
    Safe: '#22c55e'
  };

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${colors[risk]}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 15px ${colors[risk]}66; transition: all 0.3s ease;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const RiskMap: React.FC<RiskMapProps> = ({ villages, selectedVillage, onVillageSelect }) => {
  const center: [number, number] = selectedVillage 
    ? [selectedVillage.lat, selectedVillage.lng] 
    : [22.0, 78.0];

  const zoom = selectedVillage ? 9 : 5;

  return (
    <div className="w-full h-screen relative bg-brand-blue">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        preferCanvas={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CARTODB'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {selectedVillage && <ChangeView center={[selectedVillage.lat, selectedVillage.lng]} zoom={zoom} />}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={40}
          showCoverageOnHover={false}
          disableClusteringAtZoom={10}
        >
          {villages.map((village) => (
            <Marker 
              key={village.id} 
              position={[village.lat, village.lng]}
              icon={getMarkerIcon(village.riskLevel)}
              eventHandlers={{
                click: () => onVillageSelect(village),
              }}
            >
              <Popup className="premium-popup">
                <div className="p-1 min-w-[160px]">
                  <h3 className="font-black text-xs uppercase tracking-tighter mb-1">{village.name}</h3>
                  <p className="text-[9px] text-white/40 mb-3 tracking-widest font-bold uppercase">{village.district}, {village.state}</p>
                  
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] font-black text-white/30 uppercase">Risk Level</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      village.riskLevel === 'Critical' ? 'text-brand-red' : 
                      village.riskLevel === 'High' ? 'text-brand-orange' :
                      village.riskLevel === 'Moderate' ? 'text-brand-yellow' : 'text-brand-green'
                    }`}>
                      {village.riskLevel}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Floating National Risk Legend */}
      <div className="absolute bottom-12 left-12 z-[1000] glass-dark bg-surface-bg/80 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h4 className="text-[9px] font-black text-white/40 mb-5 uppercase tracking-[0.25em]">National Risk Intensity</h4>
        <div className="space-y-4">
          {[
            { level: 'Critical', label: 'Dry-out < 1 Season', color: 'bg-brand-red', shadow: 'shadow-[0_0_10px_#ef4444]' },
            { level: 'High', label: 'Dry-out < 2 Seasons', color: 'bg-brand-orange', shadow: 'shadow-[0_0_10px_#f97316]' },
            { level: 'Moderate', label: 'Trend: Declining', color: 'bg-brand-yellow', shadow: 'shadow-[0_0_10px_#eab308]' },
            { level: 'Safe', label: 'Resource Stable', color: 'bg-brand-green', shadow: 'shadow-[0_0_10px_#22c55e]' },
          ].map((item) => (
            <div key={item.level} className="flex items-center gap-4 group cursor-help">
              <div className={`w-3 h-3 rounded-full ${item.color} ${item.shadow} group-hover:scale-125 transition-transform`} />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-white uppercase tracking-wider leading-none mb-0.5">{item.level}</span>
                 <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskMap;
