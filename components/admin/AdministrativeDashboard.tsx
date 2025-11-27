
import React, { useState } from 'react';
import { School, District, County, State } from '../../types';
import { Building2, Users, ShieldCheck, Wallet, AlertOctagon, Map, Activity, Briefcase } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { Tabs } from '../ui/Tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

type AdminLevel = 'SCHOOL' | 'DISTRICT' | 'COUNTY' | 'STATE';

interface AdministrativeDashboardProps {
  level: AdminLevel;
  data: School | District | County | State;
}

export const AdministrativeDashboard: React.FC<AdministrativeDashboardProps> = ({ level, data }) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Type Guards & Data Normalization
  const isSchool = (d: any): d is School => level === 'SCHOOL';
  const isDistrict = (d: any): d is District => level === 'DISTRICT';
  const isCounty = (d: any): d is County => level === 'COUNTY';
  const isState = (d: any): d is State => level === 'STATE';

  // Generic data extraction based on level
  const alerts = isSchool(data) ? [] : isDistrict(data) ? data.districtWideAlerts : isCounty(data) ? data.epidemiologyAlerts : isState(data) ? data.legislativeUpdates : [];
  const subEntityCount = isDistrict(data) ? data.totalSchools : isCounty(data) ? data.totalDistricts : isState(data) ? data.totalCounties : 0;
  const subEntityLabel = isDistrict(data) ? 'Schools' : isCounty(data) ? 'Districts' : isState(data) ? 'Counties' : 'Units';

  // Mock Charts Data (Dynamically adjusted labels)
  const complianceData = [
      { name: 'Compliant', value: Math.floor(data.totalPopulation * (data.complianceRate/100)), color: '#10b981' },
      { name: 'Non-Compliant', value: Math.floor(data.totalPopulation * ((100-data.complianceRate)/100)), color: '#ef4444' },
  ];

  const budgetData = [
      { name: 'Allocated', value: data.budget.allocated },
      { name: 'Spent', value: data.budget.spent },
      { name: 'Remaining', value: data.budget.allocated - data.budget.spent },
  ];

  const tabs = [
      { id: 'OVERVIEW', label: 'Overview', icon: Activity },
      { id: 'FINANCIALS', label: 'Financials', icon: Wallet },
      { id: 'COMPLIANCE', label: 'Compliance', icon: ShieldCheck },
      ...(level !== 'SCHOOL' ? [{ id: 'SUB_ENTITIES', label: subEntityLabel, icon: Map }] : [])
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
        {/* Universal Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className={`p-4 rounded-full border shadow-sm ${
                level === 'SCHOOL' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                level === 'DISTRICT' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                level === 'COUNTY' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                'bg-slate-800 text-white border-slate-900'
            }`}>
                {level === 'STATE' ? <Map size={32} /> : <Building2 size={32} />}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{level} ADMINISTRATION</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-800">{data.name}</h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 font-medium">
                    <span className="flex items-center"><Briefcase size={16} className="mr-1.5 text-slate-400" /> {data.headOfAdmin}</span>
                    <span className="flex items-center"><Users size={16} className="mr-1.5 text-slate-400" /> {data.totalPopulation.toLocaleString()} Constituents</span>
                </div>
            </div>
            <div className="text-right hidden md:block">
                <p className="text-xs text-slate-400 font-bold uppercase">Compliance Index</p>
                <p className={`text-3xl font-bold ${data.complianceRate > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{data.complianceRate}%</p>
            </div>
        </div>

        {/* Navigation */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Dynamic Content */}
        {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Row */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Population" value={data.totalPopulation.toLocaleString()} icon={Users} variant="blue" />
                    <StatCard title="Budget Utilization" value={`${Math.round((data.budget.spent / data.budget.allocated) * 100)}%`} icon={Wallet} variant={data.budget.spent / data.budget.allocated > 0.9 ? 'red' : 'emerald'} />
                    <StatCard title="Active Alerts" value={alerts.length} icon={AlertOctagon} variant={alerts.length > 0 ? 'amber' : 'emerald'} />
                    <StatCard title="Sub-Entities" value={subEntityCount || 'N/A'} icon={Building2} variant="indigo" />
                </div>

                {/* Alerts Panel */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <AlertOctagon size={20} className="mr-2 text-amber-500" />
                        Active Administrative Alerts
                    </h3>
                    {alerts.length > 0 ? (
                        <div className="space-y-3">
                            {alerts.map((alert, idx) => (
                                <div key={idx} className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <p className="text-amber-900 font-medium">{alert}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 italic">No active alerts.</div>
                    )}
                </div>

                {/* Compliance Mini-Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Compliance Snapshot</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                    {complianceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'FINANCIALS' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 font-bold uppercase">Total Allocation</p>
                        <p className="text-3xl font-bold text-slate-800">${data.budget.allocated.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 font-bold uppercase">Total Spent</p>
                        <p className="text-3xl font-bold text-blue-600">${data.budget.spent.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 font-bold uppercase">Remaining</p>
                        <p className="text-3xl font-bold text-emerald-600">${(data.budget.allocated - data.budget.spent).toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Budget Overview</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={budgetData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'COMPLIANCE' && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
                <ShieldCheck size={48} className="mx-auto text-primary-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Compliance Rate: {data.complianceRate}%</h2>
                <p className="text-slate-500 max-w-md mx-auto mt-2">
                    {data.complianceRate > 90 
                        ? "Excellent standing. Meets all state and federal health reporting requirements." 
                        : "Attention required. Several sub-units are reporting below the threshold for immunization verification."}
                </p>
                <div className="mt-8 w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${data.complianceRate > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${data.complianceRate}%` }}></div>
                </div>
            </div>
        )}

        {activeTab === 'SUB_ENTITIES' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Registered {subEntityLabel}</h3>
                </div>
                <div className="p-12 text-center text-slate-400 italic">
                    <Map size={32} className="mx-auto mb-2 opacity-20" />
                    Detailed list of {subEntityCount} {subEntityLabel.toLowerCase()} available in advanced report.
                </div>
            </div>
        )}
    </div>
  );
};
