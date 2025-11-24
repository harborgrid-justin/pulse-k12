
import React, { useState } from 'react';
import { School, Urgency } from '../../types';
import { 
  Building, MapPin, Phone, Users, Activity, Wallet, Monitor, 
  ShieldCheck, AlertTriangle, CheckCircle, Clock, Server, Wrench,
  Battery, Thermometer
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';

interface SchoolProfileProps {
  school: School;
}

export const SchoolProfile: React.FC<SchoolProfileProps> = ({ school }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'assets' | 'system'>('overview');

  // Mock data for analytics
  const peakHoursData = [
    { name: '8am', visits: 4 },
    { name: '9am', visits: 12 },
    { name: '10am', visits: 18 },
    { name: '11am', visits: 25 },
    { name: '12pm', visits: 22 },
    { name: '1pm', visits: 15 },
    { name: '2pm', visits: 10 },
    { name: '3pm', visits: 5 },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Enterprise Header */}
      <div className="relative h-48 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-grid-slate-700/[0.1] bg-[length:20px_20px]"></div>
        <div className="absolute bottom-6 left-6 text-white z-10">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="opacity-80" />
            <span className="text-sm font-medium opacity-90 tracking-wider uppercase">Facility Admin</span>
          </div>
          <h1 className="text-3xl font-bold">{school.name}</h1>
          <div className="flex items-center space-x-4 mt-2 text-slate-300 text-sm">
             <span className="flex items-center"><MapPin size={14} className="mr-1" /> {school.address}</span>
             <span className="flex items-center"><Phone size={14} className="mr-1" /> {school.phone}</span>
          </div>
        </div>
        <div className="absolute right-6 bottom-6 flex space-x-3">
            <div className="bg-slate-700/50 backdrop-blur px-4 py-2 rounded-lg text-white text-center">
                <p className="text-xs text-slate-400 uppercase font-bold">Students</p>
                <p className="text-xl font-bold">{school.totalStudents}</p>
            </div>
             <div className="bg-emerald-900/50 backdrop-blur px-4 py-2 rounded-lg text-emerald-100 text-center border border-emerald-500/30">
                <p className="text-xs text-emerald-300 uppercase font-bold">Compliance</p>
                <p className="text-xl font-bold">{school.complianceRate}%</p>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-8">
        {[
          { id: 'overview', label: 'Overview & Ops', icon: Activity },
          { id: 'financials', label: 'Financials', icon: Wallet },
          { id: 'assets', label: 'Assets & Resources', icon: Thermometer },
          { id: 'system', label: 'System Health', icon: Monitor },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 flex items-center font-medium transition-colors border-b-2 px-2 ${
              activeTab === tab.id 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon size={18} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
           {/* Peak Hours Chart */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center">
                <Clock size={20} className="mr-2 text-primary-600" />
                Clinic Peak Utilization
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                    <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Staff & Credentials */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center">
                <ShieldCheck size={20} className="mr-2 text-primary-600" />
                Staff Credentialing
              </h3>
              <div className="space-y-4">
                 {school.staffCredentials.map(cred => (
                    <div key={cred.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                       <div className="flex items-center space-x-3">
                          <div className="bg-white p-2 rounded-full border border-slate-200">
                             <Users size={16} className="text-slate-500" />
                          </div>
                          <div>
                             <p className="font-bold text-slate-800 text-sm">{cred.name}</p>
                             <p className="text-xs text-slate-500">{cred.role} • {cred.licenseNumber}</p>
                          </div>
                       </div>
                       <div className={`px-2 py-1 rounded text-xs font-bold border ${
                         cred.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                         cred.status === 'EXPIRING_SOON' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                         'bg-red-50 text-red-700 border-red-200'
                       }`}>
                         {cred.status.replace('_', ' ')}
                       </div>
                    </div>
                 ))}
                 <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div className="text-center">
                       <p className="text-xs text-slate-500 uppercase font-bold">Nurse:Student Ratio</p>
                       <p className="text-xl font-bold text-slate-800">1 : {school.totalStudents}</p>
                       <p className="text-xs text-emerald-600">Within Standard</p>
                    </div>
                    <div className="text-center">
                       <p className="text-xs text-slate-500 uppercase font-bold">Clinic Capacity</p>
                       <p className="text-xl font-bold text-slate-800">85%</p>
                       <p className="text-xs text-amber-600">High Load</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Financials Tab */}
      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Annual Budget</h3>
              <p className="text-3xl font-bold text-slate-800">
                 {school.budget.currency === 'USD' ? '$' : ''}{school.budget.allocated.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">Fiscal Year {school.budget.fiscalYear}</p>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Remaining Funds</h3>
              <p className="text-3xl font-bold text-emerald-600">
                 {school.budget.currency === 'USD' ? '$' : ''}{(school.budget.allocated - school.budget.spent).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">{(100 - (school.budget.spent / school.budget.allocated * 100)).toFixed(1)}% Available</p>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Spend Velocity</h3>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-2">
                 <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${(school.budget.spent / school.budget.allocated * 100)}%` }}></div>
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
                       <p className="text-xs text-slate-400">{item.pct} of spend</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
         <div className="animate-fade-in bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Resource Inventory</h3>
               <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
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
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
             {school.integrations.map((sys, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                         sys.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-600' :
                         sys.status === 'DEGRADED' ? 'bg-amber-100 text-amber-600' :
                         'bg-red-100 text-red-600'
                      }`}>
                         <Server size={24} />
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-800">{sys.name}</h3>
                         <p className="text-xs text-slate-500">Last Sync: {sys.lastSync}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-1 ${
                         sys.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                         sys.status === 'DEGRADED' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                         'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                         <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            sys.status === 'ONLINE' ? 'bg-emerald-500' :
                            sys.status === 'DEGRADED' ? 'bg-amber-500' : 'bg-red-500'
                         }`}></div>
                         {sys.status}
                      </div>
                      <p className="text-xs font-mono text-slate-400">{sys.latencyMs}ms latency</p>
                   </div>
                </div>
             ))}
             
             <div className="md:col-span-2 bg-slate-800 text-slate-300 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                   <h3 className="text-white font-bold mb-1">System Audit Log</h3>
                   <p className="text-sm">View full history of data synchronization and access.</p>
                </div>
                <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                   View Logs
                </button>
             </div>
         </div>
      )}
    </div>
  );
};
