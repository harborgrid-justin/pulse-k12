
import React from 'react';
import { Student } from '../../types';
import { AlertTriangle, Phone, AlertOctagon, FileWarning } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onClick: (s: Student) => void;
}

// Optimized: React.memo prevents re-renders if props haven't changed
export const StudentCard = React.memo<StudentCardProps>(({ student, onClick }) => {
  
  const isMalformed = !student.bloodType || !student.height || !student.weight || !student.gender || !student.dob;

  return (
    <div 
        onClick={() => onClick(student)}
        className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary-300 relative overflow-hidden h-full"
    >
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-start space-x-4">
            <img 
                src={student.photoUrl} 
                alt={`${student.firstName} ${student.lastName}`} 
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 flex-shrink-0"
                loading="lazy"
            />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 truncate">{student.firstName} {student.lastName}</h3>
                    
                    <div className="flex space-x-1 ml-2 flex-shrink-0">
                        {isMalformed && (
                            <div className="text-amber-500 bg-amber-50 rounded-full p-1" title="Incomplete Profile Data">
                                <FileWarning size={16} />
                            </div>
                        )}
                        {student.allergies.length > 0 && (
                            <div className="text-red-500 fill-red-50" title="Medical Alert">
                                <AlertOctagon size={20} />
                            </div>
                        )}
                    </div>
                </div>
                
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-1 inline-block">
                    {student.grade === 'PK' ? 'Pre-K' : student.grade === 'K' ? 'Kindergarten' : `Grade ${student.grade}`}
                </span>
                
                {(student.conditions.length > 0) ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {student.conditions.map(c => (
                            <span key={c} className="inline-flex items-center text-[10px] font-medium bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100">
                                <AlertTriangle size={10} className="mr-1" /> {c}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="mt-2 text-xs text-slate-400 italic">No chronic conditions</p>
                )}
                
                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center text-xs text-slate-500">
                    <Phone size={12} className="mr-1" />
                    <span className="truncate">{student.parentContact}</span>
                </div>
            </div>
        </div>
    </div>
  );
});

StudentCard.displayName = 'StudentCard';
