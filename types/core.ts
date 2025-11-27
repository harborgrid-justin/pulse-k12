
import { Allergy, CarePlan, Prescription, Screening, ImmunizationRecord, CommunicationLog } from './clinical';

export interface Contact {
  name: string;
  relation: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
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

export interface DirectorySchool {
  id: string;
  name: string;
  address: string;
  phone: string;
  principal: string;
  email: string;
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
  prescriptions: Prescription[]; 
  carePlans: CarePlan[];
  screenings: Screening[];
  
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
  communicationLogs?: CommunicationLog[];
}
