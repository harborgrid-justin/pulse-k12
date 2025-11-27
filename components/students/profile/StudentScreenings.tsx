
import React from 'react';
import { Screening } from '../../../types';

interface StudentScreeningsProps {
  screenings: Screening[];
}

export const StudentScreenings: React.FC<StudentScreeningsProps> = ({ screenings }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-800">Health Screenings History</h3>
                    <p className="text-sm text-slate-500">Vision, Hearing, Scoliosis, and BMI tracking.</p>
                </div>
                <button className="border border-slate-300 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-700">
                    + Log Screening
                </button>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
                        <th className="px-6 py-4 font-semibold text-slate-600">Type</th>
                        <th className="px-6 py-4 font-semibold text-slate-600">Result</th>
                        <th className="px-6 py-4 font-semibold text-slate-600">Notes / Values</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {screenings && screenings.length > 0 ? (
                        screenings.map(sc => (
                            <tr key={sc.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-slate-600">{sc.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">{sc.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        sc.result === 'PASS' ? 'bg-emerald-100 text-emerald-700' :
                                        sc.result === 'FAIL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {sc.result}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {sc.value && <span className="font-mono bg-slate-100 px-1 rounded mr-2">{sc.value}</span>}
                                    {sc.notes}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-400 italic">No screenings recorded.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};
