
import React, { useState, useEffect, useMemo } from 'react';
import { Student, VisitLog, Prescription, Teacher } from '../../types';
import { 
  FileText, Users, Syringe, FileHeart, Microscope, AlertTriangle 
} from 'lucide-react';

// Sub-components
import { StudentHeader } from './profile/StudentHeader';
import { StudentOverview } from './profile/StudentOverview';
import { StudentImmunizations } from './profile/StudentImmunizations';
import { StudentCarePlans } from './profile/StudentCarePlans';
import { StudentScreenings } from './profile/StudentScreenings';
import { StudentFamily } from './profile/StudentFamily';
import { CompleteProfileModal } from './profile/CompleteProfileModal';
import { CommunicationModal } from './profile/CommunicationModal';
import { Tabs } from '../../ui/Tabs';

interface StudentProfileProps {
  student: Student;
  history: VisitLog[];
  teachers?: Teacher[];
  onBack: () => void;
  onAddVisit?: (visit: VisitLog) => void;
  onAddImmunizationRequest?: () => void;
  onAdministerMedicationRequest?: (prescription: Prescription) => void;
  onUpdateStudent: (student: Student) => void;
  onVisitSelect?: (visit: VisitLog) => void;
  onTeacherClick?: (teacher: Teacher) => void;
}

type TabId = 'overview' | 'immunizations' | 'careplans' | 'screenings' | 'family';

export const StudentProfile: React.FC<StudentProfileProps> = ({ 
    student: initialStudent, 
    history,
    teachers = [], 
    onBack, 
    onAddVisit, 
    onAddImmunizationRequest,
    onAdministerMedicationRequest,
    onUpdateStudent,
    onVisitSelect,
    onTeacherClick
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [student, setStudent] = useState<Student>(initialStudent);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);

  useEffect(() => {
    setStudent(initialStudent);
  }, [initialStudent]);

  const recentVisits = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const assignedTeacher = teachers.find(t => t.id === student.teacherId);

  const handleStudentUpdate = (updatedData: Partial<Student>) => {
      const updated = { ...student, ...updatedData };
      setStudent(updated);
      onUpdateStudent(updated);
  };

  // Missing Fields Detection
  const missingFields = useMemo(() => {
      const missing: string[] = [];
      if (!student.bloodType) missing.push('Blood Type');
      if (!student.height) missing.push('Height');
      if (!student.weight) missing.push('Weight');
      if (!student.gender) missing.push('Gender');
      if (!student.dob) missing.push('Date of Birth');
      return missing;
  }, [student]);

  const tabs = [
      { id: 'overview', label: 'Clinical Overview', icon: FileText },
      { id: 'careplans', label: 'Care Plans (IHP/EAP)', icon: FileHeart },
      { id: 'screenings', label: 'Health Screenings', icon: Microscope },
      { id: 'immunizations', label: 'Immunization', icon: Syringe },
      { id: 'family', label: 'Family & Portal', icon: Users },
  ];

  return (
    <div className="animate-fade-in space-y-6 h-full flex flex-col relative">
      
      {/* Missing Fields Alert */}
      {missingFields.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between animate-pulse-slow">
              <div className="flex items-center">
                  <AlertTriangle className="text-amber-600 mr-3" size={20} />
                  <div>
                      <p className="font-bold text-amber-800">Incomplete Profile</p>
                      <p className="text-sm text-amber-700">
                          Missing critical fields: {missingFields.join(', ')}.
                      </p>
                  </div>
              </div>
              <button 
                onClick={() => setIsCompleteProfileOpen(true)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                  Complete Profile
              </button>
          </div>
      )}

      <StudentHeader 
        student={student}
        assignedTeacher={assignedTeacher}
        onBack={onBack} 
        onUpdate={handleStudentUpdate} 
        onContactParent={() => setIsMsgOpen(true)} 
        onTeacherClick={onTeacherClick}
      />

      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === 'overview' && (
            <StudentOverview 
                student={student} 
                history={recentVisits} 
                onAddVisit={onAddVisit}
                onAdministerMedication={onAdministerMedicationRequest}
                onVisitSelect={onVisitSelect}
            />
        )}

        {activeTab === 'careplans' && (
            <StudentCarePlans student={student} />
        )}

        {activeTab === 'screenings' && (
            <StudentScreenings screenings={student.screenings} />
        )}

        {activeTab === 'immunizations' && (
            <StudentImmunizations student={student} onAddRequest={onAddImmunizationRequest} />
        )}

        {activeTab === 'family' && (
            <StudentFamily student={student} />
        )}
      </div>

       <CompleteProfileModal 
         isOpen={isCompleteProfileOpen} 
         onClose={() => setIsCompleteProfileOpen(false)}
         onSave={handleStudentUpdate}
         student={student}
       />

       <CommunicationModal
         isOpen={isMsgOpen}
         onClose={() => setIsMsgOpen(false)}
         student={student}
       />
    </div>
  );
};
