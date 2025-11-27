
import React, { useState, useEffect } from 'react';
import { Medication } from '../../types';
import { PublicHealthService, DrugConcept } from '../../services/publicHealthService';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { Search, Loader2, Pill, AlertCircle } from 'lucide-react';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: Medication) => void;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DrugConcept[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugConcept | null>(null);
  
  const [formData, setFormData] = useState({
    stock: '0',
    unit: 'Tablets',
    expiryDate: '',
  });

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.length >= 3 && !selectedDrug) {
            setIsSearching(true);
            const results = await PublicHealthService.searchMedications(searchTerm);
            setSearchResults(results);
            setIsSearching(false);
        } else if (searchTerm.length < 3) {
            setSearchResults([]);
        }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedDrug]);

  const handleSelectDrug = (drug: DrugConcept) => {
      setSelectedDrug(drug);
      setSearchTerm(drug.name);
      setSearchResults([]);
  };

  const handleClearSelection = () => {
      setSelectedDrug(null);
      setSearchTerm('');
      setSearchResults([]);
  };

  const handleSubmit = () => {
      if (!searchTerm || !formData.stock || !formData.expiryDate) return;

      const newMedication: Medication = {
          id: `med_${Date.now()}`,
          name: searchTerm, // Use search term in case they typed a custom name
          stock: parseInt(formData.stock),
          unit: formData.unit,
          expiryDate: formData.expiryDate
      };

      onSave(newMedication);
      onClose();
      // Reset
      setSearchTerm('');
      setSelectedDrug(null);
      setFormData({ stock: '0', unit: 'Tablets', expiryDate: '' });
  };

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add New Medication"
        maxWidth="max-w-lg"
        footer={
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!searchTerm || !formData.expiryDate}>Add to Inventory</Button>
            </div>
        }
    >
        <div className="space-y-6">
            {/* Search Section */}
            <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Medication Name (RxNav)</label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </div>
                    <input 
                        type="text"
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${selectedDrug ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium' : 'border-slate-200'}`}
                        placeholder="Search FDA drug database..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if(selectedDrug) setSelectedDrug(null); // Reset selection on edit
                        }}
                        disabled={!!selectedDrug}
                    />
                    {selectedDrug && (
                        <button 
                            onClick={handleClearSelection}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <AlertCircle size={18} className="text-emerald-500" />
                        </button>
                    )}
                </div>

                {/* Results Dropdown */}
                {!selectedDrug && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((drug) => (
                            <button
                                key={drug.rxcui}
                                onClick={() => handleSelectDrug(drug)}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-center group"
                            >
                                <Pill size={14} className="mr-2 text-slate-400 group-hover:text-primary-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{drug.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">RxNorm: {drug.rxcui}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                {!selectedDrug && searchTerm.length >= 3 && !isSearching && searchResults.length === 0 && (
                    <p className="text-xs text-slate-400 mt-1.5">No matches found in database. You can continue with custom entry.</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Initial Stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                />
                <Select 
                    label="Unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    options={[
                        { value: 'Tablets', label: 'Tablets' },
                        { value: 'Capsules', label: 'Capsules' },
                        { value: 'Bottles', label: 'Bottles' },
                        { value: 'Inhalers', label: 'Inhalers' },
                        { value: 'Injectors', label: 'Injectors (Epi)' },
                        { value: 'Tubes', label: 'Tubes' },
                        { value: 'Packs', label: 'Packs' },
                        { value: 'ml', label: 'Milliliters (ml)' }
                    ]}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Expiration Date</label>
                <input 
                    type="date"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
            </div>
        </div>
    </Modal>
  );
};
