
import React, { useState } from 'react';
import { Incident, Student, FollowUpStatus } from '../../types';
import { Plus, BarChart2, List, Clock } from 'lucide-react';
import { IncidentReports } from './IncidentReports';
import { IncidentList } from './IncidentList';
import { IncidentFollowUpTracker } from './IncidentFollowUpTracker';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';

interface IncidentManagerProps {
  incidents: Incident[];
  students: Student[];
  onAddIncident: () => void;
  onUpdateIncident: (incident: Incident) => void;
}

type Tab = 'LIST' | 'FOLLOW_UP' | 'REPORTS';

export const IncidentManager: React.FC<IncidentManagerProps> = ({ incidents, students, onAddIncident, onUpdateIncident }) => {
  const [activeTab, setActiveTab] = useState<Tab>('LIST');

  // Derived state for badge
  const pendingFollowUps = incidents.filter(i => i.followUpRequired && i.followUpStatus !== FollowUpStatus.COMPLETED && i.followUpStatus !== FollowUpStatus.NO_ACTION_NEEDED).length;

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
        <PageHeader 
            title="Incident & Injury Reporting"
            subtitle="Document injuries, accidents, and behavioral incidents."
            actions={
                <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto max-w-full no-scrollbar">
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setActiveTab('LIST')}
                        icon={List}
                        className={`whitespace-nowrap ${activeTab === 'LIST' ? 'bg-primary-50 text-primary-700 shadow-none hover:bg-primary-100' : ''}`}
                    >
                        Log
                    </Button>
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setActiveTab('FOLLOW_UP')}
                        icon={Clock}
                        className={`whitespace-nowrap ${activeTab === 'FOLLOW_UP' ? 'bg-primary-50 text-primary-700 shadow-none hover:bg-primary-100' : ''}`}
                    >
                        Follow-ups
                        {pendingFollowUps > 0 && <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-1.5 rounded-full">{pendingFollowUps}</span>}
                    </Button>
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setActiveTab('REPORTS')}
                        icon={BarChart2}
                        className={`whitespace-nowrap ${activeTab === 'REPORTS' ? 'bg-primary-50 text-primary-700 shadow-none hover:bg-primary-100' : ''}`}
                    >
                        Reports
                    </Button>
                    <div className="w-px bg-slate-200 mx-1"></div>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={onAddIncident}
                        icon={Plus}
                        className="text-red-600 hover:bg-red-50 whitespace-nowrap"
                    >
                        New Incident
                    </Button>
                </div>
            }
        />

        <div className="flex-1 min-h-0">
            {activeTab === 'LIST' && (
                <IncidentList incidents={incidents} students={students} />
            )}

            {activeTab === 'FOLLOW_UP' && (
                <IncidentFollowUpTracker 
                    incidents={incidents} 
                    students={students} 
                    onUpdateIncident={onUpdateIncident} 
                />
            )}

            {activeTab === 'REPORTS' && (
                <IncidentReports incidents={incidents} />
            )}
        </div>
    </div>
  );
};
