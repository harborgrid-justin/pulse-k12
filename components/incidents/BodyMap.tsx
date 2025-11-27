
import React, { useState, useRef } from 'react';
import { BodyMarker } from '../../types';
import { Edit3, Trash2, X, Check } from 'lucide-react';

interface BodyMapProps {
  markers: BodyMarker[];
  onChange: (markers: BodyMarker[]) => void;
  readOnly?: boolean;
}

type ViewType = 'FRONT' | 'BACK' | 'HEAD_LEFT' | 'HEAD_RIGHT';

export const BodyMap: React.FC<BodyMapProps> = ({ markers, onChange, readOnly = false }) => {
  const [selectedTool, setSelectedTool] = useState<BodyMarker['type']>('BRUISE');
  const [view, setView] = useState<ViewType>('FRONT');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (selectedMarkerId) {
        // Move existing marker
        const updatedMarkers = markers.map(m => 
            m.id === selectedMarkerId ? { ...m, x, y } : m
        );
        onChange(updatedMarkers);
        return;
    }

    const newMarker: BodyMarker = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      type: selectedTool,
      view: view,
      note: ''
    };

    onChange([...markers, newMarker]);
    setSelectedMarkerId(newMarker.id);
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'BRUISE': return 'bg-purple-600 border-purple-200';
      case 'CUT': return 'bg-red-600 border-red-200';
      case 'SWELLING': return 'bg-amber-500 border-amber-200';
      case 'BURN': return 'bg-orange-600 border-orange-200';
      case 'FRACTURE': return 'bg-blue-600 border-blue-200';
      case 'PAIN': return 'bg-slate-800 border-slate-200';
      default: return 'bg-slate-800 border-slate-200';
    }
  };

  const visibleMarkers = markers.filter(m => m.view === view);
  const selectedMarker = markers.find(m => m.id === selectedMarkerId);

  const ToolSelector = ({ vertical = false }) => (
    <div className={`bg-white p-2 rounded-xl border border-slate-200 shadow-sm ${vertical ? 'w-full' : 'flex gap-2 overflow-x-auto no-scrollbar w-full'}`}>
        <p className="text-xs font-bold text-slate-400 uppercase mb-2 hidden md:block px-1">Injury Type</p>
        <div className={`${vertical ? 'grid grid-cols-2 gap-2' : 'flex gap-2 px-1 min-w-max'}`}>
            {(['BRUISE', 'CUT', 'SWELLING', 'BURN', 'FRACTURE', 'PAIN'] as const).map(type => (
                <button
                key={type}
                onClick={() => setSelectedTool(type)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                    selectedTool === type
                    ? 'bg-primary-50 text-primary-700 border-primary-500 shadow-sm transform scale-105' 
                    : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
                }`}
                >
                <span className={`w-2.5 h-2.5 rounded-full mr-2 shadow-sm ${getMarkerColor(type).split(' ')[0]}`}></span>
                {type}
                </button>
            ))}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full relative">
      
      {/* Mobile: Top Toolbar */}
      {!readOnly && (
          <div className="md:hidden shrink-0">
              <ToolSelector />
          </div>
      )}

      {/* Desktop: Sidebar */}
      {!readOnly && (
        <div className="hidden md:flex w-64 flex-col gap-4 shrink-0">
            <ToolSelector vertical />
            
            {/* Desktop Marker Details Panel */}
            {selectedMarker && (
                <div className="bg-white p-4 rounded-xl border border-primary-200 shadow-sm ring-1 ring-primary-100 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-primary-800 flex items-center">
                            <Edit3 size={14} className="mr-2" /> Edit Details
                        </span>
                        <button onClick={() => {
                            onChange(markers.filter(m => m.id !== selectedMarkerId));
                            setSelectedMarkerId(null);
                        }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        <textarea 
                            rows={3}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Add injury details..."
                            value={selectedMarker.note}
                            onChange={(e) => {
                                onChange(markers.map(m => m.id === selectedMarkerId ? { ...m, note: e.target.value } : m));
                            }}
                            autoFocus
                        />
                        <button 
                            onClick={() => setSelectedMarkerId(null)}
                            className="w-full py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors"
                        >
                            Save Note
                        </button>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Map Area */}
      <div className="relative flex-1 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex flex-col items-center justify-center min-h-[450px] md:min-h-[600px] shadow-inner touch-none">
        {/* View Toggles */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-white/95 backdrop-blur p-1.5 rounded-lg border border-slate-200 shadow-md max-w-[95%] overflow-x-auto no-scrollbar">
            {[
                { id: 'FRONT', label: 'Front' }, 
                { id: 'BACK', label: 'Back' },
                { id: 'HEAD_LEFT', label: 'Head (L)' },
                { id: 'HEAD_RIGHT', label: 'Head (R)' }
            ].map(v => (
                <button 
                    key={v.id}
                    onClick={() => setView(v.id as ViewType)}
                    className={`px-3 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                        view === v.id 
                        ? 'bg-primary-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {v.label}
                </button>
            ))}
        </div>

        <div 
            ref={mapRef}
            onClick={handleMapClick}
            className={`relative h-[80%] w-full max-w-sm cursor-crosshair transition-opacity duration-300 mt-12 ${readOnly ? 'cursor-default' : ''}`}
        >
            {/* SVG Body Outline Switcher */}
            <svg viewBox="0 0 200 400" className="w-full h-full text-slate-300 fill-white stroke-slate-300 stroke-2 drop-shadow-sm select-none pointer-events-none">
                {view === 'FRONT' && (
                    <path d="M100,20 C115,20 125,35 125,50 C125,65 115,80 100,80 C85,80 75,65 75,50 C75,35 85,20 100,20 M100,80 C130,85 150,100 160,150 L170,220 C172,230 160,235 155,225 L145,170 L140,220 L140,300 L150,380 C152,390 135,395 130,385 L110,300 L90,300 L70,385 C65,395 48,390 50,380 L60,300 L60,220 L55,170 L45,225 C40,235 28,230 30,220 L40,150 C50,100 70,85 100,80" />
                )}
                {view === 'BACK' && (
                    <path d="M100,20 C115,20 125,35 125,50 C125,65 115,80 100,80 C85,80 75,65 75,50 C75,35 85,20 100,20 M100,80 C130,85 150,100 160,150 L170,220 C172,230 160,235 155,225 L145,170 L140,220 L140,300 L150,380 C152,390 135,395 130,385 L110,300 L90,300 L70,385 C65,395 48,390 50,380 L60,300 L60,220 L55,170 L45,225 C40,235 28,230 30,220 L40,150 C50,100 70,85 100,80" />
                )}
                {view === 'HEAD_LEFT' && (
                    <path d="M70,50 C70,20 100,10 130,10 C160,10 180,30 180,70 C180,110 160,140 130,140 C110,140 100,130 100,120 L100,150 L70,150 L70,120 C60,110 50,90 50,70 C50,60 60,50 70,50" />
                )}
                {view === 'HEAD_RIGHT' && (
                    <path d="M130,50 C130,20 100,10 70,10 C40,10 20,30 20,70 C20,110 40,140 70,140 C90,140 100,130 100,120 L100,150 L130,150 L130,120 C140,110 150,90 150,70 C150,60 140,50 130,50" />
                )}
            </svg>

            {/* Markers */}
            {visibleMarkers.map(marker => (
                <div 
                    key={marker.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedMarkerId(marker.id); }}
                    className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 shadow-lg flex items-center justify-center transform transition-all z-20 cursor-pointer ${getMarkerColor(marker.type)} ${
                        selectedMarkerId === marker.id ? 'scale-125 ring-4 ring-white ring-opacity-75 z-30' : 'hover:scale-110'
                    }`}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                    {/* Inner dot for precision */}
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    {selectedMarkerId === marker.id && <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-white"></div>}
                </div>
            ))}
        </div>
        
        <div className="absolute bottom-4 text-xs text-slate-400 bg-white/80 px-3 py-1 rounded-full backdrop-blur border border-slate-200 pointer-events-none">
            Tap body to add marker
        </div>
      </div>

      {/* Mobile: Fixed Bottom Sheet for Details */}
      {selectedMarker && !readOnly && (
          <div className="md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] border-t border-slate-200 p-4 z-50 animate-slide-up pb-safe">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-800 flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getMarkerColor(selectedMarker.type).split(' ')[0]}`}></div>
                      {selectedMarker.type} Details
                  </span>
                  <div className="flex gap-3">
                    <button onClick={() => {
                        onChange(markers.filter(m => m.id !== selectedMarkerId));
                        setSelectedMarkerId(null);
                    }} className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-100">
                        <Trash2 size={18} />
                    </button>
                    <button onClick={() => setSelectedMarkerId(null)} className="bg-slate-100 text-slate-600 p-2 rounded-full hover:bg-slate-200">
                        <X size={18} />
                    </button>
                  </div>
              </div>
              
              <div className="flex gap-2">
                  <input 
                      type="text"
                      className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50"
                      placeholder="Describe injury (e.g. 2cm laceration)"
                      value={selectedMarker.note}
                      onChange={(e) => {
                          onChange(markers.map(m => m.id === selectedMarkerId ? { ...m, note: e.target.value } : m));
                      }}
                      autoFocus
                  />
                  <button 
                      onClick={() => setSelectedMarkerId(null)}
                      className="bg-primary-600 text-white rounded-xl px-5 font-bold shadow-md flex items-center justify-center active:scale-95 transition-transform"
                  >
                      <Check size={22} />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
