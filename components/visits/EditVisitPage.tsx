
import React, { useState, useEffect } from 'react';
import { VisitLog, Urgency } from '../../types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface EditVisitPageProps {
  onCancel: () => void;
  onSave: (visit: VisitLog) => void;
  visit: VisitLog;
}

export const EditVisitPage: React.FC<EditVisitPageProps> = ({ onCancel, onSave, visit }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<VisitLog>>({});

  useEffect(() => {
    if (visit) {
      setFormData({
        symptoms: visit.symptoms,
        treatment: visit.treatment,
        outcome: visit.outcome,
        urgency: visit.urgency,
        notes: visit.notes
      });
    }
  }, [visit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onSave({ ...visit, ...formData } as VisitLog);
    setIsSaving(false);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-4">
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800">Edit Visit Log #{visit.id}</h2>
          </div>
        </div>
        
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <form id="edit-visit-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Symptoms</label>
                        <input 
                        className="w-full border border-slate-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={formData.symptoms || ''} 
                        onChange={e => setFormData({...formData, symptoms: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Urgency</label>
                        <select 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" 
                        value={formData.urgency || Urgency.LOW} 
                        onChange={e => setFormData({...formData, urgency: e.target.value as Urgency})}
                        >
                            {Object.values(Urgency).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Treatment</label>
                        <input 
                        className="w-full border border-slate-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                        value={formData.treatment || ''} 
                        onChange={e => setFormData({...formData, treatment: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Outcome</label>
                        <select
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        value={formData.outcome || 'Returned to class'}
                        onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                        >
                            <option value="Returned to class">Returned to class</option>
                            <option value="Sent home">Sent home</option>
                            <option value="EMS / 911">EMS / 911</option>
                            <option value="Parent Pickup">Parent Pickup</option>
                            <option value="Referral to Physician">Referral to Physician</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Clinical Notes</label>
                <textarea 
                    rows={8}
                    className="w-full border border-slate-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
                </div>
            </form>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-4 bg-slate-50">
            <button onClick={onCancel} className="px-6 py-3 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium transition-colors border border-transparent hover:border-slate-200">Cancel</button>
            <button type="submit" form="edit-visit-form" className="px-8 py-3 bg-primary-600 text-white rounded-lg font-bold flex items-center hover:bg-primary-700 shadow-md transition-colors">
                {isSaving ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />} Save Changes
            </button>
        </div>
    </div>
  );
};
