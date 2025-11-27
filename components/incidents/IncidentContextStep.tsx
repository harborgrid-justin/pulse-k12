
import React from 'react';
import { Incident, Student } from '../../types';

interface IncidentContextStepProps {
  students: Student[];
  formData: Partial<Incident>;
  updateField: (field: keyof Incident, value: any) => void;
}

export const IncidentContextStep: React.FC<IncidentContextStepProps> = ({ students, formData, updateField }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student Involved</label>
                <select 
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.studentId || ''}
                    onChange={(e) => updateField('studentId', e.target.value)}
                >
                    <option value="">Select Student...</option>
                    {students.map(s => (
                        <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (Gr {s.grade})</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input 
                        type="date" 
                        className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.date}
                        onChange={(e) => updateField('date', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                    <input 
                        type="time" 
                        className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.time}
                        onChange={(e) => updateField('time', e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <select 
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                >
                    <option value="">Select Location...</option>
                    <option value="PLAYGROUND">Playground</option>
                    <option value="PE">PE / Gym</option>
                    <option value="CLASSROOM">Classroom</option>
                    <option value="BUS">Bus / Transport</option>
                    <option value="CAFETERIA">Cafeteria</option>
                    <option value="SPORTS">Sports Field</option>
                    <option value="HALLWAY">Hallway</option>
                    <option value="RESTROOM">Restroom</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Activity During Incident</label>
                <input 
                    type="text" 
                    placeholder="e.g. Playing Tag, Science Lab, Lunch"
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.activity || ''}
                    onChange={(e) => updateField('activity', e.target.value)}
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Supervising Staff</label>
            <input 
                type="text" 
                placeholder="Name of teacher/staff present"
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.supervisingStaff || ''}
                onChange={(e) => updateField('supervisingStaff', e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Environmental Factors</label>
            <textarea 
                rows={2}
                placeholder="e.g. Wet floor, Broken equipment, Extreme heat"
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.environmentalFactors || ''}
                onChange={(e) => updateField('environmentalFactors', e.target.value)}
            />
        </div>
    </div>
  );
};
