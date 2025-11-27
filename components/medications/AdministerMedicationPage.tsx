
import React, { useState } from 'react';
import { Student, Prescription, VisitLog, Urgency } from '../../types';
import { ArrowLeft, Pill, CheckCircle, AlertTriangle } from 'lucide-react';

interface AdministerMedicationPageProps {
  student: Student;
  prescription: Prescription;
  onCancel: () => void;
  onSave: (visit: VisitLog) => void;
}

export const AdministerMedicationPage: React.FC<AdministerMedicationPageProps> = ({
  student,
  prescription,
  onCancel,
  onSave
}) => {
  const [administerNote, setAdministerNote] = useState('');
  const [deductInventory, setDeductInventory] = useState(true);
  const [effectiveness, setEffectiveness] = useState('');

  const handleLogDose = () => {
    const visit: VisitLog = {
        id: Math.random().toString(36).substr(2, 9),
        studentId: student.id,
        timestamp: new Date().toISOString(),
        visitReason: prescription.frequency === 'DAILY' ? 'Scheduled Meds' : 'PRN Medication',
        symptoms: prescription.frequency === 'DAILY' ? 'Routine Administration' : administerNote || 'As needed indication',
        treatment: `Administered ${prescription.medicationName} ${prescription.dosage} (${prescription.route || 'Oral'})`,
        outcome: 'Returned to class',
        urgency: Urgency.LOW,
        notes: `Authorization: ${prescription.hasAuthorization ? 'Yes' : 'No'}. \nReason/Notes: ${administerNote} \nEffectiveness/Response: ${effectiveness} \nInventory Deducted: ${deductInventory ? 'Yes' : 'No'}`,
        processedByAI: false
    };
    
    onSave(visit);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center space-x-4">
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <Pill className="mr-2 text-primary-600" />
                    Administer Medication
                </h2>
            </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Student & Rx Context */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <img src={student.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{student.firstName} {student.lastName}</h3>
                                <p className="text-slate-500">Grade {student.grade}</p>
                            </div>
                        </div>
                        {student.allergies.length > 0 && (
                            <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-red-100">
                                <AlertTriangle size={12} className="mr-1" />
                                Allergies: {student.allergies.map(a => a.name).join(', ')}
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">Prescription</p>
                        <p className="font-bold text-slate-800 text-lg">{prescription.medicationName}</p>
                        <p className="text-sm text-slate-600">{prescription.dosage} via {prescription.route || 'Oral Route'}</p>
                        <p className="text-xs text-slate-500 mt-2 italic">"{prescription.instructions}"</p>
                        <div className="mt-2 text-xs text-slate-400 font-mono">Auth: {prescription.hasAuthorization ? 'Yes' : 'No'} • Prescriber: {prescription.prescriber}</div>
                    </div>
                </div>

                {/* Administration Form */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            {prescription.frequency === 'PRN' ? 'Reason for Administration (Required)' : 'Administration Notes'}
                        </label>
                        <textarea 
                            rows={3}
                            className="w-full border border-slate-200 bg-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder={prescription.frequency === 'PRN' ? "e.g. Student complained of headache 7/10..." : "Routine administration notes..."}
                            value={administerNote}
                            onChange={(e) => setAdministerNote(e.target.value)}
                        />
                    </div>

                    {prescription.frequency === 'PRN' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Expected Outcome / Effectiveness</label>
                            <input 
                                type="text"
                                className="w-full border border-slate-200 bg-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g. Relief expected within 30 mins"
                                value={effectiveness}
                                onChange={(e) => setEffectiveness(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer" onClick={() => setDeductInventory(!deductInventory)}>
                        <input 
                            type="checkbox" 
                            id="deduct" 
                            className="w-5 h-5 text-primary-600 rounded border-slate-300 focus:ring-primary-500 cursor-pointer"
                            checked={deductInventory}
                            onChange={(e) => setDeductInventory(e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <label htmlFor="deduct" className="ml-3 text-sm text-slate-700 font-medium select-none cursor-pointer">
                            Auto-deduct 1 unit from School Inventory
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-4 bg-slate-50">
            <button onClick={onCancel} className="px-6 py-3 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium transition-colors border border-transparent hover:border-slate-200">
                Cancel
            </button>
            <button 
                onClick={handleLogDose}
                disabled={prescription.frequency === 'PRN' && !administerNote}
                className="px-8 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <CheckCircle size={20} className="mr-2" />
                Confirm & Log Dose
            </button>
        </div>
    </div>
  );
};
