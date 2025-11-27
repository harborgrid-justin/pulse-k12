
import { Urgency, FollowUpStatus } from './enums';

export interface ImmunizationRecord {
  id: string;
  name: string; // Vaccine Name (e.g. MMR)
  date: string; // Administration Date
  doseNumber: number;
  totalDoses: number;
  
  // Compliance & State Logic
  compliant: boolean;
  status: 'COMPLIANT' | 'OVERDUE' | 'DUE_SOON' | 'EXEMPT' | 'MISSING' | 'PROVISIONAL';
  nextDueDate?: string;
  
  // Exemption Data
  isExempt?: boolean;
  exemptionType?: 'MEDICAL' | 'RELIGIOUS' | 'PERSONAL';
  exemptionExpiry?: string;

  // Detailed Data
  manufacturer?: string;
  lotNumber?: string;
  site?: string;
  cvxCode?: string;

  // Verification & Documents
  verified: boolean;
  verifiedBy?: string;
  documentUrl?: string; // Link to uploaded scan
  uploadedAt?: string;
}

export interface Allergy {
  name: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction: string;
  actionPlan: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  route?: string;
  frequency: 'DAILY' | 'PRN';
  time?: string;
  instructions: string;
  prescriber: string;
  hasAuthorization: boolean;
  storageLocation?: string;
  lastAdministered?: string;
}

export interface MedicationLog {
  id: string;
  studentId: string;
  medicationId: string;
  medicationName: string;
  timestamp: string;
  type: 'SCHEDULED' | 'PRN';
  status: 'GIVEN' | 'MISSED' | 'REFUSED' | 'ABSENT';
  dosage: string;
  administeredBy: string;
  notes?: string;
  inventoryDeducted: boolean;
}

export interface CarePlan {
  id: string;
  type: 'IHP' | 'EAP' | 'IEP_504';
  title: string;
  createdAt: string;
  reviewDate: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  content: string;
}

export interface Screening {
  id: string;
  date: string;
  type: 'VISION' | 'HEARING' | 'SCOLIOSIS' | 'BMI' | 'DENTAL' | 'PHYSICAL';
  result: 'PASS' | 'FAIL' | 'REFERRAL';
  value?: string;
  notes?: string;
}

export interface BodyMarker {
  id: string;
  x: number;
  y: number;
  type: 'BRUISE' | 'CUT' | 'SWELLING' | 'BURN' | 'PAIN' | 'FRACTURE';
  view: 'FRONT' | 'BACK' | 'HEAD_LEFT' | 'HEAD_RIGHT';
  note: string;
}

export interface IncidentFollowUp {
  id: string;
  date: string;
  note: string;
  conductedBy: string;
  outcome: string;
}

export interface Witness {
  name: string;
  role: 'STUDENT' | 'STAFF' | 'OTHER';
  statement?: string;
}

export interface Incident {
  id: string;
  studentId: string;
  date: string;
  time: string;
  location: 'PLAYGROUND' | 'PE' | 'CLASSROOM' | 'BUS' | 'CAFETERIA' | 'SPORTS' | 'HALLWAY' | 'RESTROOM';
  activity: string;
  supervisingStaff?: string;
  witnesses?: Witness[];
  environmentalFactors?: string;
  type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL';
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  description: string;
  bodyParts?: string[];
  bodyMarkers?: BodyMarker[];
  treatmentProvided: string;
  parentNotified: boolean;
  notificationMethod?: 'PHONE' | 'EMAIL' | 'SMS' | 'PORTAL';
  notificationTime?: string;
  parentAcknowledged?: boolean;
  followUpRequired: boolean;
  followUpStatus: FollowUpStatus;
  followUpDate?: string;
  followUpNotes?: string;
  followUps?: IncidentFollowUp[];
  status: 'OPEN' | 'CLOSED' | 'REQUIRES_ADMIN_REVIEW';
}

export interface VitalSigns {
  temperature?: string;
  tempMethod?: 'ORAL' | 'EAR' | 'FOREHEAD';
  heartRate?: string;
  respiratoryRate?: string;
  bloodPressure?: string;
  oxygenSat?: string;
  timeTaken: string;
}

export interface VisitDismissal {
  type: 'RETURN_TO_CLASS' | 'SENT_HOME' | 'PARENT_PICKUP' | 'EMS' | 'REFERRAL';
  authorizedBy?: string;
  timeOut: string;
  notes?: string;
  hallPassIssued?: boolean;
}

export interface VisitLog {
  id: string;
  studentId: string;
  timestamp: string;
  visitReason?: string;
  symptoms: string;
  vitals?: VitalSigns;
  treatment: string;
  interventions?: string[];
  outcome: string;
  dismissal?: VisitDismissal;
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

export interface CommunicationLog {
  id: string;
  type: 'EMAIL' | 'SMS' | 'PHONE' | 'PORTAL';
  direction: 'INBOUND' | 'OUTBOUND';
  timestamp: string;
  subject?: string;
  content: string;
  senderName: string;
}
