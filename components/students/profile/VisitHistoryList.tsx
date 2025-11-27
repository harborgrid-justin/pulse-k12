
import React from 'react';
import { VisitLog, Urgency } from '../../../types';
import { FileText, Calendar, Clock, ChevronRight } from 'lucide-react';

interface VisitHistoryListProps {
  visits: VisitLog[];
  onVisitClick?: (visit: VisitLog) => void;
}

export const VisitHistoryList: React.FC<VisitHistoryListProps> = ({ visits, onVisitClick }) => {
  const getUrgencyColor = (u: Urgency) => {
    switch(u) {
      case Urgency.CRITICAL:
      case Urgency.HIGH: return 'bg-red-100 text-red-700';
      case Urgency.MEDIUM: return 'bg-amber-100 text-amber-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center">
            <FileText size={18} className="mr-2 text-primary-600" />
            Clinic Visit History
        </h3>
        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
            {visits.length} Records
        </span>
        </div>
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
        {visits.map(visit => (
            <div 
                key={visit.id} 
                onClick={() => onVisitClick && onVisitClick(visit)}
                className={`p-6 hover:bg-slate-50 transition-colors ${onVisitClick ? 'cursor-pointer group' : ''}`}
            >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center text-sm text-slate-500">
                    <Calendar size={14} className="mr-1" />
                    {new Date(visit.timestamp).toLocaleDateString()} 
                    <Clock size={14} className="ml-3 mr-1" />
                    {new Date(visit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${getUrgencyColor(visit.urgency)}`}>
                        {visit.urgency}
                    </span>
                    {onVisitClick && <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />}
                </div>
            </div>
            <p className="font-semibold text-slate-800 mb-1">{visit.symptoms}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Treatment</p>
                    <p className="text-sm text-slate-700">{visit.treatment}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Outcome</p>
                    <p className="text-sm text-slate-700">{visit.outcome}</p>
                </div>
            </div>
            {visit.notes && (
                <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                "{visit.notes}"
                </div>
            )}
            </div>
        ))}
        {visits.length === 0 && (
            <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No visit history</p>
            <p className="text-slate-400 text-sm">Visits logged for this student will appear here.</p>
            </div>
        )}
        </div>
    </div>
  );
};
