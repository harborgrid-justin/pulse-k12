
import React from 'react';
import { Teacher } from '../../types';
import { Mail, MapPin, Search } from 'lucide-react';

interface StaffDirectoryProps {
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({ teachers, onSelectTeacher }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Staff Directory</h2>
           <p className="text-slate-500">Manage school faculty and classroom assignments.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search staff..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => (
          <div 
            key={teacher.id} 
            onClick={() => onSelectTeacher(teacher)}
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary-300 flex items-start space-x-4"
          >
            <img 
              src={teacher.photoUrl} 
              alt={teacher.lastName} 
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-primary-100" 
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-primary-700">
                {teacher.firstName} {teacher.lastName}
              </h3>
              <p className="text-sm font-medium text-slate-500 mb-2">Grade {teacher.grade} Teacher</p>
              
              <div className="space-y-1">
                <div className="flex items-center text-xs text-slate-500">
                  <MapPin size={12} className="mr-1.5" />
                  Room {teacher.room}
                </div>
                <div className="flex items-center text-xs text-slate-500">
                  <Mail size={12} className="mr-1.5" />
                  {teacher.email}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
