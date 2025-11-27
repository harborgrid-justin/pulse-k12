
import React, { useState } from 'react';
import { Incident, Student } from '../../types';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { IncidentContextStep } from './IncidentContextStep';
import { IncidentInjuryStep } from './IncidentInjuryStep';
import { IncidentAssessmentStep } from './IncidentAssessmentStep';
import { IncidentNotificationStep } from './IncidentNotificationStep';

interface IncidentFormProps {
  students: Student[];
  onSave: (incident: Incident) => void;
  onCancel: () => void;
}

const STEPS = ['Context', 'Injury Details', 'Assessment', 'Notification'];

export const IncidentForm: React.FC<IncidentFormProps> = ({ students, onSave, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Incident>>({
    id: `inc_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}),
    status: 'OPEN',
    parentNotified: false,
    witnesses: [],
    bodyMarkers: []
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(curr => curr + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  const handleSubmit = () => {
    if (!formData.studentId || !formData.description) return;
    onSave(formData as Incident);
  };

  const updateField = (field: keyof Incident, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
            <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800">New Incident Report</h2>
                <p className="text-xs md:text-sm text-slate-500">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</p>
            </div>
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full shrink-0">
            <div 
                className="h-full bg-primary-600 transition-all duration-300 ease-in-out" 
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} 
            />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
            {currentStep === 0 && (
                <IncidentContextStep students={students} formData={formData} updateField={updateField} />
            )}
            {currentStep === 1 && (
                <IncidentInjuryStep formData={formData} updateField={updateField} />
            )}
            {currentStep === 2 && (
                <IncidentAssessmentStep formData={formData} updateField={updateField} />
            )}
            {currentStep === 3 && (
                <IncidentNotificationStep formData={formData} updateField={updateField} onSubmit={handleSubmit} />
            )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 md:px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0 safe-area-pb">
            <button 
                onClick={handlePrev} 
                disabled={currentStep === 0}
                className="px-3 md:px-4 py-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center text-sm md:text-base"
            >
                <ChevronLeft size={18} className="mr-1" /> Previous
            </button>
            <div className="flex space-x-1.5 md:space-x-2">
                {STEPS.map((_, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${idx === currentStep ? 'bg-primary-600' : 'bg-slate-300'}`} />
                ))}
            </div>
            {currentStep < STEPS.length - 1 ? (
                <button 
                    onClick={handleNext}
                    className="px-4 md:px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-sm flex items-center transition-all text-sm md:text-base"
                >
                    Next <ChevronRight size={18} className="ml-1" />
                </button>
            ) : (
                <div className="w-16 md:w-24"></div> // Spacer
            )}
        </div>
    </div>
  );
};
