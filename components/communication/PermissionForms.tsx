
import React, { useState, useRef, useEffect } from 'react';
import { PermissionForm } from '../../types';
import { FileText, PenTool, CheckCircle, Clock, Plus, X, Download, Share2, ChevronRight, Eraser, Save } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

const INITIAL_MOCK_FORMS: PermissionForm[] = [
    { id: 'f1', title: 'Prescription Medication Authorization', studentId: 's_1st2', type: 'MEDICATION_AUTH', status: 'SIGNED', dateSent: '2024-08-15', dateSigned: '2024-08-16', expiryDate: '2025-05-20', signedBy: 'Julia Hunt' },
    { id: 'f2', title: 'Field Trip Medical Release', studentId: 's_2nd2', type: 'FIELD_TRIP', status: 'PENDING', dateSent: '2024-09-20', expiryDate: '2024-09-25' },
    { id: 'f3', title: 'Over-the-Counter Medication Consent', studentId: 's_pk1', type: 'MEDICATION_AUTH', status: 'PENDING', dateSent: '2024-09-22', expiryDate: '2025-05-20' },
];

// --- Digital Signature Component ---
const SignaturePad: React.FC<{ onSave: (dataUrl: string) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000';
            }
        }
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        setHasSignature(true);
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        let offsetX = 0, offsetY = 0;
        if ('touches' in e) {
            const rect = canvas.getBoundingClientRect();
            offsetX = e.touches[0].clientX - rect.left;
            offsetY = e.touches[0].clientY - rect.top;
        } else {
            offsetX = (e as React.MouseEvent).nativeEvent.offsetX;
            offsetY = (e as React.MouseEvent).nativeEvent.offsetY;
        }
        return { offsetX, offsetY };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleSave = () => {
        if (!hasSignature) return;
        const canvas = canvasRef.current;
        if (canvas) {
            onSave(canvas.toDataURL());
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                <p className="text-sm text-slate-600 mb-2 font-medium">Please sign within the box below:</p>
                <div className="border-2 border-slate-300 bg-white rounded-lg overflow-hidden touch-none shadow-inner">
                    <canvas 
                        ref={canvasRef}
                        className="w-full h-48 cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                        onMouseLeave={endDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <button onClick={clearCanvas} className="text-xs text-slate-500 hover:text-red-600 flex items-center">
                        <Eraser size={12} className="mr-1" /> Clear Signature
                    </button>
                    <span className="text-xs text-slate-400">I certify that I am the parent/guardian.</span>
                </div>
            </div>
            <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave} disabled={!hasSignature} className="bg-primary-600 text-white">
                    Confirm Signature
                </Button>
            </div>
        </div>
    );
};

