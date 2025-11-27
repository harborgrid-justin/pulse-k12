
import { Student } from '../../types';
import { MOCK_TEACHERS } from './staff';
import { generateName, generateDOB, generateMedicalProfile, generateImmunizations, generateScreenings } from './utils';

const createStudent = (id: string, teacherId: string, grade: string): Student => {
    const name = generateName();
    const dob = generateDOB(grade);
    const medical = generateMedicalProfile(id);
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';

    return {
        id,
        teacherId,
        firstName: name.first,
        lastName: name.last,
        grade,
        dob,
        gender,
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
        bloodType: Math.random() > 0.8 ? 'O+' : 'A+',
        height: grade === 'PK' ? "3'4\"" : "3'7\"",
        weight: grade === 'PK' ? "35 lbs" : "42 lbs",
        parentContact: `${generateName().first} ${name.last}`,
        parentPhone: `(678) 555-${Math.floor(1000 + Math.random() * 9000)}`,
        emergencyContacts: [{ name: `${generateName().first} ${name.last}`, relation: 'Parent', phone: `(678) 555-${Math.floor(1000 + Math.random() * 9000)}`, isPrimary: true }],
        parentPortalAccess: Math.random() > 0.3,
        allergies: medical.allergies,
        conditions: medical.conditions,
        prescriptions: medical.prescriptions,
        carePlans: medical.conditions.length > 0 ? [{ id: `cp_${id}`, type: 'IHP', title: 'Care Plan', createdAt: '2024-08-01', reviewDate: '2025-01-01', status: 'ACTIVE', content: 'Standard protocol.' }] : [],
        immunizations: generateImmunizations(grade, dob),
        screenings: generateScreenings(grade),
        communicationLogs: []
    };
};

const students: Student[] = [];
const PK_TEACHERS = MOCK_TEACHERS.filter(t => t.grade === 'PK');
const K_TEACHERS = MOCK_TEACHERS.filter(t => t.grade === 'K');

// Generate ~80 PK Students (20 per teacher)
PK_TEACHERS.forEach((teacher, tIdx) => {
    for(let i=0; i<20; i++) {
        students.push(createStudent(`s_pk_${tIdx}_${i}`, teacher.id, 'PK'));
    }
});

// Generate ~120 K Students (20 per teacher)
K_TEACHERS.forEach((teacher, tIdx) => {
    for(let i=0; i<20; i++) {
        students.push(createStudent(`s_k_${tIdx}_${i}`, teacher.id, 'K'));
    }
});

export const MOCK_STUDENTS_PK_K = students;
