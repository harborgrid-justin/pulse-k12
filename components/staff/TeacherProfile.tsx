import React from 'react';
import { Teacher, Student } from '../../types';
import { ArrowLeft, Mail, MapPin, GraduationCap, Users, User, Phone, AlertTriangle } from 'lucide-react';

interface TeacherProfileProps {
  teacher: Teacher;
  students: Student[];
  onBack: () => void;
  onSelectStudent: (s: Student) => void;
}

export const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher, students, onBack, onSelectStudent }) => {
  const alertsCount = students.reduce((acc, s) => acc + s.allergies.length + s.conditions.length, 0);

  return (
    <div className="animate-fade-in space-y-6">
       <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Back to Directory
      </button>

      {/* Standardized Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
         <div className="relative">
            <img 
              src={teacher.photoUrl} 
              alt={teacher.lastName} 
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50" 
            />
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-slate-100 shadow-sm">
               <div className="bg-primary-100 text-primary-600 p-1 rounded-full">
                  <User size={14} />
               </div>
            </div>
         </div>
         
         <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800">{teacher.firstName} {teacher.lastName}</h1>
            <p className="text-slate-500 font-medium mb-3">Grade {teacher.grade} Lead Teacher</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 font-medium">
               <span className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  <MapPin size={14} className="mr-1.5 text-slate-400" /> 
                  Room {teacher.room}
               </span>
               <span className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  <Users size={14} className="mr-1.5 text-slate-400" /> 
                  {students.length} Students
               </span>
               {alertsCount > 0 && (
                  <span className="flex items-center bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">
                     <AlertTriangle size={14} className="mr-1.5" />
                     {alertsCount} Medical Alerts
                  </span>
               )}
            </div>
         </div>

         <div className="flex gap-2 w-full md:w-auto">
            <a 
               href={`mailto:${teacher.email}`} 
               className="flex-1 md:flex-none justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center shadow-sm font-medium"
            >
               <Mail size={18} className="mr-2" />
               Email
            </a>
            <button className="flex-1 md:flex-none justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center shadow-sm font-medium">
               <Phone size={18} className="mr-2" />
               Call
            </button>
         </div>
      </div>

      {/* Student Roster */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
               <GraduationCap size={20} className="mr-2 text-primary-600" />
               Class Roster
            </h2>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
               {students.length} Enrolled
            </span>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
               <div 
                  key={student.id} 
                  onClick={() => onSelectStudent(student)}
                  className="flex items-center p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all cursor-pointer group bg-slate-50/50"
               >
                  <img src={student.photoUrl} alt={student.firstName} className="w-10 h-10 rounded-full object-cover mr-3 border border-slate-200" />
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-slate-800 truncate group-hover:text-primary-700 transition-colors">{student.firstName} {student.lastName}</p>
                     {(student.allergies.length > 0 || student.conditions.length > 0) ? (
                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-wide flex items-center mt-0.5">
                           <AlertTriangle size={10} className="mr-1" />
                           Medical Alert
                        </p>
                     ) : (
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide flex items-center mt-0.5">
                           Cleared
                        </p>
                     )}
                  </div>
               </div>
            ))}
            {students.length === 0 && (
               <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No students assigned to this teacher yet.
               </div>
            )}
         </div>
      </div>
    </div>
  );
};