export const PermissionForms: React.FC = () => {
    const [forms, setForms] = useState<PermissionForm[]>(INITIAL_MOCK_FORMS);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedForm, setSelectedForm] = useState<PermissionForm | null>(null);
    const [formToSign, setFormToSign] = useState<PermissionForm | null>(null);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'SIGNED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'EXPIRED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const handleSignatureSave = (signatureData: string) => {
        if (!formToSign) return;

        const updatedForms = forms.map(f => {
            if (f.id === formToSign.id) {
                return {
                    ...f,
                    status: 'SIGNED' as const,
                    dateSigned: new Date().toLocaleDateString('en-US'),
                    signatureUrl: signatureData,
                    signedBy: 'Parent/Guardian (Digital In-Person)'
                };
            }
            return f;
        });

        setForms(updatedForms);
        setFormToSign(null);
        // Optionally open details of the just signed form
        const updatedForm = updatedForms.find(f => f.id === formToSign.id);
        if(updatedForm) setSelectedForm(updatedForm);
    };

    return (
        <div className="p-4 md:p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Digital Permission Forms</h3>
                    <p className="text-sm text-slate-500">Manage parent signatures and consent.</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-900 flex items-center justify-center shadow-sm"
                >
                    <Plus size={18} className="mr-2" /> Request Signature
                </button>
            </div>

            <div className="space-y-3">
                {forms.map(form => (
                    <div 
                        key={form.id} 
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-primary-300 transition-all shadow-sm group relative"
                    >
                        <div className="flex items-start justify-between gap-3" onClick={() => setSelectedForm(form)}>
                            <div className="flex items-start gap-3 overflow-hidden cursor-pointer">
                                <div className={`p-3 rounded-lg shrink-0 ${
                                    form.status === 'SIGNED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    <FileText size={24} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-slate-800 truncate pr-2 text-base group-hover:text-primary-700 transition-colors">{form.title}</h4>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">Student ID: {form.studentId}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(form.status)}`}>
                                            {form.status === 'SIGNED' ? <CheckCircle size={10} className="mr-1"/> : <Clock size={10} className="mr-1"/>}
                                            {form.status}
                                        </span>
                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                            Sent: {form.dateSent}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                                <ChevronRight size={20} className="text-slate-300 shrink-0 group-hover:text-primary-400 transition-colors cursor-pointer" onClick={() => setSelectedForm(form)}/>
                                {form.status === 'PENDING' && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setFormToSign(form); }}
                                        className="mt-2 flex items-center bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 shadow-sm transition-colors z-10"
                                    >
                                        <PenTool size={12} className="mr-1.5" /> Sign Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Signing Modal */}
            <Modal
                isOpen={!!formToSign}
                onClose={() => setFormToSign(null)}
                title="Electronic Signature"
                maxWidth="max-w-md"
            >
                {formToSign && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                            <h4 className="font-bold text-blue-900 text-sm mb-1">{formToSign.title}</h4>
                            <p className="text-xs text-blue-800">
                                I, the parent/guardian of the student referenced in this document, hereby acknowledge that I have read and understood the terms and grant permission as requested.
                            </p>
                        </div>
                        <SignaturePad 
                            onSave={handleSignatureSave} 
                            onCancel={() => setFormToSign(null)} 
                        />
                    </div>
                )}
            </Modal>

            {/* View Form Modal (Mobile Friendly Overlay) */}
            {selectedForm && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Form Details</h3>
                            <button onClick={() => setSelectedForm(null)} className="p-1 bg-white rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto">
                            <div className="text-center mb-6">
                                <div className={`inline-flex p-4 rounded-full mb-3 ${
                                    selectedForm.status === 'SIGNED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    <FileText size={40} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 px-4 leading-tight">{selectedForm.title}</h2>
                                <p className="text-slate-500 text-xs mt-1 uppercase font-mono">Ref: {selectedForm.id}</p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 mb-6">
                                <div className="flex justify-between text-sm border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">Current Status</span>
                                    <span className={`font-bold ${selectedForm.status === 'SIGNED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {selectedForm.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Date Sent</span>
                                    <span className="font-medium text-slate-800">{selectedForm.dateSent}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Expiration Date</span>
                                    <span className="font-medium text-slate-800">{selectedForm.expiryDate}</span>
                                </div>
                                {selectedForm.signedBy && (
                                    <div className="pt-3 border-t border-slate-200 mt-3 bg-white p-3 rounded border border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Digital Signature</p>
                                        {selectedForm.signatureUrl ? (
                                            <div className="mb-2 border-b border-slate-100 pb-2">
                                                <img src={selectedForm.signatureUrl} alt="Signature" className="h-12 object-contain" />
                                            </div>
                                        ) : (
                                            <p className="font-serif text-lg text-slate-800 italic mb-1">{selectedForm.signedBy}</p>
                                        )}
                                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                                            <CheckCircle size={10} className="mr-1 text-emerald-500" />
                                            Signed on {selectedForm.dateSigned}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Mock Document Preview */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm opacity-75 select-none relative overflow-hidden group cursor-pointer hover:opacity-100 transition-opacity">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 pointer-events-none"></div>
                                <div className="space-y-3">
                                    <div className="h-2 bg-slate-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-2 bg-slate-100 rounded w-full"></div>
                                    <div className="h-2 bg-slate-100 rounded w-full"></div>
                                    <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                                    <div className="h-2 bg-slate-100 rounded w-full"></div>
                                    <div className="h-2 bg-slate-100 rounded w-4/5"></div>
                                </div>
                                <div className="flex justify-center relative z-10 mt-6">
                                    <button className="text-primary-700 font-bold text-xs flex items-center bg-primary-50 px-4 py-2 rounded-full shadow-sm border border-primary-100">
                                        <Download size={14} className="mr-2" /> Download PDF Record
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                                <Share2 size={18} className="mr-2" /> Resend
                            </button>
                            <button onClick={() => setSelectedForm(null)} className="flex items-center justify-center px-4 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-800">Request Signature</h3>
                            <button onClick={() => setShowCreateModal(false)}><X size={24} className="text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Form Template</label>
                                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none">
                                    <option>Medication Administration Authorization</option>
                                    <option>Medical Treatment Consent</option>
                                    <option>Field Trip Health Release</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                                <input type="text" placeholder="Search student..." className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800 flex items-start">
                                <PenTool size={16} className="mr-2 flex-shrink-0" />
                                Parent will receive a secure link via email/SMS to electronically sign this document.
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
                            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold shadow-sm transition-colors">Send Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
