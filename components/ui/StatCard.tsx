
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: 'blue' | 'red' | 'amber' | 'emerald' | 'indigo';
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, variant = 'blue', subtext }) => {
  const variants = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${variants[variant].bg} ${variants[variant].text}`}>
          <Icon size={20} />
        </div>
      </div>
      {subtext && <p className="text-xs text-slate-400 mt-4">{subtext}</p>}
    </div>
  );
};
