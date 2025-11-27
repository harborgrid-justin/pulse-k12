
import { School, District, AuditLogEntry } from '../types';

export const MOCK_SCHOOL: School = {
  id: 'sch_wnes',
  name: 'West Newton Elementary School',
  address: '13387 Brown Bridge Road, Covington, GA 30016',
  headOfAdmin: 'Dr. Samone Norsworthy',
  principal: 'Dr. Samone Norsworthy',
  nurseName: 'Nurse Joy',
  phone: '(770) 385-6472',
  contactPhone: '(770) 385-6472',
  totalStudents: 750,
  totalPopulation: 750,
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

export const MOCK_DISTRICT: District = {
  id: 'dist_newton',
  name: 'Newton County School System',
  headOfAdmin: 'Dr. Duke Bradley III',
  superintendent: 'Dr. Duke Bradley III',
  contactPhone: '(770) 787-1330',
  totalSchools: 23,
  totalStudents: 19000,
  totalPopulation: 19000,
  complianceRate: 92.4,
  budget: {
      allocated: 1500000,
      spent: 950000,
      currency: 'USD',
      fiscalYear: '2024-2025'
  },
  districtWideAlerts: ['Flu Season Advisory', 'Updated Immunization Requirements for 7th & 11th Grade']
};

export const MOCK_AUDIT: AuditLogEntry[] = [
    { id: 'al1', timestamp: new Date(Date.now() - 1000 * 60).toISOString(), user: 'Nurse Joy', role: 'Head Nurse', action: 'VIEW', resource: 'Student: Caleb Wilson', details: 'Viewed Profile' },
    { id: 'al2', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), user: 'Nurse Joy', role: 'Head Nurse', action: 'CREATE', resource: 'Visit Log: v123', details: 'Added new visit log' },
    { id: 'al3', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), user: 'Dr. Norsworthy', role: 'Admin', action: 'EXPORT', resource: 'Compliance Report', details: 'Downloaded PDF' },
];

export { MOCK_COUNTY } from './mock/mockCounty';
export { MOCK_STATE } from './mock/mockState';
