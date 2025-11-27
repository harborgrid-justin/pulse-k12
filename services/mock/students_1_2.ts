
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
        height: grade === '1' ? "3'10\"" : "4'1\"",
        weight: grade === '1' ? "48 lbs" : "55 lbs",
        parentContact: `${generateName().first} ${name.last}`,
        parentPhone: `(678) 555-${Math.floor(1000 + Math.random() * 9000)}`,
        emergencyContacts: [{ name: `${generateName().first} ${name.last}`, relation: 'Parent', phone: `(678) 555-${Math.floor(1000 + Math.random() * 9000)}`, isPrimary: true }],
        parentPortalAccess: Math.random() > 0.4,
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
const G1_TEACHERS = MOCK_TEACHERS.filter(t => t.grade === '1');
const G2_TEACHERS = MOCK_TEACHERS.filter(t => t.grade === '2');

// Generate ~120 1st Graders
G1_TEACHERS.forEach((teacher, tIdx) => {
    for(let i=0; i<20; i++) {
        students.push(createStudent(`s_1_${tIdx}_${i}`, teacher.id, '1'));
    }
});

// Generate ~120 2nd Graders
G2_TEACHERS.forEach((teacher, tIdx) => {
    for(let i=0; i<20; i++) {
        students.push(createStudent(`s_2_${tIdx}_${i}`, teacher.id, '2'));
    }
});

export const MOCK_STUDENTS_1_2 = students;
