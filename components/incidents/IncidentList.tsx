
import React, { useState } from 'react';
import { Incident, Student, FollowUpStatus } from '../../types';
import { MapPin, ChevronDown, ChevronUp, Calendar, Clock, User, Activity, FileText } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface IncidentListProps {
  incidents: Incident[];
  students: Student[];
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents, students }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            {/* Responsive Table Wrapper */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm min-w-[1000px]">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 w-48">Date & Time</th>
                            <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 w-64">Student</th>
                            <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 w-48">Type / Location</th>
                            <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 w-32">Severity</th>
                            <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 w-48">Action / Status</th>
                            <th className="px-4 md:px-6 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {incidents.map(inc => {
                            const student = students.find(s => s.id === inc.studentId);
                            const isExpanded = expandedId === inc.id;
                            
                            return (
                                <React.Fragment key={inc.id}>
                                    <tr 
                                        onClick={() => toggleExpand(inc.id)}
                                        className={`cursor-pointer transition-colors group ${isExpanded ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}
                                    >
                                        <td className="px-4 md:px-6 py-4 text-slate-600 whitespace-nowrap">
                                            <div className="flex items-center font-medium text-slate-700">
                                                <Calendar size={14} className="mr-1.5 text-slate-400" />
                                                {inc.date}
                                            </div>
                                            <div className="flex items-center text-xs text-slate-500 mt-1">
                                                <Clock size={12} className="mr-1.5" />
                                                {inc.time}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3 border border-slate-200 shrink-0 overflow-hidden">
                                                    {student ? <img src={student.photoUrl} className="w-full h-full object-cover" alt=""/> : <User size={14}/>}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-800 truncate">{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500 font-normal">Grade {student?.grade}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-700">{inc.type}</div>
                                            <div className="text-xs text-slate-500 flex items-center mt-1">
                                                <MapPin size={12} className="mr-1" /> {inc.location}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            <Badge variant={
                                                inc.severity === 'CRITICAL' || inc.severity === 'SEVERE' ? 'error' :
                                                inc.severity === 'MODERATE' ? 'warning' : 'info'
                                            }>
                                                {inc.severity}
                                            </Badge>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col items-start gap-1">
                                                {inc.followUpRequired && inc.followUpStatus !== FollowUpStatus.COMPLETED ? (
                                                    <Badge variant="warning">F/U: {inc.followUpStatus}</Badge>
                                                ) : (
                                                    <Badge variant="neutral">{inc.status}</Badge>
                                                )}
                                                {inc.parentNotified && (
                                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                                                        Parent Notified
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right text-slate-400">
                                            <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                <ChevronDown size={18} className="group-hover:text-slate-600" />
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {/* Expanded Detail Row */}
                                    {isExpanded && (
                                        <tr className="bg-slate-50/50 border-b border-slate-200 shadow-inner">
                                            <td colSpan={6} className="px-4 md:px-6 py-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
                                                    <div className="lg:col-span-2 space-y-4">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                                                <FileText size={14} className="mr-1.5" /> Description of Incident
                                                            </h4>
                                                            <div className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed shadow-sm">
                                                                {inc.description}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Activity</h4>
                                                                <p className="text-sm text-slate-800 font-medium">{inc.activity}</p>
                                                            </div>
                                                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Supervising Staff</h4>
                                                                <p className="text-sm text-slate-800 font-medium">{inc.supervisingStaff || 'None listed'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                                                                <Activity size={14} className="mr-1.5 text-primary-600" /> Clinical Response
                                                            </h4>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-xs text-slate-400 font-bold mb-1">Treatment Provided</p>
                                                                    <p className="text-sm text-slate-800 font-medium">{inc.treatmentProvided}</p>
                                                                </div>
                                                                {inc.bodyParts && inc.bodyParts.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs text-slate-400 font-bold mb-1">Injured Area(s)</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {inc.bodyParts.map(bp => (
                                                                                <span key={bp} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100 font-bold">
                                                                                    {bp}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {inc.witnesses && inc.witnesses.length > 0 && (
                                                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Witnesses</h4>
                                                                <ul className="text-sm text-slate-600 list-disc pl-4 space-y-1">
                                                                    {inc.witnesses.map((w, i) => (
                                                                        <li key={i}>{w.name} <span className="text-xs text-slate-400">({w.role})</span></li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {incidents.length === 0 && (
                <div className="p-12 text-center text-slate-400 italic flex flex-col items-center justify-center h-full">
                    <FileText size={32} className="mb-2 opacity-20" />
                    <p>No incidents recorded yet.</p>
                </div>
            )}
        </div>
    </div>
  );
};
