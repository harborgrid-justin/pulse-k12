
import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Search, Filter, User, ChevronDown, AlertTriangle, Users } from 'lucide-react';
import { StudentCard } from './StudentCard';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { TableSkeleton } from '../ui/Skeleton';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

const PAGE_SIZE = 20;

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'issues'>('grade');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(true);

  useEffect(() => {
    // Simulate a quick load to show off the skeleton
    const timer = setTimeout(() => setIsSimulatingLoad(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, sortBy]);

  const parseGrade = (grade: string): number => {
    const g = grade.toUpperCase();
    if (g === 'PK') return -1;
    if (g === 'K') return 0;
    const num = parseInt(g, 10);
    return isNaN(num) ? 99 : num;
  };

  const isProfileIncomplete = (s: Student) => {
      return !s.bloodType || !s.height || !s.weight || !s.gender || !s.dob;
  };

  const filteredStudents = students
    .filter(s => 
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(s => {
        if (sortBy === 'issues') return isProfileIncomplete(s);
        return true;
    });

  const loadMore = () => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredStudents.length));
  };

  const renderContent = () => {
      if (isSimulatingLoad) {
          return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => <TableSkeleton key={i} rows={1} />)}
              </div>
          );
      }

      if (filteredStudents.length === 0) {
          return (
              <EmptyState 
                icon={sortBy === 'issues' ? AlertTriangle : Users}
                title={sortBy === 'issues' ? "No Issues Found" : "No Students Found"}
                description={sortBy === 'issues' ? "All student profiles are complete." : "Try adjusting your search terms to find the student you are looking for."}
              />
          );
      }

      if (sortBy === 'grade') {
          const groupedStudents = filteredStudents.reduce((acc, student) => {
            const gradeKey = student.grade;
            if (!acc[gradeKey]) {
              acc[gradeKey] = [];
            }
            acc[gradeKey].push(student);
            return acc;
          }, {} as Record<string, Student[]>);

          const sortedGradeKeys = Object.keys(groupedStudents).sort((a, b) => parseGrade(a) - parseGrade(b));
          
          let renderedCount = 0;
          const elements: React.ReactNode[] = [];

          for (const grade of sortedGradeKeys) {
              if (renderedCount >= visibleCount) break;
              
              const groupStudents = groupedStudents[grade].sort((a,b) => a.lastName.localeCompare(b.lastName));
              
              elements.push(
                <div key={grade} className="animate-fade-in mb-8">
                    <div className="flex items-center space-x-3 mb-4 sticky top-24 z-10 bg-slate-50/95 backdrop-blur py-2 border-b border-slate-200/50">
                        <div className="bg-primary-100 text-primary-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm">
                            {grade}
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">
                            {grade === 'PK' ? 'Pre-Kindergarten' : grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
                        </h3>
                        <span className="text-xs font-medium text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {groupStudents.length} Students
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupStudents.map(student => (
                            <StudentCard key={student.id} student={student} onClick={onSelectStudent} />
                        ))}
                    </div>
                </div>
              );
              renderedCount += groupStudents.length;
          }
          return elements;
      } else {
          const sortedFlatStudents = [...filteredStudents].sort((a, b) => {
            const last = a.lastName.localeCompare(b.lastName);
            if (last !== 0) return last;
            return a.firstName.localeCompare(b.firstName);
          });
          
          const visibleStudents = sortedFlatStudents.slice(0, visibleCount);

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleStudents.map(student => (
                    <StudentCard key={student.id} student={student} onClick={onSelectStudent} />
                ))}
            </div>
          );
      }
  };

  const issuesCount = students.filter(isProfileIncomplete).length;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <Card className="sticky top-0 z-20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Student Directory</h2>
                <p className="text-sm text-slate-500">Manage profiles & records</p>
            </div>
            <div className="flex w-full sm:w-auto gap-3">
                <div className="w-full sm:w-64">
                    <Input 
                        icon={Search} 
                        placeholder="Search name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-48">
                    <Select 
                        options={[
                            { value: 'grade', label: 'Group by Grade' },
                            { value: 'name', label: 'Sort by Name (A-Z)' },
                            { value: 'issues', label: `Data Issues (${issuesCount})` }
                        ]}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'grade' | 'issues')}
                    />
                </div>
            </div>
        </div>
      </Card>

      {renderContent()}
      
      {!isSimulatingLoad && filteredStudents.length > visibleCount && sortBy !== 'grade' && (
          <div className="flex justify-center mt-8">
              <Button onClick={loadMore} variant="outline" icon={ChevronDown}>
                  Load More Students ({filteredStudents.length - visibleCount} remaining)
              </Button>
          </div>
      )}
    </div>
  );
};
