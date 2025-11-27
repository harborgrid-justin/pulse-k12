
import React from 'react';
import { Incident } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, Printer, Filter, FileText } from 'lucide-react';

interface IncidentReportsProps {
  incidents: Incident[];
}

export const IncidentReports: React.FC<IncidentReportsProps> = ({ incidents }) => {
  
  const typeData = [
    { name: 'Injury', value: incidents.filter(i => i.type === 'INJURY').length, color: '#ef4444' },
    { name: 'Illness', value: incidents.filter(i => i.type === 'ILLNESS').length, color: '#3b82f6' },
    { name: 'Behavioral', value: incidents.filter(i => i.type === 'BEHAVIORAL').length, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const locationData = incidents.reduce((acc, curr) => {
    const loc = curr.location;
    const existing = acc.find(a => a.name === loc);
    if (existing) existing.value++;
    else acc.push({ name: loc, value: 1 });
    return acc;
  }, [] as {name: string, value: number}[]);

  const severityData = [
    { name: 'Minor', value: incidents.filter(i => i.severity === 'MINOR').length },
    { name: 'Moderate', value: incidents.filter(i => i.severity === 'MODERATE').length },
    { name: 'Severe', value: incidents.filter(i => i.severity === 'SEVERE').length },
    { name: 'Critical', value: incidents.filter(i => i.severity === 'CRITICAL').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
                <h3 className="font-bold text-slate-800">Risk Management Analytics</h3>
                <p className="text-xs text-slate-500">District Reporting & Insurance Exports</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm flex items-center justify-center">
                    <Printer size={16} className="mr-2" /> Print
                </button>
                <button className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm flex items-center justify-center shadow-sm">
                    <Download size={16} className="mr-2" /> District CSV
                </button>
                <button className="flex-1 sm:flex-none px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm flex items-center justify-center shadow-sm">
                    <FileText size={16} className="mr-2" /> Insurance PDF
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Count Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Incidents</p>
                <p className="text-4xl font-extrabold text-slate-800 mt-2">{incidents.length}</p>
                <p className="text-xs text-slate-400 mt-1">Year to Date</p>
            </div>

            {/* Incident Types Pie */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Incident Types</h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={typeData} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={40} 
                                outerRadius={70} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Severity Bars */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Severity Breakdown</h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={severityData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 12}} interval={0} />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="value" fill="#64748b" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Location Heatmap (Simulated with Bar) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Location Hotspots (Trend Analysis)</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};
