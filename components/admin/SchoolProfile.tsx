
import React, { useState } from 'react';
import { School } from '../../types';
import { 
  Building, MapPin, Phone, Activity, Wallet, Monitor, Thermometer
} from 'lucide-react';

import { SchoolOverview } from './school/SchoolOverview';
import { SchoolFinancials } from './school/SchoolFinancials';
import { SchoolAssets } from './school/SchoolAssets';
import { SchoolSystem } from './school/SchoolSystem';
import { Tabs } from '../ui/Tabs';

interface SchoolProfileProps {
  school: School;
}

export const SchoolProfile: React.FC<SchoolProfileProps> = ({ school }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

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

  const tabs = [
      { id: 'overview', label: 'Overview & Ops', icon: Activity },
      { id: 'financials', label: 'Financials', icon: Wallet },
      { id: 'assets', label: 'Assets & Resources', icon: Thermometer },
      { id: 'system', label: 'System Health', icon: Monitor },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Standardized Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="bg-slate-100 p-4 rounded-full text-slate-600 border border-slate-200">
           <Building size={32} />
        </div>
        <div className="flex-1">
           <h1 className="text-3xl font-bold text-slate-800">{school.name}</h1>
           <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 font-medium">
             <span className="flex items-center"><MapPin size={16} className="mr-1.5 text-slate-400" /> {school.address}</span>
             <span className="flex items-center"><Phone size={16} className="mr-1.5 text-slate-400" /> {school.phone}</span>
           </div>
        </div>
        <div className="flex gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto mt-4 md:mt-0">
             <div className="text-left md:text-right">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Students</p>
                <p className="text-2xl font-bold text-slate-800">{school.totalStudents}</p>
             </div>
             <div className="text-left md:text-right">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Compliance</p>
                <p className="text-2xl font-bold text-emerald-600">{school.complianceRate}%</p>
            </div>
        </div>
      </div>

      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {/* Content Area */}
      {activeTab === 'overview' && <SchoolOverview school={school} peakHoursData={peakHoursData} />}
      {activeTab === 'financials' && <SchoolFinancials school={school} />}
      {activeTab === 'assets' && <SchoolAssets school={school} />}
      {activeTab === 'system' && <SchoolSystem school={school} />}
    </div>
  );
};
