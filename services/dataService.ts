
import { Student, VisitLog, Medication, School, District, Teacher, Incident, AuditLogEntry, DirectorySchool, County, State } from '../types';
import { 
    MOCK_TEACHERS, 
    MOCK_STUDENTS, 
    MOCK_VISITS, 
    MOCK_MEDS, 
    MOCK_SCHOOL, 
    MOCK_DISTRICT, 
    MOCK_INCIDENTS, 
    MOCK_AUDIT,
    MOCK_EXTERNAL_SCHOOLS,
    MOCK_COUNTY,
    MOCK_STATE
} from './mockData';

// Service Layer
export const DataService = {
  getStudents: async (): Promise<Student[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_STUDENTS]), 300));
  },

  getTeachers: async (): Promise<Teacher[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_TEACHERS]), 300));
  },

  getTeacherById: (id: string) => MOCK_TEACHERS.find(t => t.id === id),

  getVisits: async (): Promise<VisitLog[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_VISITS]), 300));
  },

  getMedications: async (): Promise<Medication[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_MEDS]), 300));
  },

  addVisit: async (visit: VisitLog): Promise<VisitLog> => {
    MOCK_VISITS.unshift(visit);
    return visit;
  },

  updateVisit: async (updatedVisit: VisitLog): Promise<VisitLog> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = MOCK_VISITS.findIndex(v => v.id === updatedVisit.id);
    if (index !== -1) {
      MOCK_VISITS[index] = updatedVisit;
      
      // Add Audit Entry
      MOCK_AUDIT.unshift({
        id: `al_edit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'Nurse Joy',
        role: 'Head Nurse',
        action: 'EDIT',
        resource: `Visit Log: ${updatedVisit.id}`,
        details: 'Updated clinical details (Symptoms/Treatment/Outcome)'
      });
    }
    return updatedVisit;
  },

  getStudentById: (id: string) => MOCK_STUDENTS.find(s => s.id === id),
  
  updateStudent: async (student: Student): Promise<Student> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = MOCK_STUDENTS.findIndex(s => s.id === student.id);
      if (index !== -1) {
          MOCK_STUDENTS[index] = student;
      }
      return student;
  },

  getSchoolProfile: async (): Promise<School> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_SCHOOL), 300));
  },

  getDistrictProfile: async (): Promise<District> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_DISTRICT), 300));
  },

  getCountyProfile: async (): Promise<County> => {
      return new Promise(resolve => setTimeout(() => resolve(MOCK_COUNTY), 300));
  },

  getStateProfile: async (): Promise<State> => {
      return new Promise(resolve => setTimeout(() => resolve(MOCK_STATE), 300));
  },

  getIncidents: async (): Promise<Incident[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...MOCK_INCIDENTS]), 300));
  },

  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...MOCK_AUDIT]), 300));
  },
  
  addIncident: async (incident: Incident): Promise<Incident> => {
      MOCK_INCIDENTS.unshift(incident);
      return incident;
  },

  updateIncident: async (incident: Incident): Promise<Incident> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = MOCK_INCIDENTS.findIndex(i => i.id === incident.id);
      if (index !== -1) {
          MOCK_INCIDENTS[index] = incident;
      }
      return incident;
  },

  getExternalSchools: async (): Promise<DirectorySchool[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...MOCK_EXTERNAL_SCHOOLS]), 300));
  }
};
