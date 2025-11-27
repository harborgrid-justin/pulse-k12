
import React, { useState } from 'react';
import { Building2, Search, Phone, Mail, MessageSquare, Globe, MapPin, Trash2, Eye, Send, Inbox, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DirectorySchool } from '../../types';

interface InterSchoolMessage {
    id: string;
    schoolId: string;
    schoolName: string;
    recipientName: string;
    subject: string;
    content: string;
    timestamp: string;
    status: 'SENT' | 'DELIVERED' | 'READ';
}

interface ExternalDirectoryProps {
    schools: DirectorySchool[];
}

export const ExternalDirectory: React.FC<ExternalDirectoryProps> = ({ schools }) => {
    const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'LOG'>('DIRECTORY');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchool, setSelectedSchool] = useState<DirectorySchool | null>(null);
    const [viewMessage, setViewMessage] = useState<InterSchoolMessage | null>(null);
    
    // Compose State
    const [messageSubject, setMessageSubject] = useState('Student Transfer Records Request');
    const [messageText, setMessageText] = useState('');

    // Mock Sent Messages (Local State for UI demo)
    const [messages, setMessages] = useState<InterSchoolMessage[]>([
        {
            id: 'msg_1',
            schoolId: 'sch_fair',
            schoolName: 'Fairview Elementary',
            recipientName: 'Dr. LaMoyne Brunson',
            subject: 'Communicable Disease Alert - Lice',
            content: 'Notifying you of a confirmed case in a sibling that attends your school. Please check student [Redacted].',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'READ'
        },
        {
            id: 'msg_2',
            schoolId: 'sch_liv',
            schoolName: 'Livingston Elementary',
            recipientName: 'Clinic Nurse',
            subject: 'Immunization Record Request',
            content: 'Requesting Form 3231 for transfer student Sarah Jenkins (DOB 05/12/2016).',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            status: 'DELIVERED'
        }
    ]);

    const filteredSchools = schools.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.principal.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMessages = messages.filter(m => 
        m.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendMessage = () => {
        if (!selectedSchool || !messageText.trim()) return;

        const newMessage: InterSchoolMessage = {
            id: `msg_${Date.now()}`,
            schoolId: selectedSchool.id,
            schoolName: selectedSchool.name,
            recipientName: selectedSchool.principal,
            subject: messageSubject,
            content: messageText,
            timestamp: new Date().toISOString(),
            status: 'SENT'
        };

        setMessages([newMessage, ...messages]);
        
        // Reset & Close
        setSelectedSchool(null);
        setMessageText('');
        setMessageSubject('Student Transfer Records Request');
        
        // Provide Feedback (Toast simulation)
        alert(`Secure message sent to ${selectedSchool.name}`);
    };

    const handleDeleteMessage = (id: string) => {
        if (confirm('Are you sure you want to delete this message record?')) {
            setMessages(messages.filter(m => m.id !== id));
            if (viewMessage?.id === id) setViewMessage(null);
        }
    };

    return (
        <div className="h-full flex flex-col animate-fade-in p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">District Clinic Directory</h3>
                    <p className="text-sm text-slate-500">Newton County Schools (NCSS)</p>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('DIRECTORY')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center ${activeTab === 'DIRECTORY' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Building2 size={16} className="mr-2" /> Directory
                    </button>
                    <button 
                        onClick={() => setActiveTab('LOG')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center ${activeTab === 'LOG' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Inbox size={16} className="mr-2" /> Message Log
                        <span className="ml-2 bg-slate-200 text-slate-600 text-xs px-1.5 rounded-full">{messages.length}</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder={activeTab === 'DIRECTORY' ? "Search schools..." : "Search message history..."}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content Area */}
            {activeTab === 'DIRECTORY' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-6 pr-2 flex-1 min-h-0">
                    {filteredSchools.map(school => (
                        <div key={school.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex flex-col h-full">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Building2 size={20} />
                                </div>
                                {school.name.includes('West Newton') && (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-200">
                                        YOUR SCHOOL
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="text-base font-bold text-slate-800 mb-1 leading-tight">{school.name}</h3>
                            <div className="flex items-start text-xs text-slate-500 mb-4 min-h-[40px]">
                                <MapPin size={14} className="mr-1 mt-0.5 shrink-0" /> {school.address}
                            </div>

                            <div className="space-y-2 mb-6 flex-1 border-t border-slate-50 pt-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 uppercase font-bold">Clinic Phone</span>
                                    <span className="font-medium text-slate-700">{school.phone}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 uppercase font-bold">Principal</span>
                                    <span className="font-medium text-slate-700 truncate max-w-[140px]" title={school.principal}>{school.principal}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button 
                                    onClick={() => setSelectedSchool(school)}
                                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center shadow-sm group"
                                >
                                    <MessageSquare size={16} className="mr-2 text-slate-400 group-hover:text-primary-600" /> Message
                                </button>
                                <a 
                                    href={`tel:${school.phone}`}
                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors shadow-sm"
                                >
                                    <Phone size={18} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 font-semibold text-slate-600">Recipient School</th>
                                    <th className="px-4 md:px-6 py-3 font-semibold text-slate-600 hidden md:table-cell">Subject</th>
                                    <th className="px-4 md:px-6 py-3 font-semibold text-slate-600">Date</th>
                                    <th className="px-4 md:px-6 py-3 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredMessages.map(msg => (
                                    <tr key={msg.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setViewMessage(msg)}>
                                        <td className="px-4 md:px-6 py-4">
                                            <p className="font-bold text-slate-800">{msg.schoolName}</p>
                                            <p className="text-xs text-slate-500">{msg.recipientName}</p>
                                            {/* Mobile only subject */}
                                            <p className="text-xs text-slate-600 md:hidden mt-1 truncate">{msg.subject}</p>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-slate-600 hidden md:table-cell max-w-xs truncate">
                                            {msg.subject}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-slate-600 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Clock size={12} className="mr-1.5 text-slate-400" />
                                                {new Date(msg.timestamp).toLocaleDateString()}
                                            </div>
                                            <div className="mt-1">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                                                    msg.status === 'READ' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                    {msg.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setViewMessage(msg); }}
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredMessages.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 bg-slate-50/50">
                                            <Inbox size={32} className="mx-auto mb-2 opacity-20" />
                                            No messages found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Compose Modal */}
            <Modal
                isOpen={!!selectedSchool}
                onClose={() => setSelectedSchool(null)}
                title={
                    <div className="flex items-center">
                        <MessageSquare className="mr-2 text-primary-600" size={20} />
                        <span className="truncate max-w-[200px] sm:max-w-none">Message {selectedSchool?.name}</span>
                    </div>
                }
                maxWidth="max-w-lg"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setSelectedSchool(null)}>Cancel</Button>
                        <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                            <Send size={16} className="mr-2" /> Send Securely
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                        <div className="mr-3 mt-0.5 text-blue-600"><Building2 size={18} /></div>
                        <div>
                            <p className="text-sm text-blue-900 font-medium">Inter-School Communication</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Message routed to the <strong>Clinic Nurse</strong> at {selectedSchool?.name}.
                                <br/>For emergencies, please call <strong>{selectedSchool?.phone}</strong> directly.
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <select 
                            className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={messageSubject}
                            onChange={(e) => setMessageSubject(e.target.value)}
                        >
                            <option>Student Transfer Records Request</option>
                            <option>Immunization Verification</option>
                            <option>Sibling Contact Info Inquiry</option>
                            <option>Communicable Disease Alert</option>
                            <option>General Inquiry</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Secure Message</label>
                        <textarea 
                            rows={5}
                            className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                            placeholder="Type your secure message here. Do not include full SSN..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
            </Modal>

            {/* View Message Details Modal */}
            <Modal
                isOpen={!!viewMessage}
                onClose={() => setViewMessage(null)}
                title="Message Details"
                maxWidth="max-w-md"
                footer={
                    <div className="flex justify-between w-full">
                        <Button variant="danger" onClick={() => viewMessage && handleDeleteMessage(viewMessage.id)} icon={Trash2}>Delete</Button>
                        <Button variant="secondary" onClick={() => setViewMessage(null)}>Close</Button>
                    </div>
                }
            >
                {viewMessage && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Sent To</p>
                                <p className="text-lg font-bold text-slate-800">{viewMessage.schoolName}</p>
                                <p className="text-sm text-slate-600">{viewMessage.recipientName}</p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                    viewMessage.status === 'READ' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {viewMessage.status}
                                </span>
                                <p className="text-xs text-slate-400 mt-1">{new Date(viewMessage.timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Subject</p>
                            <p className="text-sm font-medium text-slate-800">{viewMessage.subject}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-2">Content</p>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {viewMessage.content}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
