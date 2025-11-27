
import React, { useState, useMemo, useEffect } from 'react';
import { MessageThread, Student } from '../../types';
import { Search, Send, Lock, Shield, User, Clock, MessageSquare, Filter, Plus, Trash2, X, ChevronLeft } from 'lucide-react';
import { MOCK_STUDENTS } from '../../services/mockData';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select, TextArea } from '../ui/Input';

// Helper to generate mock threads initially
const generateMockThreads = (count: number): MessageThread[] => {
    const subjects = ['Inhaler Refill', 'Fever Follow-up', 'Field Trip Meds', 'Allergy Question', 'Doctor Note', 'Absence Excuse', 'Vaccine Record', 'Injury Check', 'Gym Excuse', 'Lice Check', 'Headache', 'Stomach Bug', 'Flu Shot Info', 'Medication Form', 'Emergency Contact Update'];
    
    const threads: MessageThread[] = [];
    
    for (let i = 0; i < count; i++) {
        const student = MOCK_STUDENTS[i % MOCK_STUDENTS.length];
        if (!student) continue;

        const studentName = `${student.firstName} ${student.lastName}`;
        const parentName = student.parentContact || `Mrs. ${student.lastName}`;
        const subject = subjects[i % subjects.length];
        const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)); 
        const isUnread = Math.random() > 0.8;
        const isUrgent = Math.random() > 0.9;
        
        threads.push({
            id: `t_${i}`,
            studentId: student.id,
            studentName: studentName,
            participants: ['Nurse Joy', parentName],
            subject: subject,
            unreadCount: isUnread ? Math.floor(Math.random() * 3) + 1 : 0,
            tags: isUrgent ? ['URGENT', 'GENERAL'] : ['GENERAL'],
            lastMessage: {
                id: `m_${i}`,
                threadId: `t_${i}`,
                senderId: Math.random() > 0.5 ? 'parent' : 'nurse',
                senderName: Math.random() > 0.5 ? parentName : 'Nurse Joy',
                senderRole: Math.random() > 0.5 ? 'PARENT' : 'NURSE',
                content: Math.random() > 0.5 ? `Thank you for the update regarding ${student.firstName}.` : `Just wanted to confirm if ${student.firstName} stopped by the clinic today?`,
                timestamp: date.toISOString(),
                readBy: isUnread ? [] : ['nurse']
            }
        });
    }
    
    return threads.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
};

