import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { VisitLog, Urgency } from '../../types';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  visits: VisitLog[];
}

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
        <Icon size={20} />
      </div>
    </div>
    {subtext && <p className="text-xs text-slate-400 mt-4">{subtext}</p>}
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ visits }) => {
  // Simple analytics
  const totalVisits = visits.length;
  const criticalVisits = visits.filter(v => v.urgency === Urgency.HIGH || v.urgency === Urgency.CRITICAL).length;
  const todaysLogs = visits.filter(v => {
    const vDate = new Date(v.timestamp);
    const now = new Date();
    return vDate.getDate() === now.getDate() && vDate.getMonth() === now.getMonth();
  });
  const todayVisits = todaysLogs.length;

  // Calculate Average Duration
  const totalDuration = todaysLogs.reduce((acc, v) => acc + (v.durationMinutes || 0), 0);
  const avgTime = todayVisits > 0 ? Math.round(totalDuration / todayVisits) : 0;

  // Mock chart data for visuals (in real app, aggregate from visits)
  const data = [
    { name: 'Mon', visits: 12 },
    { name: 'Tue', visits: 19 },
    { name: 'Wed', visits: 15 },
    { name: 'Thu', visits: 22 },
    { name: 'Fri', visits: 18 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Clinic Overview</h2>
           <p className="text-slate-500">Welcome back, Nurse Joy. Here is today's activity.</p>
        </div>
        <div className="text-sm text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm inline-block">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Visits Today" 
          value={todayVisits} 
          icon={Activity} 
          color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
          subtext="+12% from yesterday"
        />
        <StatCard 
          title="High Urgency" 
          value={criticalVisits} 
          icon={AlertTriangle} 
          color={{ bg: 'bg-red-50', text: 'text-red-600' }}
          subtext="Requires follow-up"
        />
        <StatCard 
          title="Avg. Treat Time" 
          value={`${avgTime}m`} 
          icon={Clock} 
          color={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
          subtext="Based on today's logs"
        />
        <StatCard 
          title="Students Cleared" 
          value={totalVisits - criticalVisits} 
          icon={CheckCircle} 
          color={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
          subtext="Returned to class"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="visits" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
           <div className="space-y-4">
              {visits.slice(0, 4).map((visit) => (
                <div key={visit.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    visit.urgency === Urgency.HIGH ? 'bg-red-500' : 
                    visit.urgency === Urgency.MEDIUM ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{visit.treatment}</p>
                    <p className="text-xs text-slate-500">{new Date(visit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {visit.outcome}</p>
                  </div>
                </div>
              ))}
              {visits.length === 0 && <p className="text-sm text-slate-400">No visits recorded yet.</p>}
           </div>
           <button className="w-full mt-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
             View All Logs
           </button>
        </div>
      </div>
    </div>
  );
};