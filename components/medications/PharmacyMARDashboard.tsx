
import React from 'react';
import { Student, Prescription } from '../../types';
import { Clock, Pill, AlertOctagon, CheckCircle, XCircle } from 'lucide-react';

interface PharmacyMARDashboardProps {
  students: Student[];
  onAdminister: (studentId: string, rx: Prescription) => void;
}

export const PharmacyMARDashboard: React.FC<PharmacyMARDashboardProps> = ({ students, onAdminister }) => {
  const marSchedule = students.flatMap(s => 
    (s.prescriptions || []).filter(p => p.frequency === 'DAILY').map(p => ({
        ...p,
        studentName: `${s.firstName} ${s.lastName}`,
        studentId: s.id,
        studentGrade: s.grade,
        photoUrl: s.photoUrl,
    }))
  ).sort((a,b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full animate-fade-in pb-8">
        <div className="xl:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-3">
                <h3 className="font-bold text-slate-800 flex items-center">
                    <Clock size={20} className="mr-2 text-primary-600 shrink-0" />
                    Scheduled Administrations - Today
                </h3>
                <span className="text-xs font-bold bg-primary-100 text-primary-700 px-3 py-1.5 rounded whitespace-nowrap">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {marSchedule.map((task, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 transition-colors group">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Time Column */}
                            <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center min-w-[80px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-4">
                                <div className="text-center sm:text-left">
                                    <span className="block text-lg font-bold text-slate-800">{task.time || 'TBD'}</span>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scheduled</span>
                                </div>
                                {/* Mobile Only Status Indicator */}
                                <div className="sm:hidden bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                    Due
                                </div>
                            </div>

                            {/* Patient & Med Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3 mb-2">
                                    <img src={task.photoUrl} className="w-10 h-10 rounded-full border border-slate-200 shrink-0 object-cover" alt="" />
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-800 truncate text-base">
                                            {task.studentName} 
                                        </h4>
                                        <p className="text-xs text-slate-500">Grade {task.studentGrade}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p className="text-sm font-bold text-primary-700 flex items-start">
                                        <Pill size={16} className="mr-2 mt-0.5 shrink-0" />
                                        <span className="break-words leading-tight">
                                            {task.medicationName}
                                        </span>
                                    </p>
                                    <div className="mt-1 pl-6 text-xs text-slate-600 font-medium grid grid-cols-2 gap-2">
                                        <span>Dose: {task.dosage}</span>
                                        <span>Route: {task.route || 'Oral'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row sm:flex-col gap-2 justify-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                                <button 
                                    onClick={() => onAdminister(task.studentId, task as unknown as Prescription)}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 shadow-sm transition-colors flex items-center justify-center"
                                >
                                    <CheckCircle size={16} className="mr-2" />
                                    Administer
                                </button>
                                <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center">
                                    <XCircle size={16} className="mr-2" />
                                    Absent
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {marSchedule.length === 0 && (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No scheduled medications remaining for today.
                    </div>
                )}
            </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
            <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-lg mb-2">Compliance Snapshot</h3>
                <p className="text-slate-400 text-xs mb-4">Daily adherence metrics</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                        <span className="block text-2xl font-bold text-emerald-400">94%</span>
                        <span className="text-xs text-slate-300">Adherence Rate</span>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                        <span className="block text-2xl font-bold text-amber-400">2</span>
                        <span className="text-xs text-slate-300">Missed Doses</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                    <AlertOctagon size={18} className="mr-2 text-amber-500" />
                    Expiring Authorizations
                </h4>
                <ul className="space-y-3">
                    <li className="pb-3 border-b border-slate-50 last:border-0">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-bold text-slate-700">Ethan Hunt</span>
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">3 days</span>
                        </div>
                        <p className="text-xs text-slate-500">Methylphenidate • Authorization Form</p>
                    </li>
                    <li className="pb-3 border-b border-slate-50 last:border-0">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-bold text-slate-700">Sophia Murphy</span>
                            <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">14 days</span>
                        </div>
                        <p className="text-xs text-slate-500">Glucagon • Physician Order</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
};
