
import React from 'react';
import { Incident, FollowUpStatus } from '../../types';
import { AlertTriangle, Save, Clock, CheckCircle } from 'lucide-react';

interface IncidentNotificationStepProps {
  formData: Partial<Incident>;
  updateField: (field: keyof Incident, value: any) => void;
  onSubmit: () => void;
}

export const IncidentNotificationStep: React.FC<IncidentNotificationStepProps> = ({ formData, updateField, onSubmit }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        {/* Parent Notification Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Parent Notification</h3>
            
            <div className="flex items-center mb-4">
                <input 
                    type="checkbox" 
                    id="notify" 
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-slate-300 cursor-pointer"
                    checked={formData.parentNotified || false}
                    onChange={(e) => updateField('parentNotified', e.target.checked)}
                />
                <label htmlFor="notify" className="ml-3 text-slate-700 font-medium cursor-pointer">Parent has been notified</label>
            </div>

            {formData.parentNotified && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 animate-fade-in">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Method</label>
                        <select 
                            className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={formData.notificationMethod || 'PHONE'}
                            onChange={(e) => updateField('notificationMethod', e.target.value)}
                        >
                            <option value="PHONE">Phone Call</option>
                            <option value="EMAIL">Email</option>
                            <option value="SMS">SMS Text</option>
                            <option value="PORTAL">Parent Portal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                        <input 
                            type="time"
                            className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={formData.notificationTime || ''}
                            onChange={(e) => updateField('notificationTime', e.target.value)}
                        />
                    </div>
                </div>
            )}
            
            {!formData.parentNotified && (
                <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-100 flex items-start">
                    <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    Standard protocol requires parent notification for all Head Injuries, Bites, and incidents marked Moderate or higher.
                </div>
            )}
        </div>

        {/* Follow-up Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-primary-600" />
                Follow-up & Action Plan
            </h3>

            <div className="flex items-center mb-6">
                <input 
                    type="checkbox" 
                    id="followup" 
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-slate-300 cursor-pointer"
                    checked={formData.followUpRequired || false}
                    onChange={(e) => {
                        updateField('followUpRequired', e.target.checked);
                        if(e.target.checked) updateField('followUpStatus', FollowUpStatus.PENDING);
                        else updateField('followUpStatus', FollowUpStatus.NO_ACTION_NEEDED);
                    }}
                />
                <label htmlFor="followup" className="ml-3 text-slate-700 font-medium cursor-pointer">Follow-up Required</label>
            </div>

            {formData.followUpRequired && (
                <div className="grid grid-cols-1 gap-6 pl-8 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                            <select 
                                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={formData.followUpStatus || FollowUpStatus.PENDING}
                                onChange={(e) => updateField('followUpStatus', e.target.value)}
                            >
                                <option value={FollowUpStatus.PENDING}>Pending</option>
                                <option value={FollowUpStatus.IN_PROGRESS}>In Progress</option>
                                <option value={FollowUpStatus.COMPLETED}>Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                            <input 
                                type="date"
                                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={formData.followUpDate || ''}
                                onChange={(e) => updateField('followUpDate', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Follow-up Notes / Plan</label>
                        <textarea 
                            rows={3}
                            className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g., Check concussion symptoms in 24 hours, Verify doctor's note..."
                            value={formData.followUpNotes || ''}
                            onChange={(e) => updateField('followUpNotes', e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-end">
            <button 
                onClick={onSubmit}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200 transition-all flex items-center"
            >
                <Save size={20} className="mr-2" />
                Submit Final Report
            </button>
        </div>
    </div>
  );
};
