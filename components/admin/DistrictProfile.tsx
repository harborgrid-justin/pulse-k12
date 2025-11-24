import React from 'react';
import { District } from '../../types';
import { Building2, School as SchoolIcon, Users, AlertOctagon } from 'lucide-react';

interface DistrictProfileProps {
  district: District;
}

export const DistrictProfile: React.FC<DistrictProfileProps> = ({ district }) => {
  return (
    <div className="animate-fade-in space-y-6">
       <div className="bg-slate-800 text-white p-8 rounded-xl shadow-md">
         <div className="flex items-center space-x-3 mb-4">
           <Building2 size={32} className="text-blue-400" />
           <h1 className="text-3xl font-bold">{district.name}</h1>
         </div>
         <p className="text-slate-300 text-lg">Superintendent: {district.superintendent}</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
             <div className="bg-blue-100 p-3 rounded-full text-blue-600">
               <SchoolIcon size={24} />
             </div>
             <div>
               <p className="text-slate-500 text-sm font-medium">Total Schools</p>
               <p className="text-2xl font-bold text-slate-800">{district.totalSchools}</p>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
             <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
               <Users size={24} />
             </div>
             <div>
               <p className="text-slate-500 text-sm font-medium">Total Enrollment</p>
               <p className="text-2xl font-bold text-slate-800">{district.totalStudents.toLocaleString()}</p>
             </div>
          </div>
       </div>

       <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
         <h3 className="text-amber-800 font-bold text-lg mb-4 flex items-center">
           <AlertOctagon size={24} className="mr-2" />
           District-Wide Health Alerts
         </h3>
         <div className="space-y-3">
           {district.districtWideAlerts.map((alert, idx) => (
             <div key={idx} className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm flex items-start">
               <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3"></span>
               <p className="text-slate-700 font-medium">{alert}</p>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
};