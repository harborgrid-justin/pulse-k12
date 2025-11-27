
import React, { useState } from 'react';
import { Medication, Student, Prescription } from '../../types';
import { Calendar, List } from 'lucide-react';
import { PharmacyInventory } from './PharmacyInventory';
import { PharmacyMARDashboard } from './PharmacyMARDashboard';
import { Tabs } from '../ui/Tabs';

interface PharmacyProps {
  medications: Medication[];
  students?: Student[];
  onAdminister: (studentId: string, rx: Prescription) => void;
  onAddMedication?: (med: Medication) => void;
}

export const Pharmacy: React.FC<PharmacyProps> = ({ medications, students = [], onAdminister, onAddMedication }) => {
  const [activeTab, setActiveTab] = useState<string>('MAR_DASHBOARD');
  
  const tabs = [
      { id: 'MAR_DASHBOARD', label: 'Administration Schedule', icon: Calendar },
      { id: 'INVENTORY', label: 'Medication Inventory', icon: List }
  ];

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
       {/* Header & Tabs */}
       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Pharmacy & Medication Management</h2>
                <p className="text-slate-500">Inventory Control and Medication Administration Record (MAR).</p>
            </div>
            <div className="w-full xl:w-auto">
                <Tabs 
                    tabs={tabs} 
                    activeTab={activeTab} 
                    onChange={setActiveTab} 
                    variant="pills"
                />
            </div>
       </div>

       {/* Content Area */}
       <div className="flex-1 min-h-0">
           {activeTab === 'MAR_DASHBOARD' && (
               <PharmacyMARDashboard students={students} onAdminister={onAdminister} />
           )}
           {activeTab === 'INVENTORY' && (
               <PharmacyInventory medications={medications} onAddMedication={onAddMedication} />
           )}
       </div>
    </div>
  );
};
