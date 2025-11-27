
import React from 'react';
import { Incident, BodyMarker } from '../../types';
import { BodyMap } from './BodyMap';
import { AlertTriangle } from 'lucide-react';

interface IncidentInjuryStepProps {
  formData: Partial<Incident>;
  updateField: (field: keyof Incident, value: any) => void;
}

export const IncidentInjuryStep: React.FC<IncidentInjuryStepProps> = ({ formData, updateField }) => {
  return (
    <div className="flex flex-col space-y-4 animate-fade-in pb-4 h-full">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-2 shrink-0">
            <p className="text-sm text-blue-800 flex items-center">
                <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                Tap on the body diagram to mark injury location.
            </p>
        </div>
        
        {/* Container allows map to have height but doesn't force the step to be 100% height, enabling scroll */}
        <div className="flex-1 min-h-[500px] md:min-h-[600px] flex flex-col">
            <BodyMap 
                markers={formData.bodyMarkers || []} 
                onChange={(markers) => updateField('bodyMarkers', markers)}
            />
        </div>
        
        <div className="shrink-0 pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
            <textarea 
                rows={3}
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe how the injury occurred..."
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
            />
        </div>
    </div>
  );
};
