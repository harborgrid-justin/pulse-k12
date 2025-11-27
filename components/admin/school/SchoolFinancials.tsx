
import React from 'react';
import { School } from '../../../types';

interface SchoolFinancialsProps {
  school: School;
}

export const SchoolFinancials: React.FC<SchoolFinancialsProps> = ({ school }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Annual Budget</h3>
        <p className="text-3xl font-bold text-slate-800">
            {school.budget.currency === 'USD' ? '$' : ''}{school.budget.allocated.toLocaleString()}
        </p>
        <p className="text-xs text-slate-400 mt-1 font-medium">Fiscal Year {school.budget.fiscalYear}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Remaining Funds</h3>
        <p className="text-3xl font-bold text-emerald-600">
            {school.budget.currency === 'USD' ? '$' : ''}{(school.budget.allocated - school.budget.spent).toLocaleString()}
        </p>
        <p className="text-xs text-slate-400 mt-1 font-medium">{(100 - (school.budget.spent / school.budget.allocated * 100)).toFixed(1)}% Available</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Spend Velocity</h3>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(school.budget.spent / school.budget.allocated * 100)}%` }}></div>
        </div>
        <div className="flex justify-between text-xs font-medium">
            <span className="text-blue-700">${school.budget.spent.toLocaleString()} Spent</span>
            <span className="text-slate-400">Target: 50%</span>
        </div>
        </div>

        <div className="md:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Expense Breakdown</h3>
            <button className="text-sm text-primary-600 font-medium hover:underline">Download Report</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
            { cat: 'Medical Supplies', val: '$3,200', pct: '38%' },
            { cat: 'Equipment Maintenance', val: '$1,800', pct: '21%' },
            { cat: 'Software Licenses', val: '$2,400', pct: '28%' },
            { cat: 'Training & Certs', val: '$1,050', pct: '13%' },
            ].map((item, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">{item.cat}</p>
                <p className="text-lg font-bold text-slate-800">{item.val}</p>
                <p className="text-xs text-slate-400 font-medium">{item.pct} of spend</p>
            </div>
            ))}
        </div>
        </div>
    </div>
  );
};
