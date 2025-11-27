
import React, { useState } from 'react';
import { ImmunizationRecord } from '../../../types';
import { GeminiService } from '../../../services/geminiService';
import { AthenaService } from '../../../services/athenaService';
import { X, Save } from 'lucide-react';
import { ImmunizationUpload } from './immunization/ImmunizationUpload';
import { ImmunizationForm } from './immunization/ImmunizationForm';

interface SmartImmunizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: ImmunizationRecord) => void;
  studentId: string;
}

export const SmartImmunizationModal: React.FC<SmartImmunizationModalProps> = ({ isOpen, onClose, onSave, studentId }) => {
  const [mode, setMode] = useState<'MANUAL' | 'UPLOAD'>('UPLOAD');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ImmunizationRecord>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    doseNumber: 1,
    totalDoses: 2,
    status: 'COMPLIANT',
    manufacturer: '',
    lotNumber: '',
    site: '',
    verified: true
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setIsAnalyzing(true);
        
        // Strip prefix for API
        const base64Data = base64String.split(',')[1];
        
        try {
          const result = await GeminiService.extractImmunizationFromImage(base64Data);
          if (result.vaccines && result.vaccines.length > 0) {
            const extracted = result.vaccines[0];
            setFormData(prev => ({
              ...prev,
              name: extracted.name,
              date: extracted.date,
              manufacturer: extracted.manufacturer,
              lotNumber: extracted.lotNumber,
              documentUrl: 'uploaded_scan_reference_id' // In real app, upload URL
            }));
            setMode('MANUAL'); // Switch to verify
          }
        } catch (error) {
          console.error("OCR Failed", error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const record: ImmunizationRecord = {
        id: `new_${Date.now()}`,
        name: formData.name!,
        date: formData.date!,
        doseNumber: formData.doseNumber || 1,
        totalDoses: formData.totalDoses || 1,
        compliant: formData.status === 'COMPLIANT',
        status: formData.status as any,
        manufacturer: formData.manufacturer,
        lotNumber: formData.lotNumber,
        site: formData.site,
        verified: true,
        documentUrl: formData.documentUrl,
        isExempt: formData.status === 'EXEMPT',
        exemptionType: formData.exemptionType,
    };
    
    await AthenaService.createImmunization(studentId, record);
    onSave(record);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">Add Immunization Record</h3>
                <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
            </div>

            <div className="p-6 flex-1">
                {/* Mode Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                    <button 
                        onClick={() => setMode('UPLOAD')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'UPLOAD' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'}`}
                    >
                        Upload Scan (OCR)
                    </button>
                    <button 
                        onClick={() => setMode('MANUAL')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'MANUAL' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'}`}
                    >
                        Manual Entry
                    </button>
                </div>

                {mode === 'UPLOAD' ? (
                    <ImmunizationUpload 
                        isAnalyzing={isAnalyzing} 
                        onFileSelect={handleFileChange} 
                    />
                ) : (
                    <ImmunizationForm 
                        formData={formData} 
                        onChange={setFormData} 
                    />
                )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end space-x-2">
                <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-white rounded-lg">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 flex items-center">
                    <Save size={18} className="mr-2" /> Save Record
                </button>
            </div>
        </div>
    </div>
  );
};
