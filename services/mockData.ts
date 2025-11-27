
import { Student, VisitLog, Medication, DirectorySchool } from '../types';
import { generateVisits } from './mock/utils';
import { MOCK_TEACHERS } from './mock/staff';
import { MOCK_STUDENTS_PK_K } from './mock/students_pk_k';
import { MOCK_STUDENTS_1_2 } from './mock/students_1_2';
import { MOCK_STUDENTS_3_5 } from './mock/students_3_5';
import { MOCK_SCHOOL, MOCK_DISTRICT, MOCK_AUDIT, MOCK_COUNTY, MOCK_STATE } from './mockAdmin';
import { MOCK_MEDS, MOCK_INCIDENTS } from './mockClinical';

// Combine all student cohorts
export const MOCK_STUDENTS: Student[] = [
    ...MOCK_STUDENTS_PK_K,
    ...MOCK_STUDENTS_1_2,
    ...MOCK_STUDENTS_3_5
];

// Generate Visits based on students
export const MOCK_VISITS: VisitLog[] = MOCK_STUDENTS.flatMap(student => 
    generateVisits(student.id, student.grade, student.conditions.length > 0)
).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const MOCK_EXTERNAL_SCHOOLS: DirectorySchool[] = [
    { id: 'sch_east', name: 'East Newton Elementary', address: '2286 Dixie Rd, Covington, GA', phone: '(770) 784-2973', principal: 'Dr. Kim Coady', email: 'coady.kim@newton.k12.ga.us' },
    { id: 'sch_fair', name: 'Fairview Elementary', address: '3325 Fairview Rd, Covington, GA', phone: '(770) 786-2636', principal: 'Dr. LaMoyne Brunson', email: 'brunson.lamoyne@newton.k12.ga.us' },
    { id: 'sch_flint', name: 'Flint Hill Elementary', address: '1300 Airport Rd, Oxford, GA', phone: '(770) 784-2969', principal: 'Dr. Evans', email: 'evans.k@newton.k12.ga.us' },
    { id: 'sch_heard', name: 'Heard-Mixon Elementary', address: '14110 Hwy 36, Covington, GA', phone: '(770) 784-2980', principal: 'Marquenta Sands', email: 'sands.m@newton.k12.ga.us' },
    { id: 'sch_live', name: 'Live Oak Elementary', address: '500 Hwy 212, Covington, GA', phone: '(678) 625-6654', principal: 'Ericka Anderson', email: 'anderson.e@newton.k12.ga.us' },
    { id: 'sch_liv', name: 'Livingston Elementary', address: '3657 Hwy 81 South, Covington, GA', phone: '(770) 784-2930', principal: 'Patrick Carter', email: 'carter.p@newton.k12.ga.us' },
    { id: 'sch_mans', name: 'Mansfield Elementary', address: '45 East Third Ave, Mansfield, GA', phone: '(770) 784-2948', principal: 'Chris Williams', email: 'williams.c@newton.k12.ga.us' },
    { id: 'sch_mid', name: 'Middle Ridge Elementary', address: '11649 Covington Bypass, Covington, GA', phone: '(770) 385-6463', principal: 'Rhonda Battle', email: 'battle.r@newton.k12.ga.us' },
    { id: 'sch_oak', name: 'Oak Hill Elementary', address: '6243 Hwy 212, Covington, GA', phone: '(770) 784-2959', principal: 'Dr. Brenda Gammans', email: 'gammans.b@newton.k12.ga.us' },
];

// Re-export all for Service Consumption
export { 
    MOCK_TEACHERS, 
    MOCK_SCHOOL, 
    MOCK_DISTRICT, 
    MOCK_COUNTY, 
    MOCK_STATE, 
    MOCK_AUDIT, 
    MOCK_MEDS, 
    MOCK_INCIDENTS 
};
