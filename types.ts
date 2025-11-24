
// Domain Entities

export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Contact {
  name: string;
  relation: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface ImmunizationRecord {
  id: string;
  name: string;
  date: string;
  doseNumber: number; // e.g., Dose 1 of 2
  totalDoses: number;
  compliant: boolean;
  nextDueDate?: string;
  status: 'COMPLIANT' | 'OVERDUE' | 'DUE_SOON' | 'EXEMPT';
  manufacturer?: string;
  lotNumber?: string;
  site?: string;
}

export interface Allergy {
  name: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction: string;
  actionPlan: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  room: string;
  photoUrl: string;
}

export interface Student {
  id: string;
  teacherId?: string; // Link to Teacher
  firstName: string;
  lastName: string;
  grade: string;
  dob: string;
  gender: string;
  photoUrl: string;
  
  // Medical Alerts
  allergies: Allergy[];
  conditions: string[];
  
  // Vitals & Bio
  bloodType?: string;
  height?: string; // e.g. "4'10""
  weight?: string; // e.g. "85 lbs"
  
  // Contacts
  parentContact: string; // Primary display contact
  parentPhone: string;   // Primary display phone
  emergencyContacts: Contact[];
  
  // Insurance & Provider
  insurance?: { provider: string; policyNumber: string; groupNumber?: string };
  physician?: { name: string; phone: string; clinic?: string };
  dentist?: { name: string; phone: string };

  // Portal
  parentPortalAccess: boolean;
  lastPortalLogin?: string;

  immunizations?: ImmunizationRecord[];
  lastScreening?: string;
}

export interface VisitLog {
  id: string;
  studentId: string;
  timestamp: string;
  symptoms: string;
  treatment: string;
  outcome: string;
  urgency: Urgency;
  notes: string;
  processedByAI?: boolean;
  durationMinutes?: number;
}

export interface Medication {
  id: string;
  name: string;
  stock: number;
  unit: string;
  expiryDate: string;
}

// Enterprise School Features
export interface StaffCredential {
  id: string;
  name: string;
  role: string;
  licenseNumber: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
}

export interface SchoolResource {
  id: string;
  name: string;
  type: 'DEVICE' | 'FACILITY' | 'EMERGENCY';
  location: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  nextMaintenance: string;
}

export interface SystemIntegration {
  name: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastSync: string;
  latencyMs: number;
}

export interface School {
  id: string;
  name: string;
  address: string;
  principal: string;
  nurseName: string;
  phone: string;
  totalStudents: number;
  complianceRate: number;
  
  // Enterprise Extensions
  budget: {
    allocated: number;
    spent: number;
    currency: string;
    fiscalYear: string;
  };
  staffCredentials: StaffCredential[];
  resources: SchoolResource[];
  integrations: SystemIntegration[];
}

export interface District {
  id: string;
  name: string;
  superintendent: string;
  totalSchools: number;
  totalStudents: number;
  districtWideAlerts: string[];
}

// UI State Types
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  STUDENT_PROFILE = 'STUDENT_PROFILE',
  VISITS = 'VISITS',
  VISIT_DETAIL = 'VISIT_DETAIL',
  MEDICATIONS = 'MEDICATIONS',
  AI_ASSISTANT = 'AI_ASSISTANT',
  
  // Admin & Staff
  SCHOOL_PROFILE = 'SCHOOL_PROFILE',
  DISTRICT_PROFILE = 'DISTRICT_PROFILE',
  TEACHERS = 'TEACHERS',
  TEACHER_PROFILE = 'TEACHER_PROFILE',
  GRADE_LIST = 'GRADE_LIST',
  
  // Reports
  REPORTS = 'REPORTS',
  REPORT_VACCINE = 'REPORT_VACCINE'
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
