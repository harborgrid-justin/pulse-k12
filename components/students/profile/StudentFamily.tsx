
import React from 'react';
import { Student } from '../../../types';
import { Smartphone, Phone, Mail, Activity, MessageSquare, Clock } from 'lucide-react';

interface StudentFamilyProps {
  student: Student;
}

export const StudentFamily: React.FC<StudentFamilyProps> = ({ student }) => {
  return (
    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parent Portal Management */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <Smartphone size={24} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800">Parent Portal</h3>
                <p className="text-sm text-slate-500">Manage access to health records</p>
            </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Access Status</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${student.parentPortalAccess ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {student.parentPortalAccess ? 'ACTIVE' : 'INACTIVE'}
                </span>
            </div>
            {student.parentPortalAccess && (
                <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Last Login</span>
                <span className="text-sm text-slate-800">{student.lastPortalLogin ? new Date(student.lastPortalLogin).toLocaleDateString() : 'Never'}</span>
                </div>
            )}
        </div>

        <div className="space-y-3">
            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                {student.parentPortalAccess ? 'Reset Password' : 'Invite Parent to Portal'}
            </button>
            <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                View Access Logs
            </button>
        </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Phone size={18} className="mr-2 text-slate-400" />
            Emergency Contacts
        </h3>
        <div className="space-y-4">
            {student.emergencyContacts.map((contact, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${contact.isPrimary ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-slate-800">{contact.name}</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">{contact.relation} {contact.isPrimary && '• PRIMARY'}</p>
                    </div>
                    <a href={`tel:${contact.phone}`} className="p-2 bg-white rounded-full text-primary-600 hover:bg-primary-50 border border-slate-200 shadow-sm transition-colors">
                        <Phone size={16} />
                    </a>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                    <p className="flex items-center"><Phone size={12} className="mr-2 text-slate-400" /> {contact.phone}</p>
                    {contact.email && <p className="flex items-center"><Mail size={12} className="mr-2 text-slate-400" /> {contact.email}</p>}
                    </div>
                </div>
            ))}
        </div>
        </div>

        {/* Communication Log */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <MessageSquare size={18} className="mr-2 text-slate-400" />
                Communication Log
            </h3>
            <div className="divide-y divide-slate-100">
                {student.communicationLogs?.map(log => (
                    <div key={log.id} className="py-4 flex items-start space-x-4">
                        <div className={`p-2 rounded-full mt-1 flex-shrink-0 ${log.direction === 'OUTBOUND' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {log.type === 'EMAIL' ? <Mail size={16} /> : <Phone size={16} />} 
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase ${
                                    log.direction === 'OUTBOUND' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}>
                                    {log.direction}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center"><Clock size={12} className="mr-1" /> {new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="mb-1">
                                <span className="text-sm font-bold text-slate-800">{log.subject || 'Communication Note'}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-1">{log.content}</p>
                            <p className="text-xs text-slate-400">Recorded by: {log.senderName}</p>
                        </div>
                    </div>
                ))}
                {(!student.communicationLogs || student.communicationLogs.length === 0) && (
                    <div className="text-center py-8 text-slate-400">
                        <MessageSquare className="mx-auto mb-2 opacity-20" size={32} />
                        <p className="text-sm">No communication history recorded.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Provider Info */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Activity size={18} className="mr-2 text-slate-400" />
            Provider & Insurance Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">Primary Physician</p>
                <p className="font-semibold text-slate-800">{student.physician?.name || 'Not Listed'}</p>
                <p className="text-sm text-slate-600">{student.physician?.clinic}</p>
                <p className="text-sm text-primary-600 mt-1">{student.physician?.phone}</p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">Insurance Provider</p>
                <p className="font-semibold text-slate-800">{student.insurance?.provider || 'Not Listed'}</p>
                <p className="text-sm text-slate-600">Group: {student.insurance?.groupNumber || 'N/A'}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">Policy Details</p>
                <p className="font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 inline-block text-sm">
                {student.insurance?.policyNumber || 'N/A'}
                </p>
            </div>
        </div>
        </div>
    </div>
  );
};
