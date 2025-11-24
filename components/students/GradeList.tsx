import React from 'react';
import { Student } from '../../types';
import { Users, ChevronRight } from 'lucide-react';

interface GradeListProps {
  students: Student[];
  onSelectGrade: (grade: string) => void;
}

export const GradeList: React.FC<GradeListProps> = ({ students, onSelectGrade }) => {
  // Group students by grade
  const gradeGroups = students.reduce((acc, student) => {
    const grade = student.grade;
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  // Sort grades logic (K -> 1 -> 2 etc)
  const sortedGrades = Object.keys(gradeGroups).sort((a, b) => {
    const gradeA = a === 'K' || a === 'PK' ? -1 : parseInt(a) || 99;
    const gradeB = b === 'K' || b === 'PK' ? -1 : parseInt(b) || 99;
    return gradeA - gradeB;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Grade Levels</h2>
      <p className="text-slate-500">Overview of student population by grade.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGrades.map(grade => {
          const group = gradeGroups[grade];
          const alerts = group.filter(s => s.allergies.length > 0 || s.conditions.length > 0).length;
          
          return (
            <div 
              key={grade} 
              onClick={() => onSelectGrade(grade)}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="bg-primary-50 text-primary-600 p-3 rounded-lg font-bold text-xl w-12 h-12 flex items-center justify-center">
                    {grade}
                 </div>
                 <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <ChevronRight size={20} />
                 </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                 {grade === 'K' ? 'Kindergarten' : grade === 'PK' ? 'Pre-K' : `Grade ${grade}`}
              </h3>
              
              <div className="flex items-center text-sm text-slate-500 mb-3">
                 <Users size={16} className="mr-2" />
                 {group.length} Students
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                 <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs font-medium">
                 <span className="text-slate-400">Enrollment</span>
                 {alerts > 0 && <span className="text-red-500">{alerts} Medical Alerts</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};