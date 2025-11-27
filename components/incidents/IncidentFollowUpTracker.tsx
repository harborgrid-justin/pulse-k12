
import React, { useState } from 'react';
import { Incident, Student, FollowUpStatus, IncidentFollowUp } from '../../types';
import { ChevronDown, ChevronUp, Clock, CheckCircle, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TextArea, Select } from '../ui/Input';

interface IncidentFollowUpTrackerProps {
  incidents: Incident[];
  students: Student[];
  onUpdateIncident: (incident: Incident) => void;
}

export const IncidentFollowUpTracker: React.FC<IncidentFollowUpTrackerProps> = ({ incidents, students, onUpdateIncident }) => {
  const [expandedFollowUpId, setExpandedFollowUpId] = useState<string | null>(null);
  const [newFollowUpNote, setNewFollowUpNote] = useState('');
  const [newFollowUpStatus, setNewFollowUpStatus] = useState<FollowUpStatus>(FollowUpStatus.IN_PROGRESS);

  const followUps = incidents.filter(i => i.followUpRequired && i.followUpStatus !== FollowUpStatus.COMPLETED && i.followUpStatus !== FollowUpStatus.NO_ACTION_NEEDED);

  const handleAddFollowUpAction = (incident: Incident) => {
      if (!newFollowUpNote.trim()) return;

      const newAction: IncidentFollowUp = {
          id: `fu_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          note: newFollowUpNote,
          conductedBy: 'Nurse Joy',
          outcome: newFollowUpStatus === FollowUpStatus.COMPLETED ? 'Resolved' : 'Ongoing'
      };

      const updatedIncident: Incident = {
          ...incident,
          followUps: [...(incident.followUps || []), newAction],
          followUpStatus: newFollowUpStatus
      };

      onUpdateIncident(updatedIncident);
      setNewFollowUpNote('');
      setExpandedFollowUpId(null);
  };

  if (followUps.length === 0) {
      return (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
            <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2" />
            <h3 className="text-lg font-medium text-slate-700">All Caught Up!</h3>
            <p className="text-slate-500">No pending follow-ups required.</p>
        </div>
      );
  }

  return (
    <div className="space-y-4">
        {followUps.map(inc => {
            const student = students.find(s => s.id === inc.studentId);
            const isExpanded = expandedFollowUpId === inc.id;

            return (
                <div key={inc.id} className="bg-white border border-l-4 border-amber-400 rounded-r-xl shadow-sm animate-fade-in overflow-hidden">
                    <div className="p-6 flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                                <span className="ml-3 text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    Incident: {inc.date}
                                </span>
                            </h3>
                            <p className="text-sm text-slate-600 mt-1 mb-3 max-w-2xl">
                                <span className="font-bold text-slate-700">Event:</span> {inc.description}
                            </p>
                            <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg max-w-2xl">
                                <p className="text-xs font-bold text-amber-800 uppercase mb-1">Action Plan</p>
                                <p className="text-sm text-amber-900">{inc.followUpNotes || 'No specific notes.'}</p>
                                <p className="text-xs text-amber-700 mt-2 flex items-center">
                                    <Clock size={12} className="mr-1" /> Due: {inc.followUpDate || 'ASAP'}
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant={isExpanded ? 'ghost' : 'outline'}
                            onClick={() => setExpandedFollowUpId(isExpanded ? null : inc.id)}
                            icon={isExpanded ? ChevronUp : ChevronDown}
                        >
                            {isExpanded ? 'Close' : 'Log Action'}
                        </Button>
                    </div>

                    {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                            {/* History */}
                            {inc.followUps && inc.followUps.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Action History</h4>
                                    <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                                        {inc.followUps.map((fu, idx) => (
                                            <div key={fu.id} className="pl-4 relative">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                                                <div className="text-sm text-slate-800 font-medium">{fu.note}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    {fu.date} • {fu.conductedBy} • <span className="font-semibold">{fu.outcome}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add New Action */}
                            <Card className="bg-white" title="Log New Action">
                                <div className="space-y-3">
                                    <TextArea 
                                        rows={3}
                                        placeholder="Describe follow-up action taken..."
                                        value={newFollowUpNote}
                                        onChange={(e) => setNewFollowUpNote(e.target.value)}
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="w-48">
                                            <Select 
                                                value={newFollowUpStatus}
                                                onChange={(e) => setNewFollowUpStatus(e.target.value as FollowUpStatus)}
                                                options={[
                                                    { value: FollowUpStatus.IN_PROGRESS, label: 'In Progress' },
                                                    { value: FollowUpStatus.COMPLETED, label: 'Completed' },
                                                    { value: FollowUpStatus.PENDING, label: 'Pending' }
                                                ]}
                                            />
                                        </div>
                                        <Button 
                                            onClick={() => handleAddFollowUpAction(inc)}
                                            disabled={!newFollowUpNote.trim()}
                                            icon={Save}
                                        >
                                            Save Update
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            );
        })}
    </div>
  );
};
