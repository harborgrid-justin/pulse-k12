
import React from 'react';
import { VisitLog, Student, Urgency } from '../../types';
import { ArrowLeft, Calendar, Clock, AlertTriangle, FileText, Activity, Stethoscope, Edit2, Sparkles } from 'lucide-react';

interface VisitDetailProps {
  visit: VisitLog;
  student: Student;
  onBack: () => void;
  onSelectStudent: (student: Student) => void;
  onUpdateVisit: (visit: VisitLog) => void;
}

export const VisitDetail: React.FC<VisitDetailProps> = ({ visit, student, onBack, onSelectStudent, onUpdateVisit }) => {
  
  const getUrgencyColor = (u: Urgency) => {
    switch(u) {
      case Urgency.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
      case Urgency.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case Urgency.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
            <ArrowLeft size={18} className="mr-1" />
            Back
        </button>
        <button 
            onClick={() => onUpdateVisit(visit)} 
            className="flex items-center text-primary-600 hover:text-primary-800 font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors text-sm"
        >
            <Edit2 size={16} className="mr-2" />
            Edit Log
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-start space-x-4 w-full md:w-auto">
             <div className="bg-white p-2.5 md:p-3 rounded-lg border border-slate-200 shadow-sm text-primary-600 shrink-0">
               <FileText size={24} className="md:w-8 md:h-8" />
             </div>
             <div className="min-w-0 flex-1">
               <h1 className="text-lg md:text-2xl font-bold text-slate-800 leading-tight truncate">Clinical Visit Record</h1>
               <p className="text-xs text-slate-400 font-mono mt-1 truncate">Log ID: {visit.id}</p>
               <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                  <span className="flex items-center whitespace-nowrap">
                      <Calendar size={14} className="mr-1.5" /> 
                      {new Date(visit.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center whitespace-nowrap">
                      <Clock size={14} className="mr-1.5" /> 
                      {new Date(visit.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
               </div>
             </div>
          </div>
          <div className={`self-start md:self-center px-3 py-1.5 rounded-full font-bold text-xs border flex items-center whitespace-nowrap shrink-0 ${getUrgencyColor(visit.urgency)}`}>
            {visit.urgency === Urgency.HIGH || visit.urgency === Urgency.CRITICAL ? <AlertTriangle size={14} className="mr-1.5" /> : <Activity size={14} className="mr-1.5" />}
            {visit.urgency}
          </div>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Patient Information</h3>
              <div 
                className="flex items-center space-x-3 bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 hover:border-slate-200 transition-colors"
                onClick={() => onSelectStudent(student)}
              >
                  <img src={student.photoUrl} alt={student.firstName} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-slate-200" />
                  <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate text-sm md:text-base">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-slate-500 truncate">Grade {student.grade}</p>
                      <p className="text-xs text-primary-600 mt-0.5 font-medium">View Profile →</p>
                  </div>
              </div>
            </div>

            <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Outcome</h3>
               <div className="p-3 md:p-4 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm md:text-base bg-white">
                  {visit.outcome}
               </div>
            </div>
        </div>
      </div>

      {/* Clinical Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 space-y-6">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-lg pb-2 border-b border-slate-100">
             <Stethoscope className="text-primary-600" size={20} />
             <span>Clinical Documentation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-500">Symptoms Presented</label>
                <div className="text-slate-800 bg-red-50 p-3 rounded-lg border border-red-100 text-sm leading-relaxed">
                   {visit.symptoms}
                </div>
             </div>
             
             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-500">Treatment Administered</label>
                <div className="text-slate-800 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm leading-relaxed">
                   {visit.treatment}
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-500">Clinical Notes (SOAP Format)</label>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-700 font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                {visit.notes}
             </div>
          </div>

          {visit.processedByAI && (
             <div className="flex items-center justify-end text-xs text-indigo-400 mt-4">
                <span className="bg-indigo-50 px-2 py-1 rounded border border-indigo-100 flex items-center">
                   <Sparkles size={12} className="mr-1" /> Processed by Pulse AI
                </span>
             </div>
          )}
      </div>
    </div>
  );
};
