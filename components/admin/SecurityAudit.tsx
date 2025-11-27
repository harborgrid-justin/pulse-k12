
import React from 'react';
import { AuditLogEntry } from '../../types';
import { ShieldAlert, Lock, Download, Search } from 'lucide-react';

interface SecurityAuditProps {
  logs: AuditLogEntry[];
}

export const SecurityAudit: React.FC<SecurityAuditProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center bg-slate-800 text-white p-6 rounded-xl shadow-lg">
            <div>
                <h2 className="text-2xl font-bold flex items-center">
                    <ShieldAlert className="mr-3" /> Security & Compliance Audit
                </h2>
                <p className="text-slate-300">HIPAA/FERPA Access Logs and System Activity.</p>
            </div>
            <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center hover:bg-slate-100 transition-colors">
                <Download size={18} className="mr-2" /> Export Audit Log
            </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-slate-500 text-sm">
                    <Lock size={14} />
                    <span>All access is logged and immutable.</span>
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Search user or action..." className="pl-8 pr-3 py-1 text-sm border border-slate-200 rounded-md" />
                </div>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Action</th>
                        <th className="px-6 py-3">Resource</th>
                        <th className="px-6 py-3">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-mono text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-3 font-medium text-slate-800">{log.user}</td>
                            <td className="px-6 py-3 text-slate-500">{log.role}</td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    log.action === 'VIEW' ? 'bg-blue-50 text-blue-600' :
                                    log.action === 'EDIT' ? 'bg-amber-50 text-amber-600' :
                                    log.action === 'DELETE' ? 'bg-red-50 text-red-600' :
                                    'bg-emerald-50 text-emerald-600'
                                }`}>
                                    {log.action}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-slate-600">{log.resource}</td>
                            <td className="px-6 py-3 text-slate-500 italic">{log.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
