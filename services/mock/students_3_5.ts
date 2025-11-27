
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
        height: grade === '3' ? "4'4\"" : grade === '4' ? "4'8\"" : "4'11\"",
        weight: grade === '3' ? "65 lbs" : grade === '4' ? "75 lbs" : "88 lbs",
        parentContact: `${generateName().first} ${name.last}`,
        parentPhone: `(678) 555-${Math.floor(1000 + Math.random() * 9000)}`,
        emergencyContacts: [{ name: `${generateName().first} ${name.last}`, relation: 'Parent', phone: `(678) 555-${Math.floor(1000 + Math.random() * 9000)}`, isPrimary: true }],
        parentPortalAccess: Math.random() > 0.5,
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
const G3_TEACHERS = MOCK_TEACHERS.filter(t => t.grade === '3');
const G4_TEACHERS = MOCK_TEACHERS.filter(t => t.grade === '4');
const G5_TEACHERS = MOCK_TEACHERS.filter(t => t.grade === '5');

// Generate ~120 3rd Graders
G3_TEACHERS.forEach((teacher, tIdx) => {
    for(let i=0; i<20; i++) {
        students.push(createStudent(`s_3_${tIdx}_${i}`, teacher.id, '3'));
    }
});

// Generate ~100 4th Graders
G4_TEACHERS.forEach((teacher, tIdx) => {
    for(let i=0; i<20; i++) {
        students.push(createStudent(`s_4_${tIdx}_${i}`, teacher.id, '4'));
    }
});

// Generate ~100 5th Graders
G5_TEACHERS.forEach((teacher, tIdx) => {
    for(let i=0; i<20; i++) {
        students.push(createStudent(`s_5_${tIdx}_${i}`, teacher.id, '5'));
    }
});

export const MOCK_STUDENTS_3_5 = students;
