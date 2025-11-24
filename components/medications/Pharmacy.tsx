import React from 'react';
import { Medication } from '../../types';
import { Pill, AlertTriangle, CheckCircle, Search } from 'lucide-react';

interface PharmacyProps {
  medications: Medication[];
}

export const Pharmacy: React.FC<PharmacyProps> = ({ medications }) => {
  const getStockStatus = (med: Medication) => {
    if (med.stock === 0) return { color: 'bg-red-100 text-red-700', label: 'Out of Stock', icon: AlertTriangle };
    if (med.stock < 10) return { color: 'bg-amber-100 text-amber-700', label: 'Low Stock', icon: AlertTriangle };
    return { color: 'bg-emerald-100 text-emerald-700', label: 'In Stock', icon: CheckCircle };
  };

  const isExpiringSoon = (dateStr: string) => {
    const expiry = new Date(dateStr);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry < threeMonthsFromNow;
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Pharmacy Inventory</h2>
           <p className="text-slate-500">Manage medications and track expiry dates.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search medications..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map(med => {
          const status = getStockStatus(med);
          const expiring = isExpiringSoon(med.expiryDate);

          return (
            <div key={med.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-primary-300 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-primary-600">
                    <Pill size={24} />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center ${status.color}`}>
                    <status.icon size={12} className="mr-1" />
                    {status.label}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">{med.name}</h3>
                <p className="text-sm text-slate-500 mb-4">Unit: {med.unit}</p>
                
                <div className="flex items-end space-x-2 mb-4">
                  <span className="text-3xl font-bold text-slate-800">{med.stock}</span>
                  <span className="text-sm text-slate-400 mb-1">remaining</span>
                </div>
              </div>

              <div className={`pt-4 border-t border-slate-50 text-xs font-medium flex justify-between items-center ${expiring ? 'text-red-600' : 'text-slate-500'}`}>
                <span>Expires: {med.expiryDate}</span>
                {expiring && <span className="bg-red-50 px-2 py-1 rounded">Expiring Soon</span>}
              </div>
            </div>
          );
        })}

        {/* Add New Card Placeholder */}
        <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-300 hover:bg-slate-50 transition-all group">
            <div className="p-3 bg-slate-50 rounded-full mb-3 group-hover:bg-white">
                <PlusIcon className="w-6 h-6" />
            </div>
            <span className="font-medium">Add Medication</span>
        </button>
      </div>
    </div>
  );
};

const PlusIcon = ({className}:{className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);