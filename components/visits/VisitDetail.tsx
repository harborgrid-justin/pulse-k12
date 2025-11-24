import React from 'react';
import { VisitLog, Student, Urgency } from '../../types';
import { ArrowLeft, Calendar, Clock, User, AlertTriangle, FileText, Activity, Stethoscope } from 'lucide-react';

interface VisitDetailProps {
  visit: VisitLog;
  student: Student;
  onBack: () => void;
  onSelectStudent: (student: Student) => void;
}

export const VisitDetail: React.FC<VisitDetailProps> = ({ visit, student, onBack, onSelectStudent }) => {
  const getUrgencyColor = (u: Urgency) => {
    switch(u) {
      case Urgency.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
      case Urgency.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case Urgency.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Back to Visits
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
          <div className="flex items-start space-x-4">
             <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-primary-600">
               <FileText size={32} />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-slate-800">Visit Log #{visit.id}</h1>
               <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(visit.timestamp).toLocaleDateString()}</span>
                  <span className="flex items-center"><Clock size={14} className="mr-1" /> {new Date(visit.timestamp).toLocaleTimeString()}</span>
               </div>
             </div>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold text-sm border flex items-center ${getUrgencyColor(visit.urgency)}`}>
            {visit.urgency === Urgency.HIGH || visit.urgency === Urgency.CRITICAL ? <AlertTriangle size={16} className="mr-2" /> : <Activity size={16} className="mr-2" />}
            {visit.urgency} URGENCY
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Patient Information</h3>
              <div 
                className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 hover:border-slate-200 transition-colors"
                onClick={() => onSelectStudent(student)}
              >
                  <img src={student.photoUrl} alt={student.firstName} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                      <p className="font-bold text-slate-800">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-slate-500">Grade {student.grade} • ID: {student.id}</p>
                      <p className="text-xs text-primary-600 mt-1 font-medium">View Profile →</p>
                  </div>
              </div>
            </div>

            <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Outcome</h3>
               <div className="p-4 rounded-lg border border-slate-200 text-slate-700 font-medium">
                  {visit.outcome}
               </div>
            </div>
        </div>
      </div>

      {/* Clinical Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-lg pb-2 border-b border-slate-100">
             <Stethoscope className="text-primary-600" />
             <span>Clinical Documentation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-500">Symptoms Presented</label>
                <div className="text-slate-800 bg-red-50 p-3 rounded-lg border border-red-100">
                   {visit.symptoms}
                </div>
             </div>
             
             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-500">Treatment Administered</label>
                <div className="text-slate-800 bg-blue-50 p-3 rounded-lg border border-blue-100">
                   {visit.treatment}
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-500">Clinical Notes (SOAP Format)</label>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {visit.notes}
             </div>
          </div>

          {visit.processedByAI && (
             <div className="flex items-center justify-end text-xs text-indigo-400 mt-4">
                <span className="bg-indigo-50 px-2 py-1 rounded border border-indigo-100 flex items-center">
                   ✨ Processed by Pulse AI
                </span>
             </div>
          )}
      </div>
    </div>
  );
};