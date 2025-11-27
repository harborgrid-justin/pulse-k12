
import React from 'react';
import { School } from '../../../types';
import { Battery, Wrench, Building } from 'lucide-react';

interface SchoolAssetsProps {
  school: School;
}

export const SchoolAssets: React.FC<SchoolAssetsProps> = ({ school }) => {
  return (
    <div className="animate-fade-in bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Resource Inventory</h3>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                Add Resource
            </button>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600">Resource Name</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Type</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Location</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Next Maint.</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-right">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {school.resources.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                        {res.type === 'EMERGENCY' ? <Battery size={16} className="text-red-500 mr-2" /> :
                        res.type === 'DEVICE' ? <Wrench size={16} className="text-blue-500 mr-2" /> :
                        <Building size={16} className="text-slate-400 mr-2" />}
                        {res.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{res.type}</td>
                    <td className="px-6 py-4 text-slate-600">{res.location}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{res.nextMaintenance}</td>
                    <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            res.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' :
                            res.status === 'IN_USE' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                        }`}>
                            {res.status.replace('_', ' ')}
                        </span>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};
