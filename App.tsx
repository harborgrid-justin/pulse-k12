
import React, { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { ViewSwitch } from './components/ViewSwitch';
import { useApplicationData } from './hooks/useApplicationData';
import { DataService } from './services/dataService';
import { Student, VisitLog, ViewState, Teacher, Incident, ImmunizationRecord, Prescription, Medication } from './types';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageSkeleton } from './components/ui/Skeleton';
import { ToastProvider } from './components/ui/Toast';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Data Hook
  const appData = useApplicationData();
  const { 
    setStudents, setVisits, setIncidents, setAuditLogs, setMedications, isLoading
  } = appData;

  // Interaction State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<VisitLog | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [medicationToAdminister, setMedicationToAdminister] = useState<{student: Student, prescription: Prescription} | null>(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [view, selectedStudent, selectedVisit]);

  const handleNavigate = (newView: ViewState) => {
    setView(newView);
    if (newView !== ViewState.STUDENT_PROFILE && newView !== ViewState.ADD_IMMUNIZATION && newView !== ViewState.ADMINISTER_MEDICATION) setSelectedStudent(null);
    if (newView !== ViewState.VISIT_DETAIL && newView !== ViewState.EDIT_VISIT) setSelectedVisit(null);
  };

  const handlers = {
    handleStudentSelect: (student: Student) => {
      setSelectedStudent(student);
      setView(ViewState.STUDENT_PROFILE);
    },
    handleVisitSelect: (visit: VisitLog) => {
      setSelectedVisit(visit);
      setView(ViewState.VISIT_DETAIL);
    },
    handleTeacherSelect: (teacher: Teacher) => {
      setSelectedTeacher(teacher);
      setView(ViewState.TEACHER_PROFILE);
    },
    handleGradeSelect: (grade: string) => {
      const teacher = appData.teachers.find(t => t.grade === grade);
      if (teacher) {
          setSelectedTeacher(teacher);
          setView(ViewState.TEACHER_PROFILE);
      } else {
          alert(`No specific teacher profile found for Grade ${grade} in mock data. Try Grade 2 or 4.`);
      }
    },
    handleAddVisit: async (visit: VisitLog) => {
      const newVisit = await DataService.addVisit(visit);
      setVisits(prev => [newVisit, ...prev]);
      if (view === ViewState.ADMINISTER_MEDICATION) {
          if (selectedStudent) setView(ViewState.STUDENT_PROFILE);
          else setView(ViewState.MEDICATIONS);
      } else {
          setView(ViewState.VISITS);
      }
    },
    handleUpdateVisit: async (visit: VisitLog) => {
      const updated = await DataService.updateVisit(visit);
      setVisits(prev => prev.map(v => v.id === updated.id ? updated : v));
      if (selectedVisit && selectedVisit.id === updated.id) {
          setSelectedVisit(updated);
      }
      const logs = await DataService.getAuditLogs();
      setAuditLogs(logs);
      setView(ViewState.VISIT_DETAIL);
    },
    handleAddIncident: async (incident: Incident) => {
        const newInc = await DataService.addIncident(incident);
        setIncidents(prev => [newInc, ...prev]);
        setView(ViewState.INCIDENTS);
    },
    handleUpdateIncident: async (incident: Incident) => {
        const updated = await DataService.updateIncident(incident);
        setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i));
    },
    handleAddImmunization: (record: ImmunizationRecord) => {
        if (selectedStudent) {
            const updatedStudent = {
                ...selectedStudent,
                immunizations: [...(selectedStudent.immunizations || []), record]
            };
            setStudents(prev => prev.map(s => s.id === selectedStudent.id ? updatedStudent : s));
            setSelectedStudent(updatedStudent);
            setView(ViewState.STUDENT_PROFILE);
        }
    },
    handleAdministerMedication: (prescription: Prescription, student?: Student) => {
        const targetStudent = student || selectedStudent;
        if (targetStudent) {
            setMedicationToAdminister({ student: targetStudent, prescription });
            setView(ViewState.ADMINISTER_MEDICATION);
        }
    },
    handleAddMedication: (medication: Medication) => {
      setMedications(prev => [...prev, medication]);
    },
    handleUpdateStudent: async (student: Student) => {
        const updated = await DataService.updateStudent(student);
        setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
        if (selectedStudent && selectedStudent.id === updated.id) {
            setSelectedStudent(updated);
        }
    },
    setView,
    setMedicationToAdminister,
    setSelectedVisit
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Layout currentView={view} onNavigate={handleNavigate}>
            {isLoading ? (
                <PageSkeleton />
            ) : (
                <ViewSwitch 
                    view={view}
                    data={appData}
                    selection={{ selectedStudent, selectedVisit, selectedTeacher, medicationToAdminister }}
                    handlers={handlers}
                />
            )}
        </Layout>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
