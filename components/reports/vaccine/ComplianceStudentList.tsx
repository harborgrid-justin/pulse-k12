
import React, { useState } from 'react';
import { Student } from '../../../types';
import { ChevronUp, ChevronDown, CheckCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface ComplianceStudentListProps {
  filteredData: (Student & { status: string; missing: string[] })[];
  onSelectStudent: (student: Student) => void;
}

export const ComplianceStudentList: React.FC<ComplianceStudentListProps> = ({ filteredData, onSelectStudent }) => {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
        <div className="bg-white rounded-t-xl border border-slate-200 shadow-sm p-4 border-b-0 flex justify-between items-center">
           <h3 className="font-bold text-slate-800">Student Detail Records</h3>
           <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{filteredData.length} Records</span>
       </div>
       
       {/* Desktop Table */}
       <div className="hidden md:block bg-white border border-slate-200 border-t-0 shadow-sm overflow-hidden rounded-b-xl flex-1 overflow-y-auto max-h-[600px]">
           <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                   <tr>
                       <th className="px-4 py-3 font-semibold text-slate-600">Student</th>
                       <th className="px-4 py-3 font-semibold text-slate-600">Grade</th>
                       <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                       <th className="px-4 py-3 font-semibold text-slate-600">Details</th>
                       <th className="px-4 py-3"></th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                   {filteredData.map(s => (
                       <React.Fragment key={s.id}>
                           <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => setExpandedStudent(expandedStudent === s.id ? null : s.id)}>
                               <td className="px-4 py-3 font-medium text-slate-800">{s.firstName} {s.lastName}</td>
                               <td className="px-4 py-3 text-slate-600">{s.grade}</td>
                               <td className="px-4 py-3">
                                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                                       s.status === 'COMPLIANT' ? 'bg-emerald-100 text-emerald-700' :
                                       s.status === 'PROVISIONAL' ? 'bg-amber-100 text-amber-700' :
                                       'bg-red-100 text-red-700'
                                   }`}>
                                       {s.status.replace('_', ' ')}
                                   </span>
                               </td>
                               <td className="px-4 py-3 text-slate-500 truncate max-w-xs">
                                   {s.missing.length > 0 ? `${s.missing.length} missing vaccines` : 'Up to date'}
                               </td>
                               <td className="px-4 py-3 text-right text-slate-400">
                                   {expandedStudent === s.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                               </td>
                           </tr>
                           {expandedStudent === s.id && (
                               <tr className="bg-slate-50 border-b border-slate-200">
                                   <td colSpan={5} className="px-4 py-4">
                                       <div className="flex justify-between">
                                           <div>
                                               <p className="text-xs font-bold text-slate-500 uppercase mb-2">Missing / Action Items</p>
                                               {s.missing.length > 0 ? (
                                                   <ul className="list-disc pl-4 text-sm text-red-600 space-y-1">
                                                       {s.missing.map((m, i) => <li key={i}>{m}</li>)}
                                                   </ul>
                                               ) : (
                                                   <p className="text-sm text-emerald-600 flex items-center"><CheckCircle size={14} className="mr-1"/> All requirements met.</p>
                                               )}
                                           </div>
                                           <div className="flex flex-col gap-2">
                                               <button 
                                                    onClick={() => onSelectStudent(s)}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-primary-600 hover:bg-primary-50"
                                               >
                                                   View Profile
                                               </button>
                                               <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center">
                                                   <FileText size={12} className="mr-1" /> Send Notice
                                               </button>
                                           </div>
                                       </div>
                                   </td>
                               </tr>
                           )}
                       </React.Fragment>
                   ))}
               </tbody>
           </table>
       </div>

       {/* Mobile Cards View */}
       <div className="md:hidden space-y-3 bg-slate-50/50 p-2 rounded-b-xl border border-t-0 border-slate-200">
           {filteredData.map(s => (
               <div 
                   key={s.id} 
                   className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm active:scale-[0.99] transition-all"
                   onClick={() => setExpandedStudent(expandedStudent === s.id ? null : s.id)}
               >
                   <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                               <img src={s.photoUrl} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div>
                               <h4 className="font-bold text-slate-800 text-base">{s.firstName} {s.lastName}</h4>
                               <p className="text-xs text-slate-500 font-medium">Grade {s.grade}</p>
                           </div>
                       </div>
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                           s.status === 'COMPLIANT' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                           s.status === 'PROVISIONAL' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                           'bg-red-100 text-red-700 border-red-200'
                       }`}>
                           {s.status === 'NON_COMPLIANT' ? 'Action Req' : s.status}
                       </span>
                   </div>
                   
                   <div className="flex items-center justify-between mt-3">
                       <p className="text-xs text-slate-500">
                           {s.missing.length > 0 ? (
                               <span className="text-red-600 font-medium flex items-center">
                                   <AlertCircle size={12} className="mr-1" /> {s.missing.length} Missing Vaccine(s)
                               </span>
                           ) : (
                               <span className="text-emerald-600 font-medium flex items-center">
                                   <CheckCircle size={12} className="mr-1" /> Up to Date
                               </span>
                           )}
                       </p>
                       <ChevronDown 
                           size={16} 
                           className={`text-slate-400 transition-transform duration-200 ${expandedStudent === s.id ? 'rotate-180' : ''}`} 
                       />
                   </div>

                   {expandedStudent === s.id && (
                       <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                           {s.missing.length > 0 && (
                               <div className="mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                                   <p className="text-xs font-bold text-red-800 uppercase mb-2">Missing Items</p>
                                   <ul className="list-disc pl-4 text-xs text-red-700 space-y-1">
                                       {s.missing.map((m, i) => <li key={i}>{m}</li>)}
                                   </ul>
                               </div>
                           )}
                           <div className="grid grid-cols-2 gap-3">
                               <button 
                                   onClick={(e) => { e.stopPropagation(); onSelectStudent(s); }}
                                   className="flex items-center justify-center px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold border border-primary-100"
                               >
                                   View Profile <ArrowRight size={12} className="ml-1" />
                               </button>
                               <button 
                                   onClick={(e) => { e.stopPropagation(); alert("Notice sent to parent."); }}
                                   className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-200"
                               >
                                   <FileText size={12} className="mr-1" /> Send Notice
                               </button>
                           </div>
                       </div>
                   )}
               </div>
           ))}
       </div>
    </div>
  );
};
