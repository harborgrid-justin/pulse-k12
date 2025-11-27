
import React from 'react';
import { Student } from '../../../types';
import { MessageSquare, X, Shield, Send } from 'lucide-react';

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const CommunicationModal: React.FC<CommunicationModalProps> = ({ isOpen, onClose, student }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <MessageSquare className="mr-2 text-primary-600" />
                    Secure Message
                </h3>
                <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                    <input disabled value={`${student.parentContact} (Parent/Guardian)`} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2">
                        <option>Health Notification</option>
                        <option>Medication Request</option>
                        <option>Screening Results</option>
                        <option>Incident Report</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Type your secure message here..."></textarea>
                </div>
                <div className="flex items-center text-xs text-slate-500 bg-blue-50 p-2 rounded">
                    <Shield size={12} className="mr-1 text-blue-500" />
                    This message will be sent via the secure parent portal and is HIPAA compliant.
                </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
                <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
                <button onClick={onClose} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center">
                    <Send size={16} className="mr-2" />
                    Send Securely
                </button>
            </div>
        </div>
    </div>
  );
};
