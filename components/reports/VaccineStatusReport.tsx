import React from 'react';
import { Student } from '../../types';
import { Shield, AlertCircle, CheckCircle, PieChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip, Legend } from 'recharts';

interface VaccineStatusReportProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const VaccineStatusReport: React.FC<VaccineStatusReportProps> = ({ students, onSelectStudent }) => {
  // Aggregate Data
  let compliantCount = 0;
  let nonCompliantCount = 0;
  let dueSoonCount = 0;

  const studentsWithStatus = students.map(s => {
    // Logic Refinement:
    // 1. Any OVERDUE => NON_COMPLIANT
    // 2. Any DUE_SOON (and no OVERDUE) => DUE_SOON
    // 3. Otherwise (All COMPLIANT or EXEMPT) => COMPLIANT
    
    const hasOverdue = s.immunizations?.some(i => i.status === 'OVERDUE');
    const hasDueSoon = s.immunizations?.some(i => i.status === 'DUE_SOON');
    
    let status = 'COMPLIANT';
    if (hasOverdue) {
        status = 'NON_COMPLIANT';
        nonCompliantCount++;
    } else if (hasDueSoon) {
        status = 'DUE_SOON';
        dueSoonCount++;
    } else {
        status = 'COMPLIANT';
        compliantCount++;
    }

    return { ...s, status };
  });

  const data = [
    { name: 'Compliant', value: compliantCount, color: '#10b981' },
    { name: 'Due Soon', value: dueSoonCount, color: '#f59e0b' },
    { name: 'Non-Compliant', value: nonCompliantCount, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="animate-fade-in space-y-6">
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <Shield className="mr-3 text-primary-600" size={28} />
                Student Vaccination Status Report
            </h2>
            <p className="text-slate-500">Real-time compliance tracking across all grade levels.</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
             <p className="text-sm font-medium text-slate-500">Overall Compliance</p>
             <p className="text-3xl font-bold text-emerald-600">{Math.round((compliantCount / students.length) * 100)}%</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
             <h3 className="font-bold text-slate-800 mb-4">Distribution</h3>
             <ResponsiveContainer width="100%" height="100%">
                <RePie>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </RePie>
             </ResponsiveContainer>
          </div>

          {/* Breakdown Stats */}
          <div className="space-y-4">
             <div className="bg-white p-6 rounded-xl border border-l-4 border-l-emerald-500 border-slate-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <CheckCircle className="text-emerald-500 mr-3" />
                        <div>
                            <p className="font-bold text-slate-800">Fully Compliant</p>
                            <p className="text-sm text-slate-500">Up to date or valid exemption</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-slate-800">{compliantCount}</span>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-l-4 border-l-amber-500 border-slate-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <AlertCircle className="text-amber-500 mr-3" />
                        <div>
                            <p className="font-bold text-slate-800">Due Soon</p>
                            <p className="text-sm text-slate-500">Action required within 30 days</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-slate-800">{dueSoonCount}</span>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-l-4 border-l-red-500 border-slate-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <AlertCircle className="text-red-500 mr-3" />
                        <div>
                            <p className="font-bold text-slate-800">Non-Compliant</p>
                            <p className="text-sm text-slate-500">Missing required immunizations</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-slate-800">{nonCompliantCount}</span>
                </div>
             </div>
          </div>
       </div>

       {/* Detailed Non-Compliant List */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-red-50/30">
             <h3 className="font-bold text-red-800">Action Required: Non-Compliant Students</h3>
          </div>
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                   <th className="px-6 py-4 font-semibold text-slate-600">Student</th>
                   <th className="px-6 py-4 font-semibold text-slate-600">Grade</th>
                   <th className="px-6 py-4 font-semibold text-slate-600">Missing / Overdue</th>
                   <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {studentsWithStatus.filter(s => s.status === 'NON_COMPLIANT' || s.status === 'DUE_SOON').map(s => (
                    <tr 
                      key={s.id} 
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => onSelectStudent(s)}
                    >
                        <td className="px-6 py-4 font-medium text-slate-800">{s.firstName} {s.lastName}</td>
                        <td className="px-6 py-4 text-slate-600">{s.grade}</td>
                        <td className="px-6 py-4 text-slate-600">
                            {s.immunizations?.filter(i => i.status !== 'COMPLIANT' && i.status !== 'EXEMPT').map(i => i.name).join(', ')}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'NON_COMPLIANT' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                {s.status.replace('_', ' ')}
                            </span>
                        </td>
                    </tr>
                ))}
                 {studentsWithStatus.filter(s => s.status === 'NON_COMPLIANT' || s.status === 'DUE_SOON').length === 0 && (
                    <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">All students are compliant!</td>
                    </tr>
                 )}
             </tbody>
          </table>
       </div>
    </div>
  );
};