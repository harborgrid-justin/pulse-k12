
import React from 'react';
import { Stethoscope, CheckSquare } from 'lucide-react';

interface VisitInterventionStepProps {
  selectedInterventions: string[];
  setSelectedInterventions: (list: string[]) => void;
  treatmentNotes: string;
  setTreatmentNotes: (notes: string) => void;
}

export const VisitInterventionStep: React.FC<VisitInterventionStepProps> = ({ 
  selectedInterventions, 
  setSelectedInterventions, 
  treatmentNotes, 
  setTreatmentNotes 
}) => {
  const INTERVENTIONS = ['Ice Pack', 'Rest (15m)', 'Wound Cleaning', 'Bandage', 'Water/Hydration', 'Temp Check', 'Inhaler', 'Glucose Check', 'OTC Meds'];

  const toggleIntervention = (item: string) => {
      if (selectedInterventions.includes(item)) {
          setSelectedInterventions(selectedInterventions.filter(i => i !== item));
      } else {
          setSelectedInterventions([...selectedInterventions, item]);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Stethoscope size={20} className="mr-2 text-primary-600" /> Treatment Provided
        </h3>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Standard Interventions</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {INTERVENTIONS.map(item => (
                    <button
                        key={item}
                        onClick={() => toggleIntervention(item)}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                            selectedInterventions.includes(item)
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-200'
                        }`}
                    >
                        {selectedInterventions.includes(item) && <CheckSquare size={14} className="mr-2" />}
                        {item}
                    </button>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Procedure Notes / Medication Details</label>
            <textarea 
                rows={4}
                placeholder="Detailed notes on care provided..."
                className="w-full border-slate-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={treatmentNotes}
                onChange={(e) => setTreatmentNotes(e.target.value)}
            />
        </div>
    </div>
  );
};
