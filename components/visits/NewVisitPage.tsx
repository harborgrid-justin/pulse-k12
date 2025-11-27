
import React, { useState } from 'react';
import { Student, VisitLog, Urgency, VitalSigns, VisitDismissal } from '../../types';
import { GeminiService } from '../../services/geminiService';
import { ArrowLeft, Sparkles, Save, Loader2 } from 'lucide-react';

import { VisitIntakeStep } from './new-visit/VisitIntakeStep';
import { VisitAssessmentStep } from './new-visit/VisitAssessmentStep';
import { VisitInterventionStep } from './new-visit/VisitInterventionStep';
import { VisitOutcomeStep } from './new-visit/VisitOutcomeStep';

interface NewVisitPageProps {
  onCancel: () => void;
  onSave: (visit: VisitLog) => void;
  students: Student[];
  initialStudentId?: string;
}

type FormStep = 'INTAKE' | 'ASSESSMENT' | 'INTERVENTION' | 'OUTCOME';

export const NewVisitPage: React.FC<NewVisitPageProps> = ({ onCancel, onSave, students, initialStudentId }) => {
  const [activeStep, setActiveStep] = useState<FormStep>('INTAKE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || '');
  const [visitReason, setVisitReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [vitals, setVitals] = useState<VitalSigns>({ timeTaken: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [outcome, setOutcome] = useState('Improved');
  const [urgency, setUrgency] = useState<Urgency>(Urgency.LOW);
  const [dismissal, setDismissal] = useState<Partial<VisitDismissal>>({ type: 'RETURN_TO_CLASS', timeOut: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), hallPassIssued: false });
  const [rawInput, setRawInput] = useState('');

  const handleMagicFill = async () => {
    if (!rawInput.trim()) return;
    setIsProcessing(true);
    const analysis = await GeminiService.processClinicalNote(rawInput);
    setSymptoms(analysis.symptoms);
    setTreatmentNotes(analysis.treatment);
    setOutcome(analysis.outcome || 'Returned to class');
    setUrgency(analysis.urgency);
    setIsProcessing(false);
  };

  const handleSubmit = async () => {
    if (!selectedStudentId) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const finalTreatment = selectedInterventions.length > 0 ? `${selectedInterventions.join(', ')}. ${treatmentNotes}` : treatmentNotes;
    const finalReason = visitReason === 'Other' ? customReason : visitReason;

    const newVisit: VisitLog = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: selectedStudentId,
      timestamp: new Date().toISOString(),
      visitReason: finalReason,
      symptoms,
      vitals: vitals.temperature || vitals.heartRate ? vitals : undefined,
      treatment: finalTreatment,
      interventions: selectedInterventions,
      outcome,
      urgency,
      dismissal: dismissal as VisitDismissal,
      notes: `Subjective: ${symptoms}\nAssessment: ${visitReason}\nPlan: ${finalTreatment}. Dismissal: ${dismissal.type}`,
      processedByAI: !!rawInput
    };

    onSave(newVisit);
    setIsSaving(false);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-4">
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><ArrowLeft size={24} /></button>
            <h2 className="text-xl font-bold text-slate-800">New Clinical Visit</h2>
          </div>
          <div className="flex space-x-2">
              {['INTAKE', 'ASSESSMENT', 'INTERVENTION', 'OUTCOME'].map((step, idx) => (
                  <div key={step} className={`w-2 h-2 rounded-full ${activeStep === step ? 'bg-primary-600' : 'bg-slate-200'} ${idx !== 3 ? 'mr-2' : ''}`} />
              ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="mb-8 bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex items-center text-indigo-700 font-bold whitespace-nowrap">
                    <Sparkles size={18} className="mr-2" /> AI Assist
                </div>
                <input type="text" placeholder="Dictate: 'Student had headache, temp 99.1...'" className="flex-1 bg-white border-indigo-200 rounded-lg px-4 py-2 text-sm" value={rawInput} onChange={(e) => setRawInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleMagicFill()} />
                <button onClick={handleMagicFill} disabled={isProcessing || !rawInput} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                    {isProcessing ? 'Analyzing...' : 'Auto-Fill'}
                </button>
            </div>

            {activeStep === 'INTAKE' && <VisitIntakeStep students={students} selectedStudentId={selectedStudentId} setSelectedStudentId={setSelectedStudentId} visitReason={visitReason} setVisitReason={setVisitReason} customReason={customReason} setCustomReason={setCustomReason} symptoms={symptoms} setSymptoms={setSymptoms} />}
            {activeStep === 'ASSESSMENT' && <VisitAssessmentStep vitals={vitals} setVitals={setVitals} urgency={urgency} setUrgency={setUrgency} />}
            {activeStep === 'INTERVENTION' && <VisitInterventionStep selectedInterventions={selectedInterventions} setSelectedInterventions={setSelectedInterventions} treatmentNotes={treatmentNotes} setTreatmentNotes={setTreatmentNotes} />}
            {activeStep === 'OUTCOME' && <VisitOutcomeStep outcome={outcome} setOutcome={setOutcome} dismissal={dismissal} setDismissal={setDismissal} />}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50">
          <button onClick={() => { if(activeStep === 'ASSESSMENT') setActiveStep('INTAKE'); if(activeStep === 'INTERVENTION') setActiveStep('ASSESSMENT'); if(activeStep === 'OUTCOME') setActiveStep('INTERVENTION'); }} disabled={activeStep === 'INTAKE'} className="px-6 py-3 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium transition-all disabled:opacity-30">Back</button>
          {activeStep !== 'OUTCOME' ? (
              <button onClick={() => { if(activeStep === 'INTAKE') setActiveStep('ASSESSMENT'); if(activeStep === 'ASSESSMENT') setActiveStep('INTERVENTION'); if(activeStep === 'INTERVENTION') setActiveStep('OUTCOME'); }} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-lg">Next Step</button>
          ) : (
              <button onClick={handleSubmit} disabled={isSaving} className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg flex items-center disabled:opacity-50">
                {isSaving ? <Loader2 size={20} className="mr-2 animate-spin" /> : <Save size={20} className="mr-2" />} Save Visit Log
              </button>
          )}
        </div>
    </div>
  );
};
