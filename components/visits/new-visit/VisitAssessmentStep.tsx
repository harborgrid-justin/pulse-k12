
import React from 'react';
import { Urgency, VitalSigns } from '../../../types';
import { Activity, Thermometer, Heart } from 'lucide-react';

interface VisitAssessmentStepProps {
  vitals: VitalSigns;
  setVitals: (v: VitalSigns) => void;
  urgency: Urgency;
  setUrgency: (u: Urgency) => void;
}

export const VisitAssessmentStep: React.FC<VisitAssessmentStepProps> = ({ vitals, setVitals, urgency, setUrgency }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Activity size={20} className="mr-2 text-primary-600" /> Vitals & Assessment
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Temp (°F)</label>
                <div className="relative">
                    <Thermometer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        className="w-full pl-9 pr-2 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="98.6"
                        value={vitals.temperature || ''}
                        onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Heart Rate</label>
                <div className="relative">
                    <Heart size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        className="w-full pl-9 pr-2 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="bpm"
                        value={vitals.heartRate || ''}
                        onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">O2 Sat (%)</label>
                <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="98%"
                    value={vitals.oxygenSat || ''}
                    onChange={(e) => setVitals({...vitals, oxygenSat: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">BP (mmHg)</label>
                <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="110/70"
                    value={vitals.bloodPressure || ''}
                    onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Urgency Assessment</label>
            <div className="grid grid-cols-4 gap-2">
                {Object.values(Urgency).map(u => (
                    <button
                        key={u}
                        onClick={() => setUrgency(u)}
                        className={`py-2 rounded-lg text-xs font-bold uppercase border transition-all ${
                            urgency === u
                            ? u === 'CRITICAL' || u === 'HIGH' ? 'bg-red-600 text-white border-red-600' : 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {u}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};
