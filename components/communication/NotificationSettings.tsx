
import React, { useState } from 'react';
import { Smartphone, Mail } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        injury: { sms: true, email: true, push: true },
        medication: { sms: false, email: true, push: false },
        outbreak: { sms: true, email: true, push: true },
    });

    const toggle = (cat: keyof typeof settings, type: 'sms'|'email'|'push') => {
        setSettings(prev => ({
            ...prev,
            [cat]: { ...prev[cat], [type]: !prev[cat][type] }
        }));
    };

    return (
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Automated Notification Rules</h3>
            <p className="text-slate-500 mb-8 text-sm md:text-base">Configure which events trigger automatic alerts to parents.</p>

            <div className="space-y-4">
                {/* Rule 1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-base">Incident & Injury Reports</h4>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">When a new injury is logged with Moderate severity or higher.</p>
                    </div>
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                        <button onClick={() => toggle('injury', 'sms')} className={`flex-1 sm:flex-none p-2.5 rounded-lg border transition-colors flex items-center justify-center ${settings.injury.sms ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`} title="SMS">
                            <Smartphone size={20} className="mr-1.5 sm:mr-0" />
                            <span className="sm:hidden text-xs font-bold">SMS</span>
                        </button>
                        <button onClick={() => toggle('injury', 'email')} className={`flex-1 sm:flex-none p-2.5 rounded-lg border transition-colors flex items-center justify-center ${settings.injury.email ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`} title="Email">
                            <Mail size={20} className="mr-1.5 sm:mr-0" />
                            <span className="sm:hidden text-xs font-bold">Email</span>
                        </button>
                    </div>
                </div>

                {/* Rule 2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-base">Medication Administration</h4>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">When a scheduled or PRN dose is administered.</p>
                    </div>
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                        <button onClick={() => toggle('medication', 'sms')} className={`flex-1 sm:flex-none p-2.5 rounded-lg border transition-colors flex items-center justify-center ${settings.medication.sms ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`} title="SMS">
                            <Smartphone size={20} className="mr-1.5 sm:mr-0" />
                            <span className="sm:hidden text-xs font-bold">SMS</span>
                        </button>
                        <button onClick={() => toggle('medication', 'email')} className={`flex-1 sm:flex-none p-2.5 rounded-lg border transition-colors flex items-center justify-center ${settings.medication.email ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`} title="Email">
                            <Mail size={20} className="mr-1.5 sm:mr-0" />
                            <span className="sm:hidden text-xs font-bold">Email</span>
                        </button>
                    </div>
                </div>

                {/* Rule 3 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-base">Health Alerts (Lice/Flu)</h4>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">When a classroom-wide notice is generated.</p>
                    </div>
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                        <button onClick={() => toggle('outbreak', 'sms')} className={`flex-1 sm:flex-none p-2.5 rounded-lg border transition-colors flex items-center justify-center ${settings.outbreak.sms ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`} title="SMS">
                            <Smartphone size={20} className="mr-1.5 sm:mr-0" />
                            <span className="sm:hidden text-xs font-bold">SMS</span>
                        </button>
                        <button onClick={() => toggle('outbreak', 'email')} className={`flex-1 sm:flex-none p-2.5 rounded-lg border transition-colors flex items-center justify-center ${settings.outbreak.email ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`} title="Email">
                            <Mail size={20} className="mr-1.5 sm:mr-0" />
                            <span className="sm:hidden text-xs font-bold">Email</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
