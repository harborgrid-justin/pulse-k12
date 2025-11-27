
import React from 'react';
import { ViewState, Student, VisitLog, Medication, School, District, County, State, Teacher, Incident, AuditLogEntry, ImmunizationRecord, Prescription, DirectorySchool } from '../types';
import { Dashboard } from './dashboard/Dashboard';
import { StudentList } from './students/StudentList';
import { StudentProfile } from './students/StudentProfile';
import { VisitManager } from './visits/VisitManager';
import { VisitDetail } from './visits/VisitDetail';
import { NewVisitPage } from './visits/NewVisitPage';
import { EditVisitPage } from './visits/EditVisitPage';
import { Pharmacy } from './medications/Pharmacy';
import { AdministerMedicationPage } from './medications/AdministerMedicationPage';
import { IncidentManager } from './incidents/IncidentManager';
import { IncidentForm } from './incidents/IncidentForm';
import { SecurityAudit } from './admin/SecurityAudit';
import { AIAssistant } from './ai/AIAssistant';
import { CommunicationHub } from './communication/CommunicationHub';
import { AdministrativeDashboard } from './admin/AdministrativeDashboard';
import { TeacherProfile } from './staff/TeacherProfile';
import { StaffDirectory } from './staff/StaffDirectory';
import { GradeList } from './students/GradeList';
import { StateReporting } from './reports/StateReporting';
import { VaccineStatusReport } from './reports/VaccineStatusReport';
import { ScreeningReport } from './reports/ScreeningReport';
import { SmartImmunizationModal } from './students/profile/SmartImmunizationModal';

interface ViewSwitchProps {
  view: ViewState;
  data: {
    students: Student[];
    visits: VisitLog[];
    medications: Medication[];
    school: School | null;
    district: District | null;
    county: County | null;
    state: State | null;
    teachers: Teacher[];
    incidents: Incident[];
    auditLogs: AuditLogEntry[];
    externalSchools: DirectorySchool[];
  };
  selection: {
    selectedStudent: Student | null;
    selectedVisit: VisitLog | null;
    selectedTeacher: Teacher | null;
    medicationToAdminister: {student: Student, prescription: Prescription} | null;
  };
  handlers: {
    handleStudentSelect: (s: Student) => void;
    handleVisitSelect: (v: VisitLog) => void;
    handleTeacherSelect: (t: Teacher) => void;
    handleGradeSelect: (g: string) => void;
    handleAddVisit: (v: VisitLog) => void;
    handleUpdateVisit: (v: VisitLog) => void;
    handleAddIncident: (i: Incident) => void;
    handleUpdateIncident: (i: Incident) => void;
    handleAddImmunization: (r: ImmunizationRecord) => void;
    handleAdministerMedication: (rx: Prescription, s?: Student) => void;
    handleAddMedication: (med: Medication) => void;
    handleUpdateStudent: (s: Student) => void;
    setView: (v: ViewState) => void;
    setMedicationToAdminister: (val: any) => void;
    setSelectedVisit: (v: VisitLog) => void;
  }
}

