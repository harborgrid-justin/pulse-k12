
import React, { useState } from 'react';
import { Student, VisitLog, Allergy, Prescription } from '../../../types';
import { VisitHistoryList } from './VisitHistoryList';
import { AlertTriangle, AlertOctagon, Shield, Pill, X } from 'lucide-react';

interface StudentOverviewProps {
  student: Student;
  history: VisitLog[];
  onAddVisit?: (visit: VisitLog) => void;
  onAdministerMedication?: (prescription: Prescription) => void;
  onVisitSelect?: (visit: VisitLog) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ student, history, onAddVisit, onAdministerMedication, onVisitSelect }) => {
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <div className="md:col-span-1 space-y-6">
            {/* Vitals Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Vitals & Biometrics</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Blood Type</span>
                    <span className="font-semibold text-slate-700">{student.bloodType || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Height</span>
                    <span className="font-semibold text-slate-700">{student.height || '--'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Weight</span>
                    <span className="font-semibold text-slate-700">{student.weight || '--'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Last Screened</span>
                    <span className="font-semibold text-slate-700">{student.lastScreening || 'Never'}</span>
                    </div>
                </div>
            </div>

            {/* Alerts Card */}
            {(student.allergies.length > 0 || student.conditions.length > 0) ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm">
                    <h3 className="text-red-800 font-bold mb-4 flex items-center">
                    <AlertTriangle size={18} className="mr-2" />
                    Medical Alerts
                    </h3>
                    <div className="space-y-3">
                    {student.allergies.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-red-600 uppercase mb-1">Allergies</p>
                            <div className="flex flex-wrap gap-2">
                            {student.allergies.map(a => (
                                <button 
                                key={a.name} 
                                onClick={() => setSelectedAllergy(a)}
                                className="bg-white text-red-700 border border-red-200 px-2 py-1 rounded-md text-sm font-medium shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors flex items-center"
                                >
                                {a.name}
                                <AlertOctagon size={12} className="ml-1.5 opacity-50" />
                                </button>
                            ))}
                            </div>
                        </div>
                    )}
                    {student.conditions.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-red-600 uppercase mb-1">Conditions</p>
                            <div className="flex flex-wrap gap-2">
                            {student.conditions.map(c => (
                                <span key={c} className="bg-white text-red-700 border border-red-200 px-2 py-1 rounded-md text-sm font-medium shadow-sm cursor-default">
                                {c}
                                </span>
                            ))}
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 shadow-sm flex items-center justify-center text-emerald-700">
                    <Shield size={20} className="mr-2" />
                    <span className="font-medium">No Medical Alerts</span>
                </div>
            )}

            {/* Medications Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
                    <Pill size={16} className="mr-2 text-primary-600" />
                    Medications & Orders
                </h3>
                {student.prescriptions && student.prescriptions.length > 0 ? (
                    <div className="space-y-3">
                        {student.prescriptions.map((rx, idx) => (
                            <div key={idx} className="p-3 border border-slate-100 rounded-lg bg-slate-50">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-800 text-sm">{rx.medicationName}</span>
                                    {rx.hasAuthorization && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">Auth On File</span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-600 mb-2">
                                    {rx.dosage} • {rx.frequency} {rx.time && `@ ${rx.time}`}
                                </div>
                                <div className="text-xs text-slate-500 italic mb-3">"{rx.instructions}"</div>
                                <button 
                                    onClick={() => onAdministerMedication && onAdministerMedication(rx)}
                                    className="w-full py-1.5 bg-white border border-slate-200 text-primary-600 text-xs font-bold rounded hover:bg-primary-50 transition-colors shadow-sm"
                                >
                                    Log Dose
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-400 text-sm italic">
                        No active prescriptions.
                    </div>
                )}
            </div>
        </div>

        <div className="md:col-span-2 space-y-6">
            <VisitHistoryList visits={history} onVisitClick={onVisitSelect} />
        </div>

        {/* Allergy Detail Modal */}
       {selectedAllergy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
             <button 
                onClick={() => setSelectedAllergy(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
             >
                <X size={20} />
             </button>
             
             <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                   <AlertOctagon size={28} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800">{selectedAllergy.name}</h3>
                   <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-100 uppercase">
                      {selectedAllergy.severity} SEVERITY
                   </span>
                </div>
             </div>
             
             <div className="space-y-4">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Reaction Symptoms</p>
                   <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedAllergy.reaction}</p>
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Action Plan</p>
                   <p className="text-slate-800 font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-start">
                      <AlertTriangle size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      {selectedAllergy.actionPlan}
                   </p>
                </div>
             </div>
             
             <button 
                onClick={() => setSelectedAllergy(null)}
                className="w-full mt-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
             >
                Close Details
             </button>
          </div>
        </div>
       )}
    </div>
  );
};
