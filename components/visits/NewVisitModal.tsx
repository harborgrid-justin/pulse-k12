
import React, { useState } from 'react';
import { Student, VisitLog, Urgency } from '../../types';
import { GeminiService } from '../../services/geminiService';
import { Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Select, TextArea } from '../ui/Input';
import { Button } from '../ui/Button';

interface NewVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visit: VisitLog) => void;
  students: Student[];
  initialStudentId?: string;
}

export const NewVisitModal: React.FC<NewVisitModalProps> = ({ isOpen, onClose, onSave, students, initialStudentId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || '');
  const [rawInput, setRawInput] = useState('');
  const [formData, setFormData] = useState({
    symptoms: '',
    treatment: '',
    outcome: 'Returned to class',
    urgency: Urgency.LOW as Urgency,
    notes: ''
  });

  if (!isOpen) return null;

  const handleMagicFill = async () => {
    if (!rawInput.trim()) return;
    setIsProcessing(true);
    const analysis = await GeminiService.processClinicalNote(rawInput);
    setFormData({
      symptoms: analysis.symptoms,
      treatment: analysis.treatment,
      outcome: analysis.outcome,
      urgency: analysis.urgency,
      notes: analysis.formattedNote
    });
    setIsProcessing(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedStudentId) return;
    setIsSaving(true);

    await new Promise(resolve => setTimeout(resolve, 600));

    const newVisit: VisitLog = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: selectedStudentId,
      timestamp: new Date().toISOString(),
      ...formData,
      processedByAI: !!rawInput
    };

    onSave(newVisit);
    setIsSaving(false);
    onClose();
    
    setRawInput('');
    setFormData({ symptoms: '', treatment: '', outcome: 'Returned to class', urgency: Urgency.LOW, notes: '' });
    setSelectedStudentId('');
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="New Clinical Visit"
        footer={
            <>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={() => handleSubmit()} isLoading={isSaving}>Save Log</Button>
            </>
        }
    >
        <div className="space-y-6">
          {/* AI Quick Fill Section */}
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center space-x-2 text-indigo-700 mb-2">
              <Sparkles size={18} />
              <span className="font-semibold text-sm">AI Magic Fill</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                  <Input
                    placeholder="e.g., Liam scraped his knee at recess, cleaned with saline, gave bandaid."
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMagicFill()}
                    className="border-indigo-200 focus:ring-indigo-500"
                  />
              </div>
              <Button 
                onClick={handleMagicFill} 
                isLoading={isProcessing} 
                disabled={!rawInput}
                className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              >
                Fill
              </Button>
            </div>
            <p className="text-xs text-indigo-400 mt-2">
              Describe what happened in plain English and let AI fill the details below.
            </p>
          </div>

          <form id="visit-form" className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Select
                label="Student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                options={[
                    { value: '', label: 'Select Student...' },
                    ...students.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName} (Gr ${s.grade})` }))
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                required
              />
              <Select 
                label="Urgency"
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value as Urgency})}
                options={Object.values(Urgency).map(u => ({ value: u, label: u }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Treatment"
                value={formData.treatment}
                onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                required
              />
              <Select 
                label="Outcome"
                value={formData.outcome}
                onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                options={[
                    { value: 'Returned to class', label: 'Returned to class' },
                    { value: 'Sent home', label: 'Sent home' },
                    { value: 'EMS / 911', label: 'EMS / 911' },
                    { value: 'Parent Pickup', label: 'Parent Pickup' },
                    { value: 'Referral to Physician', label: 'Referral to Physician' },
                    { value: 'Other', label: 'Other' }
                ]}
              />
            </div>

            <TextArea 
                label="Clinical Notes (SOAP)"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </form>
        </div>
    </Modal>
  );
};