export const ViewSwitch: React.FC<ViewSwitchProps> = ({ view, data, selection, handlers }) => {
  const { students, visits, medications, school, district, county, state, teachers, incidents, auditLogs, externalSchools } = data;
  const { selectedStudent, selectedVisit, selectedTeacher, medicationToAdminister } = selection;
  
  switch (view) {
    case ViewState.DASHBOARD:
      return (
        <Dashboard 
            visits={visits} 
            students={students}
            school={school}
            medications={medications}
            incidents={incidents}
            onNavigate={handlers.setView}
        />
      );
    case ViewState.STUDENTS:
      return <StudentList students={students} onSelectStudent={handlers.handleStudentSelect} />;
    case ViewState.STUDENT_PROFILE:
      return selectedStudent ? (
        <StudentProfile 
          student={selectedStudent} 
          history={visits.filter(v => v.studentId === selectedStudent.id)}
          teachers={teachers}
          onBack={() => handlers.setView(ViewState.STUDENTS)}
          onAddVisit={handlers.handleAddVisit}
          onAddImmunizationRequest={() => handlers.setView(ViewState.ADD_IMMUNIZATION)}
          onAdministerMedicationRequest={handlers.handleAdministerMedication}
          onUpdateStudent={handlers.handleUpdateStudent}
          onVisitSelect={handlers.handleVisitSelect}
          onTeacherClick={handlers.handleTeacherSelect}
        />
      ) : null;
    case ViewState.ADD_IMMUNIZATION:
      return selectedStudent ? (
        <SmartImmunizationModal
          isOpen={true}
          onClose={() => handlers.setView(ViewState.STUDENT_PROFILE)}
          onSave={handlers.handleAddImmunization}
          studentId={selectedStudent.id}
        />
      ) : null;
    case ViewState.VISITS:
      return (
        <VisitManager 
          visits={visits}
          students={students}
          onAddVisit={() => handlers.setView(ViewState.NEW_VISIT)}
          onUpdateVisit={() => {}}
          onViewVisitDetail={handlers.handleVisitSelect}
          preSelectedStudent={selectedStudent}
        />
      );
    case ViewState.NEW_VISIT:
      return (
        <NewVisitPage 
          onCancel={() => handlers.setView(ViewState.VISITS)}
          onSave={handlers.handleAddVisit}
          students={students}
          initialStudentId={selectedStudent?.id}
        />
      );
    case ViewState.EDIT_VISIT:
      return selectedVisit ? (
        <EditVisitPage 
          onCancel={() => handlers.setView(ViewState.VISIT_DETAIL)}
          onSave={handlers.handleUpdateVisit}
          visit={selectedVisit}
        />
      ) : null;
    case ViewState.VISIT_DETAIL:
      return selectedVisit ? (
        <VisitDetail 
            visit={selectedVisit}
            student={students.find(s => s.id === selectedVisit.studentId) || students[0]}
            onBack={() => handlers.setView(ViewState.VISITS)}
            onSelectStudent={handlers.handleStudentSelect}
            onUpdateVisit={(visit) => {
                handlers.setSelectedVisit(visit);
                handlers.setView(ViewState.EDIT_VISIT);
            }}
        />
      ) : null;
    case ViewState.MEDICATIONS:
      return (
        <Pharmacy 
          medications={medications} 
          students={students}
          onAdminister={(sid, rx) => {
              const s = students.find(st => st.id === sid);
              if(s) handlers.handleAdministerMedication(rx, s);
          }}
          onAddMedication={handlers.handleAddMedication}
        />
      );
    case ViewState.ADMINISTER_MEDICATION:
      return medicationToAdminister ? (
        <AdministerMedicationPage 
          student={medicationToAdminister.student}
          prescription={medicationToAdminister.prescription}
          onCancel={() => {
              if (selectedStudent && selectedStudent.id === medicationToAdminister.student.id) {
                  handlers.setView(ViewState.STUDENT_PROFILE);
              } else {
                  handlers.setView(ViewState.MEDICATIONS);
              }
              handlers.setMedicationToAdminister(null);
          }}
          onSave={handlers.handleAddVisit}
        />
      ) : null;
    case ViewState.INCIDENTS:
      return (
        <IncidentManager 
          incidents={incidents}
          students={students}
          onAddIncident={() => handlers.setView(ViewState.NEW_INCIDENT)}
          onUpdateIncident={handlers.handleUpdateIncident}
        />
      );
    case ViewState.NEW_INCIDENT:
      return (
        <div className="h-full border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <IncidentForm 
              students={students}
              onSave={handlers.handleAddIncident}
              onCancel={() => handlers.setView(ViewState.INCIDENTS)}
          />
        </div>
      );
    case ViewState.COMMUNICATION:
      return <CommunicationHub directory={externalSchools} />;
    case ViewState.AI_ASSISTANT:
      return <AIAssistant />;
    case ViewState.SCHOOL_PROFILE:
      return school ? <AdministrativeDashboard level="SCHOOL" data={school} /> : null;
    case ViewState.DISTRICT_PROFILE:
      return district ? <AdministrativeDashboard level="DISTRICT" data={district} /> : null;
    case ViewState.COUNTY_PROFILE:
      return county ? <AdministrativeDashboard level="COUNTY" data={county} /> : null;
    case ViewState.STATE_PROFILE:
      return state ? <AdministrativeDashboard level="STATE" data={state} /> : null;
    case ViewState.GRADE_LIST:
      return <GradeList students={students} onSelectGrade={handlers.handleGradeSelect} />;
    case ViewState.TEACHERS:
      return <StaffDirectory teachers={teachers} onSelectTeacher={handlers.handleTeacherSelect} />;
    case ViewState.TEACHER_PROFILE:
      return selectedTeacher ? (
        <TeacherProfile 
            teacher={selectedTeacher}
            students={students.filter(s => s.teacherId === selectedTeacher.id)}
            onBack={() => handlers.setView(ViewState.TEACHERS)}
            onSelectStudent={handlers.handleStudentSelect}
        />
      ) : null;
    case ViewState.REPORTS:
      return school ? <StateReporting school={school} /> : null;
    case ViewState.REPORT_VACCINE:
      return <VaccineStatusReport students={students} onSelectStudent={handlers.handleStudentSelect} />;
    case ViewState.REPORT_SCREENING:
      return <ScreeningReport students={students} onSelectStudent={handlers.handleStudentSelect} />;
    case ViewState.SECURITY_AUDIT:
      return <SecurityAudit logs={auditLogs} />;
    default:
      return null;
  }
};
