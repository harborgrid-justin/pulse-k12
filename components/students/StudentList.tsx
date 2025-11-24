import React, { useState } from 'react';
import { Student } from '../../types';
import { Search, Filter, AlertTriangle, Phone, AlertOctagon } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'grade'>('name');

  const parseGrade = (grade: string): number => {
    const g = grade.toUpperCase();
    if (g === 'PK') return -1;
    if (g === 'K') return 0;
    const num = parseInt(g, 10);
    return isNaN(num) ? 99 : num;
  };

  const filteredStudents = students
    .filter(s => 
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'grade') {
        const gradeA = parseGrade(a.grade);
        const gradeB = parseGrade(b.grade);
        if (gradeA !== gradeB) return gradeA - gradeB;
      }
      
      // Secondary sort (or primary if sortBy is name)
      const last = a.lastName.localeCompare(b.lastName);
      if (last !== 0) return last;
      return a.firstName.localeCompare(b.firstName);
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
        <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search name..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'grade')}
                className="appearance-none h-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                <option value="name">Sort: Name (A-Z)</option>
                <option value="grade">Sort: Grade (Low-High)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <Filter size={16} />
              </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
            <div 
              key={student.id} 
              onClick={() => onSelectStudent(student)}
              className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary-300 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start space-x-4">
                    <img 
                      src={student.photoUrl} 
                      alt={`${student.firstName} ${student.lastName}`} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-800 truncate">{student.firstName} {student.lastName}</h3>
                            
                            {student.allergies.length > 0 && (
                              <div className="relative group/tooltip ml-2">
                                <AlertOctagon className="text-red-500 fill-red-50" size={20} />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-20">
                                  <p className="font-bold mb-1">Known Allergies:</p>
                                  <ul className="list-disc list-inside">
                                    {student.allergies.map(a => <li key={a.name}>{a.name}</li>)}
                                  </ul>
                                  {/* Tooltip arrow */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                </div>
                              </div>
                            )}
                        </div>
                        
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-1 inline-block">
                            Gr {student.grade}
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
                        
                        <div className="mt-4 flex items-center text-xs text-slate-500">
                            <Phone size={12} className="mr-1" />
                            {student.parentContact}
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
      
      {filteredStudents.length === 0 && (
          <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Search size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No students found</h3>
              <p className="text-slate-500">Try adjusting your search terms.</p>
          </div>
      )}
    </div>
  );
};