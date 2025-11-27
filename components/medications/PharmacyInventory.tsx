
import React, { useState } from 'react';
import { Medication } from '../../types';
import { Pill, AlertTriangle, CheckCircle, Search, Package, Filter, ArrowUpDown, Plus } from 'lucide-react';
import { AddMedicationModal } from './AddMedicationModal';

interface PharmacyInventoryProps {
  medications: Medication[];
  onAddMedication?: (med: Medication) => void;
}

export const PharmacyInventory: React.FC<PharmacyInventoryProps> = ({ medications, onAddMedication }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getStockStatus = (med: Medication) => {
    if (med.stock === 0) return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Out of Stock', icon: AlertTriangle };
    if (med.stock < 10) return { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Low Stock', icon: AlertTriangle };
    return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'In Stock', icon: CheckCircle };
  };

  const isExpiringSoon = (dateStr: string) => {
    const expiry = new Date(dateStr);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry < threeMonthsFromNow;
  };

  const filteredMeds = medications.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (med: Medication) => {
      if (onAddMedication) {
          onAddMedication(med);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        {/* Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search medications by name..." 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                <button className="flex items-center justify-center px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                    <Filter size={16} className="mr-1.5" /> Filter
                </button>
                <button className="flex items-center justify-center px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                    <ArrowUpDown size={16} className="mr-1.5" /> Sort
                </button>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center px-3 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm whitespace-nowrap"
                >
                    <Plus size={16} className="mr-1.5" /> Add
                </button>
            </div>
        </div>

        {/* Inventory Grid/List */}
        <div className="grid grid-cols-1 gap-4">
            {filteredMeds.map(med => {
                const status = getStockStatus(med);
                const expiring = isExpiringSoon(med.expiryDate);

                return (
                    <div key={med.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 transition-all group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Name & Icon */}
                            <div className="flex items-start gap-4 border-b sm:border-b-0 border-slate-100 pb-4 sm:pb-0">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shrink-0">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{med.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">ID: <span className="font-mono">{med.id}</span></p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-8 w-full sm:w-auto">
                                <div className="flex flex-col justify-center sm:block p-2 sm:p-0 rounded-lg">
                                    <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Current Stock</span>
                                    <span className="text-lg font-bold text-slate-800">
                                        {med.stock} <span className="text-sm font-normal text-slate-500">{med.unit}</span>
                                    </span>
                                </div>

                                <div className="flex flex-col justify-center sm:block p-2 sm:p-0 rounded-lg">
                                    <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Expiration</span>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-slate-800">{new Date(med.expiryDate).toLocaleDateString()}</span>
                                        {expiring && (
                                            <AlertTriangle size={14} className="text-amber-500 ml-2" />
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:block">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border w-full sm:w-auto justify-center ${status.color}`}>
                                        <status.icon size={14} className="mr-1.5" />
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Action */}
                            <div className="hidden sm:flex justify-end">
                                <button className="text-slate-400 hover:text-primary-600 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                                    <ArrowUpDown size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {filteredMeds.length === 0 && (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Pill size={28} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No medications found</h3>
                    <p className="text-slate-500 mb-4">Try adjusting your search criteria.</p>
                    <button onClick={() => setIsAddModalOpen(true)} className="text-primary-600 hover:underline font-bold">Add New Medication</button>
                </div>
            )}
        </div>

        <AddMedicationModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onSave={handleAdd} 
        />
    </div>
  );
};
