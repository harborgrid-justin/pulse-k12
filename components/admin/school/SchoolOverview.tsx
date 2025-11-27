
import React from 'react';
import { School } from '../../../types';
import { Clock, ShieldCheck, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SchoolOverviewProps {
  school: School;
  peakHoursData: any[];
}

export const SchoolOverview: React.FC<SchoolOverviewProps> = ({ school, peakHoursData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <Clock size={20} className="mr-2 text-primary-600" />
            Clinic Peak Utilization
        </h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="visits" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
            </ResponsiveContainer>
        </div>
        </div>

        {/* Staff & Credentials */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <ShieldCheck size={20} className="mr-2 text-primary-600" />
            Staff Credentialing
        </h3>
        <div className="space-y-4">
            {school.staffCredentials.map(cred => (
            <div key={cred.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-full border border-slate-200">
                        <Users size={16} className="text-slate-500" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-sm">{cred.name}</p>
                        <p className="text-xs text-slate-500">{cred.role} • {cred.licenseNumber}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold border ${
                    cred.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    cred.status === 'EXPIRING_SOON' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {cred.status.replace('_', ' ')}
                </div>
            </div>
            ))}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold">Nurse:Student Ratio</p>
                <p className="text-xl font-bold text-slate-800">1 : {school.totalStudents}</p>
                <p className="text-xs text-emerald-600 font-medium">Within Standard</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold">Clinic Capacity</p>
                <p className="text-xl font-bold text-slate-800">85%</p>
                <p className="text-xs text-amber-600 font-medium">High Load</p>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};