export const SecureMessenger: React.FC = () => {
    const [threads, setThreads] = useState<MessageThread[]>([]);
    const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
    const [replyText, setReplyText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Compose State
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [newRecipientId, setNewRecipientId] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newMessageBody, setNewMessageBody] = useState('');

    // Initialize Data
    useEffect(() => {
        setThreads(generateMockThreads(25));
    }, []);

    const filteredThreads = threads.filter(t => 
        t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteThread = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this conversation?')) {
            setThreads(prev => prev.filter(t => t.id !== id));
            if (selectedThread?.id === id) setSelectedThread(null);
        }
    };

    const handleSendMessage = () => {
        if (!selectedThread || !replyText.trim()) return;

        const newMessage = {
            id: `m_${Date.now()}`,
            threadId: selectedThread.id,
            senderId: 'nurse',
            senderName: 'Nurse Joy',
            senderRole: 'NURSE' as const,
            content: replyText,
            timestamp: new Date().toISOString(),
            readBy: ['nurse']
        };

        // Update local thread state to show new message at top and update last message
        const updatedThread = {
            ...selectedThread,
            lastMessage: newMessage,
            unreadCount: 0
        };

        setThreads(prev => [updatedThread, ...prev.filter(t => t.id !== selectedThread.id)]);
        setSelectedThread(updatedThread); // Keep selection but update data
        setReplyText('');
        
        // In a real app, we would fetch the full message history here or push to the message list
    };

    const handleCompose = () => {
        if (!newRecipientId || !newSubject || !newMessageBody) return;

        const student = MOCK_STUDENTS.find(s => s.id === newRecipientId);
        if (!student) return;

        const newThread: MessageThread = {
            id: `t_${Date.now()}`,
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            participants: ['Nurse Joy', student.parentContact],
            subject: newSubject,
            unreadCount: 0,
            tags: ['GENERAL'],
            lastMessage: {
                id: `m_${Date.now()}`,
                threadId: `t_${Date.now()}`,
                senderId: 'nurse',
                senderName: 'Nurse Joy',
                senderRole: 'NURSE',
                content: newMessageBody,
                timestamp: new Date().toISOString(),
                readBy: ['nurse']
            }
        };

        setThreads([newThread, ...threads]);
        setSelectedThread(newThread);
        setIsComposeOpen(false);
        
        // Reset Form
        setNewRecipientId('');
        setNewSubject('');
        setNewMessageBody('');
    };

    return (
        <div className="flex h-full bg-white relative overflow-hidden">
            {/* Thread List (Sidebar on Desktop, Full view on Mobile when no thread selected) */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col absolute md:relative inset-0 z-10 bg-white transition-transform duration-300 ${selectedThread ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                
                {/* List Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg">Messages</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setIsComposeOpen(true)} className="md:hidden p-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700">
                                <Plus size={20} />
                            </button>
                            <button 
                                onClick={() => setIsComposeOpen(true)}
                                className="hidden md:flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors shadow-sm"
                            >
                                <Plus size={14} className="mr-1.5" /> New
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search student or subject..." 
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Scrollable Thread List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredThreads.map(thread => (
                        <div 
                            key={thread.id}
                            onClick={() => setSelectedThread(thread)}
                            className={`group p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors relative ${
                                selectedThread?.id === thread.id ? 'bg-blue-50/50 border-l-4 border-l-primary-500' : 'border-l-4 border-l-transparent'
                            } ${thread.unreadCount > 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center min-w-0">
                                    {thread.unreadCount > 0 && (
                                        <span className="w-2 h-2 bg-primary-600 rounded-full mr-2 shrink-0"></span>
                                    )}
                                    <h4 className={`text-sm truncate ${thread.unreadCount > 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                        {thread.studentName}
                                    </h4>
                                </div>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2 shrink-0">
                                    {new Date(thread.lastMessage.timestamp).toLocaleDateString(undefined, {month: 'short', day:'numeric'})}
                                </span>
                            </div>
                            <p className={`text-xs mb-1 truncate ${thread.unreadCount > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                {thread.subject}
                            </p>
                            <p className="text-xs text-slate-400 truncate pr-6">{thread.lastMessage.content}</p>
                            
                            <div className="flex gap-1 mt-2">
                                {thread.tags.map(tag => (
                                    <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        tag === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Delete Action (Visible on Hover Desktop / Always there but subtle) */}
                            <button 
                                onClick={(e) => handleDeleteThread(e, thread.id)}
                                className="absolute bottom-3 right-3 text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-all p-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {filteredThreads.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No messages found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area (Full screen mobile when selected, Right pane desktop) */}
            <div className={`flex-1 flex flex-col h-full bg-slate-50/30 absolute md:relative inset-0 z-20 bg-white transition-transform duration-300 ${selectedThread ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                {selectedThread ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm shrink-0">
                            <div className="flex items-center min-w-0">
                                <button 
                                    className="md:hidden text-slate-500 mr-3 p-1 hover:bg-slate-100 rounded-full" 
                                    onClick={() => setSelectedThread(null)}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 truncate">{selectedThread.subject}</h3>
                                        <span className="hidden sm:flex bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-2 py-0.5 rounded-full items-center font-medium whitespace-nowrap">
                                            <Lock size={10} className="mr-1" /> Secure
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">{selectedThread.studentName} • {selectedThread.participants.join(', ')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button className="text-slate-400 hover:text-primary-600 p-2 rounded-full hover:bg-slate-50">
                                    <Shield size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="flex justify-center">
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                    Conversation started {new Date(selectedThread.lastMessage.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {/* Mock History Message to flesh out the view */}
                            <div className="flex justify-end animate-fade-in">
                                <div className="bg-primary-600 text-white p-3 rounded-l-xl rounded-tr-xl max-w-[85%] md:max-w-[70%] shadow-sm">
                                    <p className="text-sm leading-relaxed">Hello, I am reaching out regarding {selectedThread.studentName}'s health plan update.</p>
                                    <div className="flex justify-end items-center mt-1 space-x-1 opacity-70">
                                        <span className="text-[10px]">Nurse Joy • {new Date(new Date(selectedThread.lastMessage.timestamp).getTime() - 86400000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                        <Clock size={10} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Last Message */}
                            <div className={`flex animate-fade-in ${selectedThread.lastMessage.senderRole === 'NURSE' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${selectedThread.lastMessage.senderRole === 'NURSE' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${selectedThread.lastMessage.senderRole === 'NURSE' ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'}`}>
                                        <User size={16} />
                                    </div>
                                    <div className={`p-3 rounded-xl shadow-sm text-sm leading-relaxed ${
                                        selectedThread.lastMessage.senderRole === 'NURSE' 
                                        ? 'bg-primary-600 text-white rounded-br-none' 
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                    }`}>
                                        <p>{selectedThread.lastMessage.content}</p>
                                        <div className={`flex items-center mt-1 space-x-1 ${selectedThread.lastMessage.senderRole === 'NURSE' ? 'opacity-70 justify-end' : 'text-slate-400'}`}>
                                            <span className="text-[10px]">{selectedThread.lastMessage.senderName} • {new Date(selectedThread.lastMessage.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-3 md:p-4 bg-white border-t border-slate-200 shrink-0">
                            <div className="relative flex items-center gap-2">
                                <input 
                                    type="text"
                                    placeholder="Type a secure message..."
                                    className="flex-1 pl-4 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!replyText.trim()}
                                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:hover:bg-primary-600 shadow-sm"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-center flex items-center justify-center">
                                <Lock size={10} className="mr-1" /> 
                                End-to-end encrypted. FERPA Compliant.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 p-8 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                            <MessageSquare size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">No Conversation Selected</h3>
                        <p className="text-sm max-w-xs">Choose a thread from the list or start a new secure message.</p>
                        <button 
                            onClick={() => setIsComposeOpen(true)}
                            className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-colors shadow-md"
                        >
                            Compose New Message
                        </button>
                    </div>
                )}
            </div>

            {/* Compose Modal */}
            <Modal
                isOpen={isComposeOpen}
                onClose={() => setIsComposeOpen(false)}
                title="New Secure Message"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsComposeOpen(false)}>Cancel</Button>
                        <Button onClick={handleCompose} disabled={!newRecipientId || !newSubject || !newMessageBody}>
                            <Send size={16} className="mr-2" /> Send
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <Select 
                            label="Recipient (Student/Parent)"
                            value={newRecipientId}
                            onChange={(e) => setNewRecipientId(e.target.value)}
                            options={[
                                { value: '', label: 'Select Recipient...' },
                                ...MOCK_STUDENTS.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName} (Parent: ${s.parentContact})` }))
                            ]}
                        />
                    </div>
                    <div>
                        <Input 
                            label="Subject"
                            placeholder="e.g., Medication Authorization"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                        />
                    </div>
                    <div>
                        <TextArea 
                            label="Message"
                            placeholder="Type your secure message here..."
                            rows={5}
                            value={newMessageBody}
                            onChange={(e) => setNewMessageBody(e.target.value)}
                        />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 flex items-start border border-blue-100">
                        <Shield size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                        Messages sent through this portal are encrypted and visible only to authorized guardians and school health staff.
                    </div>
                </div>
            </Modal>
        </div>
    );
};
