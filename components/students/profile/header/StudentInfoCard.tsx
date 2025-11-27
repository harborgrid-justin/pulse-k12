
import React from 'react';
import { Student, Teacher } from '../../../types';
import { UserCheck, Calendar, Activity, Phone, GraduationCap } from 'lucide-react';

interface StudentInfoCardProps {
  student: Student;
  assignedTeacher?: Teacher;
  onTeacherClick?: (teacher: Teacher) => void;
}

export const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ student, assignedTeacher, onTeacherClick }) => {
  return (
    <div className="w-full">
        <h1 className="text-3xl font-bold text-slate-800">{student.firstName} {student.lastName}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 font-medium">
            <span className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-100">
                <UserCheck size={16} className="mr-1.5 text-slate-400" /> Grade {student.grade}
            </span>
            <span className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-100">
                <Calendar size={16} className="mr-1.5 text-slate-400" /> {new Date().getFullYear() - new Date(student.dob).getFullYear()} Years Old
            </span>
            <span className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-100">
                <Activity size={16} className="mr-1.5 text-slate-400" /> {student.gender}
            </span>
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
            {assignedTeacher && (
                <button 
                    onClick={() => onTeacherClick && onTeacherClick(assignedTeacher)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center font-medium group bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors"
                >
                    <GraduationCap size={16} className="mr-1.5" />
                    Teacher: {assignedTeacher.firstName} {assignedTeacher.lastName} (Room {assignedTeacher.room})
                </button>
            )}
            {student.parentPhone && (
                <a 
                    href={`tel:${student.parentPhone}`}
                    className="text-sm text-emerald-700 hover:text-emerald-900 flex items-center font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:border-emerald-200 transition-colors"
                >
                    <Phone size={16} className="mr-1.5" />
                    Call Parent: {student.parentContact} ({student.parentPhone})
                </a>
            )}
        </div>
    </div>
  );
};
