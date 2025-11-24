
import { Student, VisitLog, Medication, Urgency, School, District, Teacher } from '../types';

// Mock Teachers (Based on West Newton Elementary Faculty Structure)
const MOCK_TEACHERS: Teacher[] = [
  // Administration / Support (Simulated classroom for demo purposes)
  { id: 't_pk1', firstName: 'Sarah', lastName: 'Henson', email: 'henson.s@newton.k12.ga.us', grade: 'PK', room: 'A101', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 't_k1', firstName: 'Amanda', lastName: 'Grier', email: 'grier.a@newton.k12.ga.us', grade: 'K', room: 'A105', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda' },
  { id: 't_k2', firstName: 'Latoya', lastName: 'Jackson', email: 'jackson.l@newton.k12.ga.us', grade: 'K', room: 'A106', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Latoya' },
  { id: 't_1st1', firstName: 'Jessica', lastName: 'Malcom', email: 'malcom.j@newton.k12.ga.us', grade: '1', room: 'B110', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
  { id: 't_1st2', firstName: 'Brittany', lastName: 'Webb', email: 'webb.b@newton.k12.ga.us', grade: '1', room: 'B112', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brittany' },
  { id: 't_2nd1', firstName: 'Michael', lastName: 'Ross', email: 'ross.m@newton.k12.ga.us', grade: '2', room: 'C120', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: 't_2nd2', firstName: 'Ashley', lastName: 'Simmons', email: 'simmons.a@newton.k12.ga.us', grade: '2', room: 'C122', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashley' },
  { id: 't_3rd1', firstName: 'Christopher', lastName: 'Evans', email: 'evans.c@newton.k12.ga.us', grade: '3', room: 'D130', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
  { id: 't_3rd2', firstName: 'Emily', lastName: 'Clark', email: 'clark.e@newton.k12.ga.us', grade: '3', room: 'D132', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
  { id: 't_4th1', firstName: 'David', lastName: 'Wright', email: 'wright.d@newton.k12.ga.us', grade: '4', room: 'E140', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 't_4th2', firstName: 'Linda', lastName: 'Thomas', email: 'thomas.l@newton.k12.ga.us', grade: '4', room: 'E142', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda' },
  { id: 't_5th1', firstName: 'Robert', lastName: 'Johnson', email: 'johnson.r@newton.k12.ga.us', grade: '5', room: 'F150', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
  { id: 't_art', firstName: 'Karen', lastName: 'Brooks', email: 'brooks.k@newton.k12.ga.us', grade: 'Art', room: 'Art Room', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karen' },
  { id: 't_pe', firstName: 'Coach', lastName: 'Sanders', email: 'sanders.c@newton.k12.ga.us', grade: 'PE', room: 'Gym', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coach' },
];

// Mock Students (Linked to Teachers)
const MOCK_STUDENTS: Student[] = [
  // PK
  {
    id: 's_pk1', teacherId: 't_pk1', firstName: 'Aiden', lastName: 'Barnes', grade: 'PK', dob: '2019-05-12', gender: 'Male',
    allergies: [{ name: 'Peanuts', severity: 'SEVERE', reaction: 'Anaphylaxis', actionPlan: 'EpiPen' }],
    conditions: ['Eczema'], parentContact: 'Mary Barnes', parentPhone: '(678) 555-0101',
    emergencyContacts: [{ name: 'Mary Barnes', relation: 'Mother', phone: '(678) 555-0101', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden', bloodType: 'A+', height: "3'5\"", weight: '35 lbs',
    parentPortalAccess: true, immunizations: [], lastScreening: '2024-08-10'
  },
  {
    id: 's_pk2', teacherId: 't_pk1', firstName: 'Zoe', lastName: 'Fisher', grade: 'PK', dob: '2019-08-22', gender: 'Female',
    allergies: [], conditions: [], parentContact: 'Tom Fisher', parentPhone: '(678) 555-0102',
    emergencyContacts: [{ name: 'Tom Fisher', relation: 'Father', phone: '(678) 555-0102', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe', parentPortalAccess: false
  },
  
  // Kindergarten - Grier
  {
    id: 's_k1', teacherId: 't_k1', firstName: 'Caleb', lastName: 'Wilson', grade: 'K', dob: '2018-03-15', gender: 'Male',
    allergies: [], conditions: ['Asthma'], parentContact: 'Sarah Wilson', parentPhone: '(678) 555-0103',
    emergencyContacts: [{ name: 'Sarah Wilson', relation: 'Mother', phone: '(678) 555-0103', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb', bloodType: 'O-', height: "3'8\"", weight: '42 lbs',
    parentPortalAccess: true,
    immunizations: [{ id: 'im1', name: 'MMR', date: '2023-01-15', doseNumber: 2, totalDoses: 2, compliant: true, status: 'COMPLIANT' }]
  },
  {
    id: 's_k2', teacherId: 't_k1', firstName: 'Mia', lastName: 'Rodriguez', grade: 'K', dob: '2018-06-30', gender: 'Female',
    allergies: [{ name: 'Penicillin', severity: 'MODERATE', reaction: 'Hives', actionPlan: 'Antihistamine' }],
    conditions: [], parentContact: 'Juan Rodriguez', parentPhone: '(678) 555-0104',
    emergencyContacts: [{ name: 'Juan Rodriguez', relation: 'Father', phone: '(678) 555-0104', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia', parentPortalAccess: true
  },

  // Kindergarten - Jackson
  {
    id: 's_k3', teacherId: 't_k2', firstName: 'Jayden', lastName: 'Smith', grade: 'K', dob: '2018-01-10', gender: 'Male',
    allergies: [], conditions: [], parentContact: 'Lisa Smith', parentPhone: '(678) 555-0105',
    emergencyContacts: [{ name: 'Lisa Smith', relation: 'Mother', phone: '(678) 555-0105', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jayden', parentPortalAccess: false
  },

  // 1st Grade - Malcom
  {
    id: 's_1st1', teacherId: 't_1st1', firstName: 'Lily', lastName: 'Chen', grade: '1', dob: '2017-05-05', gender: 'Female',
    allergies: [{ name: 'Bee Stings', severity: 'SEVERE', reaction: 'Anaphylaxis', actionPlan: 'EpiPen' }],
    conditions: [], parentContact: 'Wei Chen', parentPhone: '(678) 555-0106',
    emergencyContacts: [{ name: 'Wei Chen', relation: 'Father', phone: '(678) 555-0106', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily', parentPortalAccess: true
  },
  {
    id: 's_1st2', teacherId: 't_1st1', firstName: 'Ethan', lastName: 'Hunt', grade: '1', dob: '2017-09-12', gender: 'Male',
    allergies: [], conditions: ['ADHD'], parentContact: 'Julia Hunt', parentPhone: '(678) 555-0107',
    emergencyContacts: [{ name: 'Julia Hunt', relation: 'Mother', phone: '(678) 555-0107', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan', parentPortalAccess: true
  },

  // 1st Grade - Webb
  {
    id: 's_1st3', teacherId: 't_1st2', firstName: 'Ava', lastName: 'Patel', grade: '1', dob: '2017-02-28', gender: 'Female',
    allergies: [], conditions: [], parentContact: 'Raj Patel', parentPhone: '(678) 555-0108',
    emergencyContacts: [{ name: 'Raj Patel', relation: 'Father', phone: '(678) 555-0108', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava', parentPortalAccess: false,
    immunizations: [{ id: 'im_flu', name: 'Flu Shot', date: '2023-10-01', doseNumber: 1, totalDoses: 1, compliant: false, status: 'OVERDUE' }]
  },

  // 2nd Grade - Ross
  {
    id: 's_2nd1', teacherId: 't_2nd1', firstName: 'Mason', lastName: 'Brooks', grade: '2', dob: '2016-11-15', gender: 'Male',
    allergies: [{ name: 'Dairy', severity: 'MILD', reaction: 'Stomach Upset', actionPlan: 'Monitor' }],
    conditions: [], parentContact: 'Angela Brooks', parentPhone: '(678) 555-0109',
    emergencyContacts: [{ name: 'Angela Brooks', relation: 'Mother', phone: '(678) 555-0109', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason', parentPortalAccess: true
  },

  // 2nd Grade - Simmons
  {
    id: 's_2nd2', teacherId: 't_2nd2', firstName: 'Sophia', lastName: 'Murphy', grade: '2', dob: '2016-04-22', gender: 'Female',
    allergies: [], conditions: ['Type 1 Diabetes'], parentContact: 'Kevin Murphy', parentPhone: '(678) 555-0110',
    emergencyContacts: [{ name: 'Kevin Murphy', relation: 'Father', phone: '(678) 555-0110', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', parentPortalAccess: true,
    lastScreening: '2024-09-15'
  },

  // 3rd Grade - Evans
  {
    id: 's_3rd1', teacherId: 't_3rd1', firstName: 'Lucas', lastName: 'Gray', grade: '3', dob: '2015-08-08', gender: 'Male',
    allergies: [], conditions: [], parentContact: 'Tina Gray', parentPhone: '(678) 555-0111',
    emergencyContacts: [{ name: 'Tina Gray', relation: 'Mother', phone: '(678) 555-0111', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', parentPortalAccess: true
  },
  
  // 3rd Grade - Clark
  {
    id: 's_3rd2', teacherId: 't_3rd2', firstName: 'Isabella', lastName: 'Price', grade: '3', dob: '2015-12-01', gender: 'Female',
    allergies: [{ name: 'Shellfish', severity: 'SEVERE', reaction: 'Swelling', actionPlan: 'EpiPen' }],
    conditions: [], parentContact: 'Brian Price', parentPhone: '(678) 555-0112',
    emergencyContacts: [{ name: 'Brian Price', relation: 'Father', phone: '(678) 555-0112', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella', parentPortalAccess: true
  },

  // 4th Grade - Wright
  {
    id: 's_4th1', teacherId: 't_4th1', firstName: 'Oliver', lastName: 'Long', grade: '4', dob: '2014-03-30', gender: 'Male',
    allergies: [], conditions: [], parentContact: 'Nancy Long', parentPhone: '(678) 555-0113',
    emergencyContacts: [{ name: 'Nancy Long', relation: 'Mother', phone: '(678) 555-0113', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver', parentPortalAccess: true
  },

  // 4th Grade - Thomas
  {
    id: 's_4th2', teacherId: 't_4th2', firstName: 'Charlotte', lastName: 'Bell', grade: '4', dob: '2014-07-19', gender: 'Female',
    allergies: [{ name: 'Latex', severity: 'MODERATE', reaction: 'Rash', actionPlan: 'Avoid contact' }],
    conditions: ['Asthma'], parentContact: 'Steven Bell', parentPhone: '(678) 555-0114',
    emergencyContacts: [{ name: 'Steven Bell', relation: 'Father', phone: '(678) 555-0114', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte', parentPortalAccess: true
  },

  // 5th Grade - Johnson
  {
    id: 's_5th1', teacherId: 't_5th1', firstName: 'Elijah', lastName: 'Ward', grade: '5', dob: '2013-05-25', gender: 'Male',
    allergies: [], conditions: [], parentContact: 'Karen Ward', parentPhone: '(678) 555-0115',
    emergencyContacts: [{ name: 'Karen Ward', relation: 'Mother', phone: '(678) 555-0115', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elijah', parentPortalAccess: true
  },
  {
    id: 's_5th2', teacherId: 't_5th1', firstName: 'Amelia', lastName: 'Foster', grade: '5', dob: '2013-10-10', gender: 'Female',
    allergies: [], conditions: ['Migraines'], parentContact: 'Paul Foster', parentPhone: '(678) 555-0116',
    emergencyContacts: [{ name: 'Paul Foster', relation: 'Father', phone: '(678) 555-0116', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia', parentPortalAccess: true,
    immunizations: [{ id: 'im_tdap', name: 'Tdap', date: '2024-05-01', doseNumber: 1, totalDoses: 1, compliant: true, status: 'COMPLIANT' }]
  },
  {
    id: 's_5th3', teacherId: 't_5th1', firstName: 'Henry', lastName: 'Butler', grade: '5', dob: '2013-02-14', gender: 'Male',
    allergies: [{ name: 'Tree Nuts', severity: 'SEVERE', reaction: 'Anaphylaxis', actionPlan: 'EpiPen' }],
    conditions: [], parentContact: 'Susan Butler', parentPhone: '(678) 555-0117',
    emergencyContacts: [{ name: 'Susan Butler', relation: 'Mother', phone: '(678) 555-0117', isPrimary: true }],
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry', parentPortalAccess: true
  }
];

const MOCK_VISITS: VisitLog[] = [
  {
    id: 'v1',
    studentId: 's_k1', // Caleb Wilson (Asthma)
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    symptoms: 'Wheezing after running in PE',
    treatment: 'Albuterol Inhaler (2 puffs)',
    outcome: 'Returned to class',
    urgency: Urgency.MEDIUM,
    notes: 'Observed for 15 mins. Breathing returned to normal.',
    durationMinutes: 20
  },
  {
    id: 'v2',
    studentId: 's_2nd2', // Sophia Murphy (Diabetes)
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    symptoms: 'Hypoglycemia (Blood Sugar 65)',
    treatment: 'Given 15g Fast Acting Carbs (Juice)',
    outcome: 'Stabilized',
    urgency: Urgency.HIGH,
    notes: 'Retested after 15 mins: 98 mg/dL. Returned to class.',
    durationMinutes: 25
  },
  {
    id: 'v3',
    studentId: 's_pk1', // Aiden Barnes (Eczema)
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    symptoms: 'Itchy patch on arm',
    treatment: 'Applied hydrocortisone cream',
    outcome: 'Returned to class',
    urgency: Urgency.LOW,
    notes: 'Student scratched until bleeding slightly. Covered with bandaid.',
    durationMinutes: 10
  },
  {
    id: 'v4',
    studentId: 's_5th3', // Henry Butler
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    symptoms: 'Headache and nausea',
    treatment: 'Rest in quiet room, water',
    outcome: 'Sent home',
    urgency: Urgency.MEDIUM,
    notes: 'Called mother (Susan). Picked up at 11:30 AM.',
    durationMinutes: 45
  },
  {
    id: 'v5',
    studentId: 's_1st1', // Lily Chen
    timestamp: new Date().toISOString(), // Just now
    symptoms: 'Paper cut on finger',
    treatment: 'Cleaned with soap/water, bandaid',
    outcome: 'Returned to class',
    urgency: Urgency.LOW,
    notes: 'Minor cut.',
    durationMinutes: 5
  }
];

const MOCK_MEDS: Medication[] = [
  { id: 'm1', name: 'Acetaminophen (Children\'s)', stock: 5, unit: 'Bottles', expiryDate: '2025-12-31' },
  { id: 'm2', name: 'Ibuprofen (200mg)', stock: 200, unit: 'Tablets', expiryDate: '2026-06-15' },
  { id: 'm3', name: 'EpiPen Jr', stock: 4, unit: 'Injectors', expiryDate: '2024-11-01' },
  { id: 'm4', name: 'Albuterol Inhaler', stock: 6, unit: 'Canisters', expiryDate: '2025-03-20' },
  { id: 'm5', name: 'Benadryl (Liquid)', stock: 3, unit: 'Bottles', expiryDate: '2025-08-01' },
  { id: 'm6', name: 'Instant Ice Packs', stock: 45, unit: 'Packs', expiryDate: '2030-01-01' },
];

const MOCK_SCHOOL: School = {
  id: 'sch_wnes',
  name: 'West Newton Elementary School',
  address: '13387 Brown Bridge Road, Covington, GA 30016',
  principal: 'Dr. Samone Norsworthy',
  nurseName: 'Nurse Joy',
  phone: '(770) 385-6472',
  totalStudents: 750,
  complianceRate: 94.5,
  budget: {
    allocated: 25000,
    spent: 12350,
    currency: 'USD',
    fiscalYear: '2024-2025'
  },
  staffCredentials: [
    { id: 'cr1', name: 'Nurse Joy', role: 'Head Nurse', licenseNumber: 'RN-GA-123456', expiryDate: '2025-08-30', status: 'ACTIVE' },
    { id: 'cr2', name: 'Dr. Norsworthy', role: 'Administrator', licenseNumber: 'GA-EDU-998877', expiryDate: '2026-06-30', status: 'ACTIVE' }
  ],
  resources: [
    { id: 'res1', name: 'AED (Main Office)', type: 'EMERGENCY', location: 'Front Lobby', status: 'AVAILABLE', nextMaintenance: '2025-01-15' },
    { id: 'res2', name: 'AED (Gym)', type: 'EMERGENCY', location: 'Gymnasium Wall', status: 'AVAILABLE', nextMaintenance: '2025-02-20' },
    { id: 'res3', name: 'Wheelchair', type: 'DEVICE', location: 'Clinic', status: 'AVAILABLE', nextMaintenance: '2024-12-30' },
    { id: 'res4', name: 'Isolation Cot', type: 'FACILITY', location: 'Clinic Room B', status: 'AVAILABLE', nextMaintenance: '2025-06-01' },
  ],
  integrations: [
    { name: 'GRITS (GA Immunization)', status: 'ONLINE', lastSync: '10 mins ago', latencyMs: 65 },
    { name: 'Infinite Campus (SIS)', status: 'ONLINE', lastSync: '2 mins ago', latencyMs: 110 },
    { name: 'AthenaHealth', status: 'DEGRADED', lastSync: '1 hour ago', latencyMs: 800 },
  ]
};

const MOCK_DISTRICT: District = {
  id: 'dist_newton',
  name: 'Newton County School System',
  superintendent: 'Dr. Duke Bradley III',
  totalSchools: 23,
  totalStudents: 19000,
  districtWideAlerts: ['Flu Season Advisory', 'Updated Immunization Requirements for 7th & 11th Grade']
};

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

  getStudentById: (id: string) => MOCK_STUDENTS.find(s => s.id === id),
  
  getSchoolProfile: async (): Promise<School> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_SCHOOL), 300));
  },

  getDistrictProfile: async (): Promise<District> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_DISTRICT), 300));
  }
};
    