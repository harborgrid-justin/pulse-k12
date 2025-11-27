
import React, { useState } from 'react';
import { Incident, Student } from '../../types';
import { X, AlertTriangle } from 'lucide-react';

interface AddIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (incident: Incident) => void;
  students: Student[];
}

export const AddIncidentModal: React.FC<AddIncidentModalProps> = ({ isOpen, onClose, onAdd, students }) => {
  const [formData, setFormData] = useState<Partial<Incident>>({
    date: new Date().toISOString().split('T')[0],
    severity: 'MINOR',
    type: 'INJURY',
    parentNotified: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.studentId && formData.description) {
      onAdd({
        id: `inc_${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        activity: 'Not Specified',
        status: 'OPEN',
        ...formData as Incident
      });
      onClose();
      setFormData({ date: new Date().toISOString().split('T')[0], severity: 'MINOR', type: 'INJURY', parentNotified: false });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50 rounded-t-2xl">
                <h3 className="text-xl font-bold text-red-800 flex items-center">
                    <AlertTriangle className="mr-2" /> Report Incident
                </h3>
                <button onClick={onClose}><X size={24} className="text-red-400 hover:text-red-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                    <select 
                        required 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2"
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    >
                        <option value="">Select Student</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <input type="date" required className="w-full border border-slate-200 rounded-lg px-3 py-2" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <select className="w-full border border-slate-200 rounded-lg px-3 py-2" onChange={(e) => setFormData({...formData, location: e.target.value as any})}>
                            <option value="PLAYGROUND">Playground</option>
                            <option value="PE">PE / Gym</option>
                            <option value="CLASSROOM">Classroom</option>
                            <option value="BUS">Bus</option>
                            <option value="CAFETERIA">Cafeteria</option>
                            <option value="SPORTS">Sports Field</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select className="w-full border border-slate-200 rounded-lg px-3 py-2" onChange={(e) => setFormData({...formData, type: e.target.value as any})}>
                            <option value="INJURY">Injury</option>
                            <option value="ILLNESS">Illness</option>
                            <option value="BEHAVIORAL">Behavioral</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                        <select className="w-full border border-slate-200 rounded-lg px-3 py-2" onChange={(e) => setFormData({...formData, severity: e.target.value as any})}>
                            <option value="MINOR">Minor</option>
                            <option value="MODERATE">Moderate</option>
                            <option value="SEVERE">Severe</option>
                        </select>
                    </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description of Incident</label>
                        <textarea required className="w-full border border-slate-200 rounded-lg px-3 py-2" rows={3} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Body Part (if injury)</label>
                        <input className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="e.g. Left Knee" onChange={(e) => setFormData({...formData, bodyParts: [e.target.value]})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Provided</label>
                        <input className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="e.g. Ice pack" onChange={(e) => setFormData({...formData, treatmentProvided: e.target.value})} />
                    </div>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="notify" className="mr-2" onChange={(e) => setFormData({...formData, parentNotified: e.target.checked})} />
                    <label htmlFor="notify" className="text-sm text-slate-700">Parent notified immediately</label>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Submit Report
                </button>
            </form>
        </div>
    </div>
  );
};
