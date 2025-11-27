
import React, { useState, useEffect } from 'react';
import { ImmunizationRecord } from '../../../types';
import { AthenaService } from '../../../services/athenaService';
import { ArrowLeft, Search, Loader2, Save, Shield } from 'lucide-react';

interface AddImmunizationPageProps {
  onCancel: () => void;
  onSave: (record: ImmunizationRecord) => void;
  studentId: string;
}

export const AddImmunizationPage: React.FC<AddImmunizationPageProps> = ({ onCancel, onSave, studentId }) => {
  const [newVax, setNewVax] = useState<Partial<ImmunizationRecord> & { cvxCode?: string }>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    doseNumber: 1,
    totalDoses: 2,
    status: 'COMPLIANT',
    manufacturer: '',
    lotNumber: '',
    site: '',
    cvxCode: ''
  });

  const [vaxSearchTerm, setVaxSearchTerm] = useState('');
  const [vaxSearchResults, setVaxSearchResults] = useState<any[]>([]);
  const [isSearchingVax, setIsSearchingVax] = useState(false);
  const [showVaxDropdown, setShowVaxDropdown] = useState(false);
  const [isSavingVax, setIsSavingVax] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (vaxSearchTerm.length > 1 && showVaxDropdown) {
            setIsSearchingVax(true);
            try {
                const results = await AthenaService.searchVaccines(vaxSearchTerm);
                setVaxSearchResults(results);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearchingVax(false);
            }
        } else if (vaxSearchTerm.length === 0) {
            setVaxSearchResults([]);
        }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [vaxSearchTerm, showVaxDropdown]);

  const handleVaxSelect = (vax: any) => {
      setNewVax(prev => ({ ...prev, name: vax.display, cvxCode: vax.code }));
      setVaxSearchTerm(vax.display);
      setShowVaxDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVax.name) return;
    setIsSavingVax(true);

    try {
        await AthenaService.createImmunization(studentId, newVax);

        const record: ImmunizationRecord = {
          id: `new_${Date.now()}`,
          name: newVax.name!,
          date: newVax.date!,
          doseNumber: newVax.doseNumber || 1,
          totalDoses: newVax.totalDoses || 1,
          compliant: newVax.status === 'COMPLIANT',
          status: newVax.status as any,
          manufacturer: newVax.manufacturer,
          lotNumber: newVax.lotNumber,
          site: newVax.site,
          verified: true
        };

        onSave(record);
    } catch (error) {
        alert("Failed to save immunization record.");
        setIsSavingVax(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center space-x-4">
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <Shield className="mr-2 text-primary-600" />
                    Add Immunization Record
                </h2>
            </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <form id="vax-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Vaccine Name (Search)</label>
                        <div className="relative">
                            <input 
                                required
                                type="text"
                                className="w-full border-slate-200 rounded-lg pl-4 pr-10 py-3 focus:ring-2 focus:ring-primary-500 shadow-sm"
                                placeholder="Type to search (e.g. MMR, Tdap)"
                                value={vaxSearchTerm}
                                onChange={(e) => {
                                    setVaxSearchTerm(e.target.value);
                                    setShowVaxDropdown(true);
                                }}
                                onFocus={() => setShowVaxDropdown(true)}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {isSearchingVax ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                            </div>
                        </div>
                        
                        {showVaxDropdown && vaxSearchResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                {vaxSearchResults.map(vax => (
                                    <button
                                        type="button"
                                        key={vax.code}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 border-b border-slate-50 last:border-0"
                                        onClick={() => handleVaxSelect(vax)}
                                    >
                                        <span className="font-bold block">{vax.display}</span>
                                        <span className="text-xs text-slate-400 font-mono">CVX: {vax.code}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Date Administered</label>
                            <input 
                                required
                                type="date"
                                className="w-full border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
                                value={newVax.date}
                                onChange={(e) => setNewVax({...newVax, date: e.target.value})}
                            />
                        </div>
                            <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Compliance Status</label>
                            <select
                                className="w-full border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 bg-white"
                                value={newVax.status}
                                onChange={(e) => setNewVax({...newVax, status: e.target.value as any})}
                            >
                                <option value="COMPLIANT">Compliant</option>
                                <option value="DUE_SOON">Due Soon</option>
                                <option value="OVERDUE">Overdue</option>
                                <option value="EXEMPT">Exempt</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Dose Number</label>
                            <input 
                                type="number"
                                min="1"
                                className="w-full border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
                                value={newVax.doseNumber}
                                onChange={(e) => setNewVax({...newVax, doseNumber: parseInt(e.target.value)})}
                            />
                        </div>
                            <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Total Series Doses</label>
                            <input 
                                type="number"
                                min="1"
                                className="w-full border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
                                value={newVax.totalDoses}
                                onChange={(e) => setNewVax({...newVax, totalDoses: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Additional Details</p>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Manufacturer</label>
                                <input 
                                    type="text"
                                    className="w-full border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
                                    placeholder="e.g. Merck, Pfizer"
                                    value={newVax.manufacturer}
                                    onChange={(e) => setNewVax({...newVax, manufacturer: e.target.value})}
                                />
                            </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Lot Number</label>
                                    <input 
                                        type="text"
                                        className="w-full border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
                                        value={newVax.lotNumber}
                                        onChange={(e) => setNewVax({...newVax, lotNumber: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Site</label>
                                    <input 
                                        type="text"
                                        className="w-full border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. Left Deltoid"
                                        value={newVax.site}
                                        onChange={(e) => setNewVax({...newVax, site: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-4 bg-slate-50">
            <button onClick={onCancel} className="px-6 py-3 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium transition-colors border border-transparent hover:border-slate-200">Cancel</button>
            <button 
                type="submit"
                form="vax-form"
                disabled={isSavingVax}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-bold flex items-center hover:bg-primary-700 shadow-md transition-colors disabled:opacity-50"
            >
                {isSavingVax ? <Loader2 size={20} className="mr-2 animate-spin" /> : <Save size={20} className="mr-2" />}
                {isSavingVax ? 'Saving to FHIR...' : 'Save Record'}
            </button>
        </div>
    </div>
  );
};
