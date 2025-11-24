
import React, { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentList } from './components/students/StudentList';
import { StudentProfile } from './components/students/StudentProfile';
import { VisitManager } from './components/visits/VisitManager';
import { VisitDetail } from './components/visits/VisitDetail'; // Added
import { Pharmacy } from './components/medications/Pharmacy';
import { AIAssistant } from './components/ai/AIAssistant';
import { SchoolProfile } from './components/admin/SchoolProfile';
import { DistrictProfile } from './components/admin/DistrictProfile';
import { TeacherProfile } from './components/staff/TeacherProfile'; // Added
import { StaffDirectory } from './components/staff/StaffDirectory'; // Added
import { GradeList } from './components/students/GradeList'; // Added
import { StateReporting } from './components/reports/StateReporting';
import { VaccineStatusReport } from './components/reports/VaccineStatusReport'; // Added
import { DataService } from './services/dataService';
import { Student, VisitLog, Medication, ViewState, School, District, Teacher } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [visits, setVisits] = useState<VisitLog[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [district, setDistrict] = useState<District | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  // Interaction State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<VisitLog | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loadedStudents, loadedVisits, loadedMeds, loadedSchool, loadedDistrict, loadedTeachers] = await Promise.all([
          DataService.getStudents(),
          DataService.getVisits(),
          DataService.getMedications(),
          DataService.getSchoolProfile(),
          DataService.getDistrictProfile(),
          DataService.getTeachers()
        ]);
        setStudents(loadedStudents);
        setVisits(loadedVisits);
        setMedications(loadedMeds);
        setSchool(loadedSchool);
        setDistrict(loadedDistrict);
        setTeachers(loadedTeachers);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigate = (newView: ViewState) => {
    setView(newView);
    // Clear selections on main nav change (optional, depends on UX preference)
    if (newView !== ViewState.STUDENT_PROFILE) setSelectedStudent(null);
    if (newView !== ViewState.VISIT_DETAIL) setSelectedVisit(null);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setView(ViewState.STUDENT_PROFILE);
  };

  const handleVisitSelect = (visit: VisitLog) => {
    setSelectedVisit(visit);
    setView(ViewState.VISIT_DETAIL);
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setView(ViewState.TEACHER_PROFILE);
  }

  const handleGradeSelect = (grade: string) => {
    // Find a teacher for this grade to show the Teacher Profile as a proxy for "Class View"
    // In a real app, Grade View might be separate from Teacher View.
    // Here we'll just filter students in the StudentList for simplicity, or show a teacher if available.
    
    // For now, let's just go to student list with a filter, BUT since the request asked for "Teacher Profile Page", 
    // let's try to find a teacher associated with this grade to demo that view.
    const teacher = teachers.find(t => t.grade === grade);
    if (teacher) {
        setSelectedTeacher(teacher);
        setView(ViewState.TEACHER_PROFILE);
    } else {
        // Fallback if no specific teacher found for grade, just go to student list (you might implement a filter here later)
        alert(`No specific teacher profile found for Grade ${grade} in mock data. Try Grade 2 or 4.`);
    }
  };

  const handleAddVisit = async (visit: VisitLog) => {
    const newVisit = await DataService.addVisit(visit);
    setVisits(prev => [newVisit, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-slate-500 font-medium">Loading Pulse K12...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} onNavigate={handleNavigate}>
      {view === ViewState.DASHBOARD && <Dashboard visits={visits} />}
      
      {view === ViewState.STUDENTS && (
        <StudentList 
          students={students} 
          onSelectStudent={handleStudentSelect} 
        />
      )}

      {view === ViewState.STUDENT_PROFILE && selectedStudent && (
        <StudentProfile 
          student={selectedStudent} 
          history={visits.filter(v => v.studentId === selectedStudent.id)}
          onBack={() => setView(ViewState.STUDENTS)}
        />
      )}
      
      {view === ViewState.VISITS && (
        <VisitManager 
          visits={visits}
          students={students}
          onAddVisit={handleAddVisit}
          onViewVisitDetail={handleVisitSelect} // Added
          preSelectedStudent={selectedStudent}
        />
      )}

      {view === ViewState.VISIT_DETAIL && selectedVisit && (
        <VisitDetail 
            visit={selectedVisit}
            student={students.find(s => s.id === selectedVisit.studentId) || students[0]}
            onBack={() => setView(ViewState.VISITS)}
            onSelectStudent={handleStudentSelect}
        />
      )}
      
      {view === ViewState.MEDICATIONS && (
        <Pharmacy medications={medications} />
      )}
      
      {view === ViewState.AI_ASSISTANT && (
        <AIAssistant />
      )}

      {view === ViewState.SCHOOL_PROFILE && school && (
        <SchoolProfile school={school} />
      )}

      {view === ViewState.DISTRICT_PROFILE && district && (
        <DistrictProfile district={district} />
      )}

      {view === ViewState.GRADE_LIST && (
        <GradeList students={students} onSelectGrade={handleGradeSelect} />
      )}

      {view === ViewState.TEACHERS && (
        <StaffDirectory teachers={teachers} onSelectTeacher={handleTeacherSelect} />
      )}

      {view === ViewState.TEACHER_PROFILE && selectedTeacher && (
        <TeacherProfile 
            teacher={selectedTeacher}
            students={students.filter(s => s.teacherId === selectedTeacher.id)}
            onBack={() => setView(ViewState.TEACHERS)}
            onSelectStudent={handleStudentSelect}
        />
      )}

      {view === ViewState.REPORTS && school && (
        <StateReporting school={school} />
      )}

      {view === ViewState.REPORT_VACCINE && (
        <VaccineStatusReport 
          students={students} 
          onSelectStudent={handleStudentSelect}
        />
      )}
    </Layout>
  );
};

export default App;
