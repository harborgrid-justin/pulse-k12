
import { VisitLog, Medication, Incident, Urgency, FollowUpStatus } from '../types';

export const MOCK_VISITS: VisitLog[] = [
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

export const MOCK_MEDS: Medication[] = [
  { id: 'm1', name: 'Acetaminophen (Children\'s)', stock: 5, unit: 'Bottles', expiryDate: '2025-12-31' },
  { id: 'm2', name: 'Ibuprofen (200mg)', stock: 200, unit: 'Tablets', expiryDate: '2026-06-15' },
  { id: 'm3', name: 'EpiPen Jr', stock: 4, unit: 'Injectors', expiryDate: '2024-11-01' },
  { id: 'm4', name: 'Albuterol Inhaler', stock: 6, unit: 'Canisters', expiryDate: '2025-03-20' },
  { id: 'm5', name: 'Benadryl (Liquid)', stock: 3, unit: 'Bottles', expiryDate: '2025-08-01' },
  { id: 'm6', name: 'Instant Ice Packs', stock: 45, unit: 'Packs', expiryDate: '2030-01-01' },
];

export const MOCK_INCIDENTS: Incident[] = [
    { 
      id: 'inc1', 
      studentId: 's_5th1', 
      date: '2024-09-10', 
      time: '10:30', 
      location: 'PLAYGROUND', 
      activity: 'Recess', 
      type: 'INJURY', 
      severity: 'MODERATE', 
      description: 'Fell from swing', 
      bodyParts: ['Right Arm'], 
      treatmentProvided: 'Ice, Sling, Parent Called', 
      parentNotified: true, 
      status: 'CLOSED',
      followUpRequired: false,
      followUpStatus: FollowUpStatus.NO_ACTION_NEEDED
    },
    { 
      id: 'inc2', 
      studentId: 's_3rd1', 
      date: '2024-09-12', 
      time: '14:15', 
      location: 'PE', 
      activity: 'Running', 
      type: 'INJURY', 
      severity: 'MINOR', 
      description: 'Tripped running laps', 
      bodyParts: ['Left Knee'], 
      treatmentProvided: 'Bandaid, Ice', 
      parentNotified: false, 
      status: 'OPEN',
      followUpRequired: true,
      followUpStatus: FollowUpStatus.PENDING
    }
];
