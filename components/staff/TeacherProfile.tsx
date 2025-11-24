import React from 'react';
import { Teacher, Student } from '../../types';
import { ArrowLeft, Mail, MapPin, GraduationCap, Users, User } from 'lucide-react';

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

      {/* Teacher Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="h-32 bg-indigo-600"></div>
         <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
               <img src={teacher.photoUrl} alt={teacher.lastName} className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover shadow-sm" />
               <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-1">
                  <h1 className="text-2xl font-bold text-slate-800">{teacher.firstName} {teacher.lastName}</h1>
                  <p className="text-slate-500">Grade {teacher.grade} Teacher</p>
               </div>
               <div className="mt-4 sm:mt-0 flex space-x-2">
                  <a href={`mailto:${teacher.email}`} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center text-sm font-medium">
                     <Mail size={16} className="mr-2" />
                     Email
                  </a>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-slate-100">
               <div className="flex items-center text-slate-600">
                  <MapPin size={18} className="mr-2 text-slate-400" />
                  Room {teacher.room}
               </div>
               <div className="flex items-center text-slate-600">
                  <Users size={18} className="mr-2 text-slate-400" />
                  {students.length} Students Assigned
               </div>
               <div className="flex items-center text-slate-600">
                  <div className={`w-2 h-2 rounded-full mr-2 ${alertsCount > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                  {alertsCount} Medical Alerts in Class
               </div>
            </div>
         </div>
      </div>

      {/* Student Roster */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
         <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <GraduationCap size={20} className="mr-2 text-primary-600" />
            Class Roster
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
               <div 
                  key={student.id} 
                  onClick={() => onSelectStudent(student)}
                  className="flex items-center p-3 rounded-lg border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all cursor-pointer group"
               >
                  <img src={student.photoUrl} alt={student.firstName} className="w-10 h-10 rounded-full object-cover mr-3" />
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-slate-800 truncate group-hover:text-primary-700">{student.firstName} {student.lastName}</p>
                     {(student.allergies.length > 0 || student.conditions.length > 0) ? (
                        <p className="text-xs text-red-500 font-medium truncate flex items-center">
                           Alerts Present
                        </p>
                     ) : (
                        <p className="text-xs text-slate-400">No alerts</p>
                     )}
                  </div>
               </div>
            ))}
            {students.length === 0 && (
               <div className="col-span-full py-8 text-center text-slate-500">
                  No students assigned to this teacher yet.
               </div>
            )}
         </div>
      </div>
    </div>
  );
};