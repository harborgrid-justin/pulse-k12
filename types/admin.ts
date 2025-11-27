
export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'NURSE' | 'PARENT' | 'TEACHER' | 'ADMIN';
  content: string;
  timestamp: string;
  readBy: string[];
}

export interface MessageThread {
  id: string;
  studentId: string;
  studentName: string;
  participants: string[];
  subject: string;
  lastMessage: Message;
  unreadCount: number;
  tags: ('URGENT' | 'MEDICATION' | 'GENERAL')[];
}

export interface PermissionForm {
  id: string;
  title: string;
  studentId: string;
  type: 'MEDICATION_AUTH' | 'FIELD_TRIP' | 'TREATMENT_CONSENT';
  status: 'PENDING' | 'SIGNED' | 'EXPIRED';
  dateSent: string;
  dateSigned?: string;
  expiryDate: string;
  signedBy?: string;
  signatureUrl?: string;
}

export interface NoticeTemplate {
  id: string;
  title: string;
  category: 'OUTBREAK' | 'REMINDER' | 'POLICY';
  content: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: 'VIEW' | 'EDIT' | 'CREATE' | 'DELETE' | 'EXPORT';
  resource: string;
  details: string;
}

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

export interface Budget {
    allocated: number;
    spent: number;
    currency: string;
    fiscalYear: string;
}

export interface BaseEntity {
    id: string;
    name: string;
    headOfAdmin: string; // Principal, Superintendent, Director, Governor
    contactPhone: string;
    totalPopulation: number; // Students or Constituents
    complianceRate: number;
    budget: Budget;
}

export interface School extends BaseEntity {
  address: string;
  principal: string; // Alias for headOfAdmin
  nurseName: string;
  totalStudents: number; // Alias for totalPopulation
  staffCredentials: StaffCredential[];
  resources: SchoolResource[];
  integrations: SystemIntegration[];
  phone: string; // Alias
}

export interface District extends BaseEntity {
  superintendent: string; // Alias
  totalSchools: number;
  totalStudents: number; // Alias
  districtWideAlerts: string[];
}

export interface County extends BaseEntity {
    director: string;
    totalDistricts: number;
    healthDepartmentContact: string;
    epidemiologyAlerts: string[];
}

export interface State extends BaseEntity {
    governor: string;
    totalCounties: number;
    departmentOfHealthContact: string;
    legislativeUpdates: string[];
}
