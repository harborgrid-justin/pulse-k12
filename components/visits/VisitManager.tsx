
import React from 'react';
import { VisitLog, Student, Urgency } from '../../types';
import { Plus, ChevronRight, Clock, Calendar, Activity, User, Stethoscope, ArrowRight } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface VisitManagerProps {
  visits: VisitLog[];
  students: Student[];
  onAddVisit: () => void;
  onUpdateVisit: (visit: VisitLog) => void;
  onViewVisitDetail: (visit: VisitLog) => void;
  preSelectedStudent?: Student | null;
}

// Mobile Card Component
const MobileVisitCard: React.FC<{ visit: VisitLog; student?: Student; onClick: () => void }> = ({ visit, student, onClick }) => {
    const getUrgencyVariant = (u: Urgency) => {
        switch(u) {
            case Urgency.CRITICAL: return 'error';
            case Urgency.HIGH: return 'error';
            case Urgency.MEDIUM: return 'warning';
            default: return 'success';
        }
    };

    return (
        <div 
            onClick={onClick} 
            className="bg-white rounded-xl border border-slate-200 shadow-sm mb-3 active:scale-[0.98] transition-all overflow-hidden group cursor-pointer"
        >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center text-slate-500 text-xs font-medium">
                    <Calendar size={12} className="mr-1.5" />
                    {new Date(visit.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    <span className="mx-2 text-slate-300">|</span>
                    <Clock size={12} className="mr-1.5" />
                    {new Date(visit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <Badge variant={getUrgencyVariant(visit.urgency)} className="text-[10px] px-2 h-5">
                    {visit.urgency}
                </Badge>
            </div>
            
            <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0 overflow-hidden border border-slate-100">
                        {student ? <img src={student.photoUrl} className="w-full h-full object-cover" alt="" /> : <User size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-800 text-sm truncate">
                            {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">Grade {student?.grade || 'N/A'}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Reason</span>
                        <p className="text-sm font-medium text-slate-800 truncate">{visit.symptoms}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-2">
                            <Stethoscope size={14} className="text-blue-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-900 leading-relaxed line-clamp-2">
                                <span className="font-semibold">Tx:</span> {visit.treatment}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center text-xs text-slate-600 font-medium">
                    <span className={`w-2 h-2 rounded-full mr-2 ${visit.outcome === 'Returned to class' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    {visit.outcome}
                </div>
                <button className="text-primary-600 text-xs font-bold flex items-center hover:bg-primary-50 px-2 py-1 rounded transition-colors">
                    Details <ArrowRight size={12} className="ml-1" />
                </button>
            </div>
        </div>
    );
};

// Memoized Row Component for Desktop
const VisitRow = React.memo<{ 
    visit: VisitLog; 
    student: Student | undefined; 
    onClick: (v: VisitLog) => void; 
}>(({ visit, student, onClick }) => {
    
    const getUrgencyVariant = (u: Urgency) => {
        switch(u) {
            case Urgency.CRITICAL: return 'error';
            case Urgency.HIGH: return 'error';
            case Urgency.MEDIUM: return 'warning';
            default: return 'success';
        }
    };

    return (
        <tr 
            className="hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => onClick(visit)}
        >
            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                {new Date(visit.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </td>
            <td className="px-6 py-4">
                <div className="font-medium text-slate-800">
                {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                {student && (
                    <span className="ml-2 text-xs text-slate-500 font-normal block sm:inline">
                    (Parent: {student.parentContact})
                    </span>
                )}
                </div>
            </td>
            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{visit.symptoms}</td>
            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{visit.treatment}</td>
            <td className="px-6 py-4">
                <Badge variant={getUrgencyVariant(visit.urgency)}>
                {visit.urgency}
                </Badge>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" icon={ChevronRight} className="text-slate-300 hover:text-slate-600" />
                </div>
            </td>
        </tr>
    );
});

VisitRow.displayName = 'VisitRow';

export const VisitManager: React.FC<VisitManagerProps> = ({ visits, students, onAddVisit, onUpdateVisit, onViewVisitDetail, preSelectedStudent }) => {
  return (
    <div className="space-y-6 animate-fade-in relative h-full flex flex-col">
      <PageHeader 
        title="Clinical Visits" 
        subtitle="Log and track student health encounters."
        actions={
            <Button onClick={onAddVisit} icon={Plus}>Log Visit</Button>
        }
      />

      {/* Mobile List View */}
      <div className="md:hidden pb-20">
          {visits.map(visit => (
              <MobileVisitCard 
                key={visit.id}
                visit={visit}
                student={students.find(s => s.id === visit.studentId)}
                onClick={() => onViewVisitDetail(visit)}
              />
          ))}
          {visits.length === 0 && (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No visits found.
            </div>
          )}
      </div>

      {/* Desktop Table View */}
      <Card noPadding className="hidden md:block flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Time</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Student & Contact</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Symptom</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Treatment</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Urgency</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.map((visit) => (
                <VisitRow 
                    key={visit.id} 
                    visit={visit} 
                    student={students.find(s => s.id === visit.studentId)}
                    onClick={onViewVisitDetail}
                />
              ))}
            </tbody>
          </table>
        </div>
        {visits.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No visits recorded yet.
          </div>
        )}
      </Card>
    </div>
  );
};
