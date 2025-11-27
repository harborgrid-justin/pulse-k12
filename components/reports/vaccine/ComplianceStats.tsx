
import React from 'react';
import { Shield, Download, FileText } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface ComplianceStatsProps {
  stats: {
    compliant: number;
    nonCompliant: number;
    provisional: number;
  };
  totalStudents: number;
  chartData: { name: string; value: number; color: string; }[];
  filterGrade: string;
  setFilterGrade: (val: string) => void;
  showNonCompliantOnly: boolean;
  setShowNonCompliantOnly: (val: boolean) => void;
  onExport: () => void;
}

export const ComplianceStats: React.FC<ComplianceStatsProps> = ({
  stats,
  totalStudents,
  chartData,
  filterGrade,
  setFilterGrade,
  showNonCompliantOnly,
  setShowNonCompliantOnly,
  onExport
}) => {
  return (
    <div className="space-y-6">
       {/* Dashboard Header */}
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <Shield className="mr-3 text-primary-600" size={28} />
                Immunization Compliance Dashboard
            </h2>
            <p className="text-slate-500">State-mandated tracking and audit readiness.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={onExport}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-slate-700 transition-colors shadow-sm"
             >
                 <Download size={18} className="mr-2" /> Export State Audit (CSV)
             </button>
          </div>
       </div>

       {/* KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm border-l-4 border-l-emerald-500">
               <p className="text-sm font-bold text-emerald-700 uppercase">Fully Compliant</p>
               <p className="text-3xl font-bold text-slate-800 mt-1">{stats.compliant}</p>
               <p className="text-xs text-slate-400 mt-1">{Math.round(stats.compliant / totalStudents * 100)}% of population</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm border-l-4 border-l-red-500">
               <p className="text-sm font-bold text-red-700 uppercase">Action Required</p>
               <p className="text-3xl font-bold text-slate-800 mt-1">{stats.nonCompliant}</p>
               <p className="text-xs text-slate-400 mt-1">Missing doses or expired exemptions</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm border-l-4 border-l-amber-500">
               <p className="text-sm font-bold text-amber-700 uppercase">Provisional / Grace</p>
               <p className="text-3xl font-bold text-slate-800 mt-1">{stats.provisional}</p>
               <p className="text-xs text-slate-400 mt-1">Follow-up needed within 30 days</p>
           </div>
       </div>

       {/* Filters & Chart */}
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
           <h3 className="font-bold text-slate-800 mb-4">Compliance Overview</h3>
           <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
           </div>
           <div className="mt-6 space-y-3">
               <div className="flex items-center justify-between">
                   <label className="text-sm font-medium text-slate-700">Filter by Grade</label>
                   <select 
                       className="border border-slate-200 rounded-lg text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                       value={filterGrade}
                       onChange={(e) => setFilterGrade(e.target.value)}
                   >
                       <option value="ALL">All Grades</option>
                       <option value="K">Kindergarten</option>
                       <option value="1">1st Grade</option>
                       <option value="7">7th Grade</option>
                   </select>
               </div>
               <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer" onClick={() => setShowNonCompliantOnly(!showNonCompliantOnly)}>
                   <input 
                       type="checkbox" 
                       id="nc-only" 
                       className="rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                       checked={showNonCompliantOnly}
                       onChange={(e) => setShowNonCompliantOnly(e.target.checked)}
                       onClick={(e) => e.stopPropagation()}
                   />
                   <label htmlFor="nc-only" className="ml-2 text-sm text-slate-600 cursor-pointer select-none">Show Non-Compliant Only</label>
               </div>
           </div>
       </div>
    </div>
  );
};
