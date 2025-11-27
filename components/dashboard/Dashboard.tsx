
import React from 'react';
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { VisitLog, Urgency, Student, School, Medication, Incident, ViewState } from '../../types';
import { Activity, AlertTriangle, CheckCircle, Clock, Shield, Pill, AlertOctagon, ArrowRight } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface DashboardProps {
  visits: VisitLog[];
  students: Student[];
  school: School | null;
  medications: Medication[];
  incidents: Incident[];
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ visits, students, school, medications, incidents, onNavigate }) => {
  // --- Critical Metrics ---
  const todaysLogs = visits.filter(v => {
    const vDate = new Date(v.timestamp);
    const now = new Date();
    return vDate.getDate() === now.getDate() && vDate.getMonth() === now.getMonth();
  });
  
  const highRiskIncidents = incidents.filter(i => i.status === 'OPEN' && (i.severity === 'SEVERE' || i.severity === 'CRITICAL'));
  const lowStockMeds = medications.filter(m => m.stock < 10);
  const complianceRate = school?.complianceRate || 0;
  const nonCompliantStudents = Math.round(students.length * ((100 - complianceRate) / 100));

  // --- Chart Data ---
  const weeklyVolume = [
    { name: 'Mon', visits: 24, incidents: 1 },
    { name: 'Tue', visits: 32, incidents: 0 },
    { name: 'Wed', visits: 18, incidents: 2 },
    { name: 'Thu', visits: 28, incidents: 0 },
    { name: 'Fri', visits: 35, incidents: 1 },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader 
        title="Welcome, Mrs. Melinda Saadein" 
        subtitle="Clinic Command Center • West Newton Elementary"
        actions={
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                System Online
            </div>
        }
      />

      {/* Top Row: Immediate Action Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Visits Today" 
          value={todaysLogs.length} 
          icon={Activity} 
          variant="blue"
          subtext={`${visits.length} total this week`}
        />
        <StatCard 
          title="Compliance Rate" 
          value={`${complianceRate}%`} 
          icon={Shield} 
          variant={complianceRate > 95 ? 'emerald' : 'amber'}
          subtext={`${nonCompliantStudents} students missing records`}
        />
        <StatCard 
          title="Active Risks" 
          value={highRiskIncidents.length} 
          icon={AlertTriangle} 
          variant={highRiskIncidents.length > 0 ? 'red' : 'emerald'}
          subtext="Open severe incidents"
        />
        <StatCard 
          title="Low Inventory" 
          value={lowStockMeds.length} 
          icon={Pill} 
          variant={lowStockMeds.length > 0 ? 'amber' : 'blue'}
          subtext="Items need reorder"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <Card title="Weekly Health Trends" className="xl:col-span-2 h-full">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVolume} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Inventory & Ops Widget */}
        <div className="space-y-6">
            {/* Medication Alerts */}
            <Card title="Inventory Alerts" className="h-fit">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {lowStockMeds.length > 0 ? (
                        lowStockMeds.map(med => (
                            <div key={med.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-1.5 rounded-md text-amber-600 shadow-sm">
                                        <Pill size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{med.name}</p>
                                        <p className="text-xs text-amber-700 font-medium">{med.stock} {med.unit} remaining</p>
                                    </div>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 text-xs bg-white"
                                    onClick={() => onNavigate(ViewState.MEDICATIONS)}
                                >
                                    Order
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <CheckCircle size={24} className="mx-auto mb-2 text-emerald-400" />
                            <p className="text-sm">Inventory healthy</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => onNavigate(ViewState.NEW_VISIT)}
                    className="p-4 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all text-left group"
                >
                    <Activity size={24} className="mb-2 opacity-80 group-hover:scale-110 transition-transform" />
                    <p className="font-bold">New Visit</p>
                    <p className="text-xs text-indigo-200">Log student encounter</p>
                </button>
                <button 
                    onClick={() => onNavigate(ViewState.NEW_INCIDENT)}
                    className="p-4 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-sm hover:border-primary-300 hover:shadow-md transition-all text-left group"
                >
                    <AlertOctagon size={24} className="mb-2 text-red-500 opacity-80 group-hover:scale-110 transition-transform" />
                    <p className="font-bold">Report Incident</p>
                    <p className="text-xs text-slate-500">Injury or Accident</p>
                </button>
            </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <Card title="Recent Activity Stream" noPadding>
        <div className="divide-y divide-slate-100">
            {visits.slice(0, 5).map(visit => {
                const student = students.find(s => s.id === visit.studentId);
                return (
                    <div key={visit.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                visit.urgency === Urgency.HIGH ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {visit.urgency === Urgency.HIGH ? <AlertTriangle size={18} /> : <Activity size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">
                                    {student ? `${student.firstName} ${student.lastName}` : 'Unknown'}
                                    <span className="font-normal text-slate-500 ml-2">{visit.symptoms}</span>
                                </p>
                                <p className="text-xs text-slate-400 flex items-center mt-0.5">
                                    <Clock size={12} className="mr-1" />
                                    {new Date(visit.timestamp).toLocaleString()} • {visit.outcome}
                                </p>
                            </div>
                        </div>
                        <Badge variant={visit.urgency === Urgency.HIGH ? 'error' : 'neutral'}>{visit.urgency}</Badge>
                    </div>
                );
            })}
            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <button 
                    onClick={() => onNavigate(ViewState.VISITS)}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center justify-center mx-auto"
                >
                    View Full Log <ArrowRight size={12} className="ml-1" />
                </button>
            </div>
        </div>
      </Card>
    </div>
  );
};
