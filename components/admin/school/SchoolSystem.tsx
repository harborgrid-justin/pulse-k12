
import React from 'react';
import { School } from '../../../types';
import { Server } from 'lucide-react';

interface SchoolSystemProps {
  school: School;
}

export const SchoolSystem: React.FC<SchoolSystemProps> = ({ school }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        {school.integrations.map((sys, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                    sys.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-600' :
                    sys.status === 'DEGRADED' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                }`}>
                    <Server size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">{sys.name}</h3>
                    <p className="text-xs text-slate-500">Last Sync: {sys.lastSync}</p>
                </div>
            </div>
            <div className="text-right">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-1 ${
                    sys.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    sys.status === 'DEGRADED' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    sys.status === 'ONLINE' ? 'bg-emerald-500' :
                    sys.status === 'DEGRADED' ? 'bg-amber-500' : 'bg-red-500'
                    }`}></div>
                    {sys.status}
                </div>
                <p className="text-xs font-mono text-slate-400">{sys.latencyMs}ms latency</p>
            </div>
        </div>
        ))}
        
        <div className="md:col-span-2 bg-slate-800 text-slate-300 p-6 rounded-xl border border-slate-700 flex justify-between items-center shadow-md">
        <div>
            <h3 className="text-white font-bold mb-1">System Audit Log</h3>
            <p className="text-sm">View full history of data synchronization and access.</p>
        </div>
        <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors shadow-sm">
            View Logs
        </button>
        </div>
    </div>
  );
};
