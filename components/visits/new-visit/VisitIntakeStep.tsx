
import React from 'react';
import { Student } from '../../../types';
import { Clock } from 'lucide-react';

interface VisitIntakeStepProps {
  students: Student[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  visitReason: string;
  setVisitReason: (reason: string) => void;
  customReason: string;
  setCustomReason: (reason: string) => void;
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
}

export const VisitIntakeStep: React.FC<VisitIntakeStepProps> = ({
  students,
  selectedStudentId,
  setSelectedStudentId,
  visitReason,
  setVisitReason,
  customReason,
  setCustomReason,
  symptoms,
  setSymptoms
}) => {
  const REASONS = ['Headache', 'Stomachache', 'Injury', 'Scheduled Meds', 'Chronic Condition', 'Fever', 'Behavioral', 'Other'];

  return (
    <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Clock size={20} className="mr-2 text-primary-600" /> Intake & Reason
        </h3>
        
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Student</label>
            <select 
                className="w-full border-slate-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
            >
                <option value="">Select Student...</option>
                {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (Gr {s.grade})</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Primary Reason</label>
            <div className="flex flex-wrap gap-2 mb-3">
                {REASONS.map(r => (
                    <button
                        key={r}
                        onClick={() => setVisitReason(r)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            visitReason === r 
                            ? 'bg-primary-600 text-white border-primary-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                        }`}
                    >
                        {r}
                    </button>
                ))}
            </div>
            {visitReason === 'Other' && (
                <input 
                    type="text" 
                    placeholder="Specify reason..."
                    className="w-full border-slate-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                />
            )}
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Patient Narrative / Symptoms</label>
            <textarea 
                rows={4}
                placeholder="Student states..."
                className="w-full border-slate-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
            />
        </div>
    </div>
  );
};
