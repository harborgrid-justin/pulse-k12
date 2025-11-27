
import React, { useState } from 'react';
import { Incident } from '../../types';
import { Info, AlertTriangle } from 'lucide-react';

interface IncidentAssessmentStepProps {
  formData: Partial<Incident>;
  updateField: (field: keyof Incident, value: any) => void;
}

export const IncidentAssessmentStep: React.FC<IncidentAssessmentStepProps> = ({ formData, updateField }) => {
  const [showGuidance, setShowGuidance] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Incident Type</label>
                <select 
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.type || 'INJURY'}
                    onChange={(e) => updateField('type', e.target.value)}
                >
                    <option value="INJURY">Injury</option>
                    <option value="ILLNESS">Illness</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                </select>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">Severity Classification</label>
                    <button 
                        onClick={() => setShowGuidance(!showGuidance)}
                        className="text-xs text-primary-600 font-medium flex items-center hover:underline"
                    >
                        <Info size={14} className="mr-1" /> Decision Support
                    </button>
                </div>
                <select 
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.severity || 'MINOR'}
                    onChange={(e) => updateField('severity', e.target.value)}
                >
                    <option value="MINOR">Minor (First Aid Only)</option>
                    <option value="MODERATE">Moderate (Restricted Activity/Parent Call)</option>
                    <option value="SEVERE">Severe (Medical Attention Required)</option>
                    <option value="CRITICAL">Critical (EMS/911 Called)</option>
                </select>
            </div>
        </div>

        {showGuidance && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm space-y-2 animate-fade-in">
                <h4 className="font-bold text-blue-800 mb-2">Severity Classification Guide</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-2 bg-white rounded border border-blue-100">
                        <span className="font-bold text-slate-700 block">Minor</span>
                        <span className="text-slate-500 text-xs">Scrapes, minor bruises, ice pack applied, returns to class.</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-amber-100">
                        <span className="font-bold text-amber-700 block">Moderate</span>
                        <span className="text-slate-500 text-xs">Head bump (no symptoms), persistent pain, sent home, parent notified.</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-red-100">
                        <span className="font-bold text-red-700 block">Severe</span>
                        <span className="text-slate-500 text-xs">Deep cut requiring stitches, suspected fracture, concussion symptoms.</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-300 bg-slate-50">
                        <span className="font-bold text-slate-900 block">Critical</span>
                        <span className="text-slate-500 text-xs">Unconscious, anaphylaxis, major trauma. EMS Required.</span>
                    </div>
                </div>
            </div>
        )}

        {(formData.severity === 'SEVERE' || formData.severity === 'CRITICAL') && (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-start animate-fade-in">
                <AlertTriangle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-bold">High Severity Protocol Triggered</p>
                    <ul className="list-disc ml-4 mt-1 text-sm space-y-1">
                        <li>District Risk Management will be notified automatically.</li>
                        <li>Ensure "Parent Notification" is marked as completed immediately.</li>
                        <li>Prepare witness statements if applicable.</li>
                    </ul>
                </div>
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Provided</label>
            <textarea 
                rows={4}
                placeholder="List all first aid, medications administered, or procedures performed..."
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.treatmentProvided || ''}
                onChange={(e) => updateField('treatmentProvided', e.target.value)}
            />
        </div>
    </div>
  );
};
