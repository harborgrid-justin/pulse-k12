
import React, { useState, useEffect } from 'react';
import { VisitLog, Urgency } from '../../types';
import { Modal } from '../ui/Modal';
import { Input, Select, TextArea } from '../ui/Input';
import { Button } from '../ui/Button';

interface EditVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visit: VisitLog) => void;
  visit: VisitLog;
}

export const EditVisitModal: React.FC<EditVisitModalProps> = ({ isOpen, onClose, onSave, visit }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<VisitLog>>({});

  useEffect(() => {
    if (visit) {
      setFormData({
        symptoms: visit.symptoms,
        treatment: visit.treatment,
        outcome: visit.outcome,
        urgency: visit.urgency,
        notes: visit.notes
      });
    }
  }, [visit, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onSave({ ...visit, ...formData } as VisitLog);
    setIsSaving(false);
    onClose();
  };

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Edit Visit Log #${visit.id}`}
        footer={
            <>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={() => handleSubmit()} isLoading={isSaving}>Save Changes</Button>
            </>
        }
    >
        <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Symptoms"
                    value={formData.symptoms || ''} 
                    onChange={e => setFormData({...formData, symptoms: e.target.value})} 
                />
                <Select 
                    label="Urgency"
                    value={formData.urgency || Urgency.LOW} 
                    onChange={e => setFormData({...formData, urgency: e.target.value as Urgency})}
                    options={Object.values(Urgency).map(u => ({ value: u, label: u }))}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Treatment"
                    value={formData.treatment || ''} 
                    onChange={e => setFormData({...formData, treatment: e.target.value})} 
                />
                <Select 
                    label="Outcome"
                    value={formData.outcome || 'Returned to class'}
                    onChange={e => setFormData({...formData, outcome: e.target.value})}
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
                label="Clinical Notes"
                rows={8}
                className="font-mono"
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
        </form>
    </Modal>
  );
};
