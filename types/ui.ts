
import { Urgency } from './enums';

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  STUDENT_PROFILE = 'STUDENT_PROFILE',
  VISITS = 'VISITS',
  VISIT_DETAIL = 'VISIT_DETAIL',
  NEW_VISIT = 'NEW_VISIT',
  EDIT_VISIT = 'EDIT_VISIT',
  MEDICATIONS = 'MEDICATIONS',
  ADMINISTER_MEDICATION = 'ADMINISTER_MEDICATION',
  AI_ASSISTANT = 'AI_ASSISTANT',
  INCIDENTS = 'INCIDENTS',
  NEW_INCIDENT = 'NEW_INCIDENT',
  COMMUNICATION = 'COMMUNICATION',
  
  // Admin & Staff
  SCHOOL_PROFILE = 'SCHOOL_PROFILE',
  DISTRICT_PROFILE = 'DISTRICT_PROFILE',
  COUNTY_PROFILE = 'COUNTY_PROFILE',
  STATE_PROFILE = 'STATE_PROFILE',
  TEACHERS = 'TEACHERS',
  TEACHER_PROFILE = 'TEACHER_PROFILE',
  GRADE_LIST = 'GRADE_LIST',
  SECURITY_AUDIT = 'SECURITY_AUDIT',
  
  // Reports
  REPORTS = 'REPORTS',
  REPORT_VACCINE = 'REPORT_VACCINE',
  REPORT_SCREENING = 'REPORT_SCREENING',
  
  // Forms
  ADD_IMMUNIZATION = 'ADD_IMMUNIZATION'
}

export interface VisitAnalysis {
  symptoms: string;
  treatment: string;
  outcome: string;
  urgency: Urgency;
  formattedNote: string;
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  flaggedUrgency?: Urgency;
}
