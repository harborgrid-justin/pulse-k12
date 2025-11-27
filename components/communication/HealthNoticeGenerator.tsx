
import React, { useState } from 'react';
import { Send, Printer, FileText, Users } from 'lucide-react';

export const HealthNoticeGenerator: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('LICE');
    
    const TEMPLATES: Record<string, { title: string, content: string }> = {
        LICE: { 
            title: 'Health Alert: Lice Detected in Classroom', 
            content: 'Dear Parents,\n\nA case of head lice has been reported in your child\'s classroom. Please check your child\'s hair carefully tonight for eggs (nits) or live lice.\n\nWe recommend checking daily for the next 10 days. If you find lice, please treat your child and notify the school nurse.' 
        },
        FEVER: {
            title: 'Reminder: School Fever Policy',
            content: 'Dear Parents,\n\nAs we enter flu season, please remember our policy: Students must be fever-free for 24 hours without medication before returning to school.\n\nThank you for helping keep our school healthy.'
        },
        IMMUNIZATION: {
            title: 'Urgent: Updated Immunization Requirements',
            content: 'Dear Parents,\n\nThe state health department has updated requirements for 7th grade entry. Please ensure your child has received the Tdap booster and MCV4 vaccine before the start of next semester.'
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800">Compose Notice</h3>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(TEMPLATES).map(key => (
                            <button
                                key={key}
                                onClick={() => setSelectedTemplate(key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedTemplate === key ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'}`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Recipients</label>
                    <select className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>Grade 1 - All Classes</option>
                        <option>Grade 2 - All Classes</option>
                        <option>Ms. Henson's Class (PK)</option>
                        <option>Whole School (Admin Approval Req)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                    <textarea 
                        rows={10}
                        className="w-full border border-slate-200 bg-white rounded-lg px-4 py-3 text-sm font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500"
                        defaultValue={TEMPLATES[selectedTemplate].content}
                    />
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Preview & Actions</h3>
                
                <div className="bg-white border border-slate-200 p-8 shadow-sm flex-1 mb-6 overflow-y-auto max-h-96">
                    <div className="text-center mb-6 border-b border-slate-100 pb-4">
                        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">School Health Notice</h1>
                        <p className="text-slate-500 text-sm">{new Date().toLocaleDateString()}</p>
                    </div>
                    <h2 className="font-bold text-lg mb-4">{TEMPLATES[selectedTemplate].title}</h2>
                    <p className="whitespace-pre-wrap text-slate-700">{TEMPLATES[selectedTemplate].content}</p>
                    <div className="mt-8 pt-4 border-t border-slate-100">
                        <p className="font-bold text-slate-800">Pulse K12 Clinic</p>
                        <p className="text-sm text-slate-500">West Newton Elementary</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <Printer size={18} className="mr-2" /> Print PDF
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-sm transition-colors">
                        <Send size={18} className="mr-2" /> Send to 120 Parents
                    </button>
                </div>
            </div>
        </div>
    );
};
