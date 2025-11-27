
import React, { useState, useEffect } from 'react';
import { ImmunizationRecord } from '../../../../types';
import { CheckCircle } from 'lucide-react';

interface ImmunizationFormProps {
  formData: Partial<ImmunizationRecord>;
  onChange: (data: Partial<ImmunizationRecord>) => void;
}

export const ImmunizationForm: React.FC<ImmunizationFormProps> = ({ formData, onChange }) => {
  const [vaxSearchTerm, setVaxSearchTerm] = useState(formData.name || '');

  // Sync local search term if parent updates name (e.g. after OCR)
  useEffect(() => {
      if (formData.name && formData.name !== vaxSearchTerm) {
          setVaxSearchTerm(formData.name);
      }
  }, [formData.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVaxSearchTerm(e.target.value);
      onChange({ ...formData, name: e.target.value });
  };

  return (
    <div className="space-y-4 animate-fade-in">
        {formData.documentUrl && (
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center text-sm text-emerald-700 mb-4">
                <CheckCircle size={16} className="mr-2" />
                Data extracted from upload. Please verify.
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vaccine</label>
            <input 
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={vaxSearchTerm}
                onChange={handleNameChange}
                placeholder="e.g. MMR"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                    type="date"
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.date}
                    onChange={(e) => onChange({ ...formData, date: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.status}
                    onChange={(e) => onChange({ ...formData, status: e.target.value as any })}
                >
                    <option value="COMPLIANT">Compliant</option>
                    <option value="EXEMPT">Exempt</option>
                    <option value="PROVISIONAL">Provisional</option>
                </select>
            </div>
        </div>

        {formData.status === 'EXEMPT' && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Exemption Type</label>
                <select 
                    className="w-full border border-amber-200 bg-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.exemptionType || 'MEDICAL'}
                    onChange={(e) => onChange({ ...formData, exemptionType: e.target.value as any })}
                >
                    <option value="MEDICAL">Medical (Perm)</option>
                    <option value="RELIGIOUS">Religious</option>
                    <option value="PERSONAL">Personal Belief</option>
                </select>
            </div>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                <input 
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Optional"
                    value={formData.manufacturer || ''}
                    onChange={(e) => onChange({ ...formData, manufacturer: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lot Number</label>
                <input 
                    className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Optional"
                    value={formData.lotNumber || ''}
                    onChange={(e) => onChange({ ...formData, lotNumber: e.target.value })}
                />
            </div>
        </div>
    </div>
  );
};
