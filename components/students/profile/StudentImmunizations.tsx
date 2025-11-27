
import React from 'react';
import { Student } from '../../../types';
import { Shield, Plus, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface StudentImmunizationsProps {
  student: Student;
  onAddRequest?: () => void;
}

export const StudentImmunizations: React.FC<StudentImmunizationsProps> = ({ student, onAddRequest }) => {

  const getVaxStatusColor = (status: string) => {
    switch(status) {
      case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200';
      case 'DUE_SOON': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'EXEMPT': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'COMPLIANT': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Shield size={20} className="mr-2 text-primary-600" />
                    Immunization Record
                </h3>
                <p className="text-slate-500 text-sm">State Registry Integration: <span className="text-emerald-600 font-bold">Connected (GRITS)</span></p>
                </div>
                <div className="flex gap-2">
                <button 
                    onClick={onAddRequest}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm transition-colors"
                >
                    <Plus size={16} className="mr-2" />
                    Add Record
                </button>
                <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                    <ExternalLink size={16} className="mr-2" />
                    Sync Registry
                </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                    <th className="px-6 py-4">Vaccine</th>
                    <th className="px-6 py-4">Administered Date</th>
                    <th className="px-6 py-4">Dose Info</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Next Due</th>
                    <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {student.immunizations?.map((vax) => (
                    <tr key={vax.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{vax.name}</td>
                        <td className="px-6 py-4 text-slate-600">{vax.date}</td>
                        <td className="px-6 py-4 text-slate-600">Dose {vax.doseNumber} of {vax.totalDoses}</td>
                        <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            {vax.manufacturer && <span className="text-xs text-slate-500">Mfg: {vax.manufacturer}</span>}
                            {vax.lotNumber && <span className="text-xs text-slate-500">Lot: {vax.lotNumber}</span>}
                            {vax.site && <span className="text-xs text-slate-500">Site: {vax.site}</span>}
                            {!vax.manufacturer && !vax.lotNumber && !vax.site && <span className="text-xs text-slate-400 italic">No details</span>}
                        </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{vax.nextDueDate || '-'}</td>
                        <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getVaxStatusColor(vax.status)}`}>
                            {vax.status === 'COMPLIANT' && <CheckCircle size={12} className="mr-1" />}
                            {vax.status === 'OVERDUE' && <AlertCircle size={12} className="mr-1" />}
                            {vax.status.replace('_', ' ')}
                        </span>
                        </td>
                    </tr>
                    ))}
                    {(!student.immunizations || student.immunizations.length === 0) && (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No immunization records found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
