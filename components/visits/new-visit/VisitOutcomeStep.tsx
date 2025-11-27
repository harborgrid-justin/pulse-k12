
import React from 'react';
import { VisitDismissal } from '../../../types';
import { DoorOpen } from 'lucide-react';

interface VisitOutcomeStepProps {
  outcome: string;
  setOutcome: (outcome: string) => void;
  dismissal: Partial<VisitDismissal>;
  setDismissal: (d: Partial<VisitDismissal>) => void;
}

export const VisitOutcomeStep: React.FC<VisitOutcomeStepProps> = ({ outcome, setOutcome, dismissal, setDismissal }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <DoorOpen size={20} className="mr-2 text-primary-600" /> Dismissal & Outcome
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Clinical Outcome</label>
                <select 
                    className="w-full border-slate-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                >
                    <option>Improved</option>
                    <option>Unchanged</option>
                    <option>Worsening</option>
                    <option>Referred to Physician</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Dismissal Type</label>
                <select 
                    className="w-full border-slate-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={dismissal.type}
                    onChange={(e) => setDismissal({...dismissal, type: e.target.value as any})}
                >
                    <option value="RETURN_TO_CLASS">Return to Class</option>
                    <option value="SENT_HOME">Sent Home</option>
                    <option value="PARENT_PICKUP">Parent Pickup</option>
                    <option value="EMS">EMS Transport</option>
                </select>
            </div>
        </div>

        {dismissal.type !== 'RETURN_TO_CLASS' && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Authorized By</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Parent Name"
                        className="w-full border-amber-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={dismissal.authorizedBy || ''}
                        onChange={(e) => setDismissal({...dismissal, authorizedBy: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Time Out</label>
                    <input 
                        type="time" 
                        className="w-full border-amber-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={dismissal.timeOut}
                        onChange={(e) => setDismissal({...dismissal, timeOut: e.target.value})}
                    />
                </div>
            </div>
        )}

        {dismissal.type === 'RETURN_TO_CLASS' && (
            <div className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                <input 
                    type="checkbox" 
                    id="hallpass"
                    className="w-5 h-5 text-primary-600 rounded mr-3 focus:ring-primary-500"
                    checked={dismissal.hallPassIssued}
                    onChange={(e) => setDismissal({...dismissal, hallPassIssued: e.target.checked})}
                />
                <label htmlFor="hallpass" className="font-medium text-slate-700 cursor-pointer">Issue Digital Hall Pass</label>
            </div>
        )}
    </div>
  );
};
