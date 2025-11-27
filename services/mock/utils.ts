
import { Student, ImmunizationRecord, Screening, Allergy, Prescription, VisitLog, Urgency, CarePlan } from '../../types';

// --- Helpers ---
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getBool = (probability: number) => Math.random() < probability;

// --- Data Sources ---
const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Aiden', 'Liam', 'Noah', 'Olivia', 'Emma', 'Ava', 'Elijah', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Ella', 'Jackson', 'Lucas', 'Mateo', 'Leo', 'Jack', 'Ezra'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

const CONDITIONS = ['Asthma', 'ADHD', 'Eczema', 'Type 1 Diabetes', 'Seizure Disorder', 'Cystic Fibrosis', 'Migraines'];
const ALLERGIES = [
    { name: 'Peanuts', severity: 'SEVERE', reaction: 'Anaphylaxis', actionPlan: 'EpiPen' },
    { name: 'Tree Nuts', severity: 'SEVERE', reaction: 'Anaphylaxis', actionPlan: 'EpiPen' },
    { name: 'Dairy', severity: 'MILD', reaction: 'Stomach Upset', actionPlan: 'Monitor' },
    { name: 'Bee Stings', severity: 'SEVERE', reaction: 'Swelling/Anaphylaxis', actionPlan: 'EpiPen' },
    { name: 'Penicillin', severity: 'MODERATE', reaction: 'Hives', actionPlan: 'Antihistamine' },
    { name: 'Latex', severity: 'MILD', reaction: 'Rash', actionPlan: 'Avoid Contact' }
];

// --- Generators ---

export const generateName = () => ({
    first: getRandomItem(FIRST_NAMES),
    last: getRandomItem(LAST_NAMES)
});

export const generateDOB = (grade: string) => {
    const currentYear = new Date().getFullYear();
    let yearOffset = 5; // PK
    if (grade === 'K') yearOffset = 6;
    else if (grade !== 'PK') yearOffset = 6 + parseInt(grade);
    
    const year = currentYear - yearOffset;
    const month = getRandomInt(1, 12).toString().padStart(2, '0');
    const day = getRandomInt(1, 28).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// GA Form 3231 Logic
export const generateImmunizations = (grade: string, dob: string): ImmunizationRecord[] => {
    const records: ImmunizationRecord[] = [];
    // 92% of students are fully compliant. The rest will have missing records.
    const isFullyCompliant = getBool(0.92); 

    const vaccines = [
        { name: 'DTaP', doses: 5 },
        { name: 'Polio (IPV)', doses: 4 },
        { name: 'Hepatitis B', doses: 3 },
        { name: 'Hepatitis A', doses: 2 },
        { name: 'MMR', doses: 2 },
        { name: 'Varicella', doses: 2 }
    ];

    vaccines.forEach((vax, idx) => {
        // Determine status for this specific vaccine
        // If student is compliant, all are compliant.
        // If not, 50% chance a specific vaccine is missing or exempt.
        let status = 'COMPLIANT';
        
        if (!isFullyCompliant) {
            const rand = Math.random();
            if (rand < 0.4) status = 'MISSING'; // Don't generate record
            else if (rand < 0.5) status = 'EXEMPT';
            // else remaining are Compliant
        }

        if (status !== 'MISSING') {
            records.push({
                id: `vax_${Math.random().toString(36).substr(2, 9)}`,
                name: vax.name,
                date: new Date(new Date(dob).getTime() + (1000 * 60 * 60 * 24 * 365 * (grade === 'PK' ? 2 : 4))).toISOString().split('T')[0],
                doseNumber: vax.doses,
                totalDoses: vax.doses,
                compliant: status === 'COMPLIANT',
                status: status as any,
                verified: true,
                manufacturer: getBool(0.7) ? 'Merck' : 'Pfizer',
                site: 'Left Thigh'
            });
        }
    });

    return records;
};

// GA Form 3300 Logic
export const generateScreenings = (grade: string): Screening[] => {
    const screenings: Screening[] = [];
    
    // Vision & Hearing (Required K, 1, 3, 5)
    if (['K', '1', '3', '5'].includes(grade)) {
        screenings.push({
            id: `scr_${Math.random()}`,
            date: '2024-08-15',
            type: 'VISION',
            result: getBool(0.9) ? 'PASS' : 'REFERRAL',
            value: getBool(0.9) ? '20/20' : '20/40',
            notes: 'Chart screening'
        });
        screenings.push({
            id: `scr_${Math.random()}`,
            date: '2024-08-15',
            type: 'HEARING',
            result: getBool(0.95) ? 'PASS' : 'REFERRAL',
            notes: 'Audiometer'
        });
    }

    // Scoliosis (Grade 5, 7)
    if (grade === '5') {
        screenings.push({
            id: `scr_scol_${Math.random()}`,
            date: '2024-09-01',
            type: 'SCOLIOSIS',
            result: 'PASS',
            notes: 'Negative for curvature'
        });
    }

    return screenings;
};

export const generateRandomCarePlan = (student: Partial<Student>): CarePlan => {
    const condition = student.conditions && student.conditions.length > 0 ? student.conditions[0] : null;
    
    if (condition === 'Asthma') {
        return {
            id: `cp_${Math.random().toString(36).substr(2,9)}`,
            type: 'IHP',
            title: 'Asthma Action Plan',
            createdAt: '2024-08-10',
            reviewDate: '2025-08-10',
            status: 'ACTIVE',
            content: '1. Pre-medicate 15 mins before PE if needed.\n2. Access to inhaler at all times.\n3. Call 911 if lips turn blue or struggling to breathe.'
        };
    } else if (condition === 'Type 1 Diabetes') {
        return {
            id: `cp_${Math.random().toString(36).substr(2,9)}`,
            type: 'IHP',
            title: 'Diabetes Medical Management Plan',
            createdAt: '2024-08-05',
            reviewDate: '2025-08-05',
            status: 'ACTIVE',
            content: '1. Check blood glucose before lunch and if symptomatic.\n2. Allow snacks in class.\n3. Hypoglycemia protocol: 15g carbs, recheck 15 mins.'
        };
    } else if (condition === 'Seizure Disorder') {
        return {
            id: `cp_${Math.random().toString(36).substr(2,9)}`,
            type: 'EAP',
            title: 'Seizure Emergency Action Plan',
            createdAt: '2024-08-12',
            reviewDate: '2025-08-12',
            status: 'ACTIVE',
            content: '1. Protect head, do not restrain.\n2. Time the seizure.\n3. Administer Diastat if > 5 mins.\n4. Call 911 if first seizure or > 5 mins.'
        };
    } else {
        // Generic
        return {
            id: `cp_${Math.random().toString(36).substr(2,9)}`,
            type: 'IHP',
            title: 'General Wellness & Monitoring',
            createdAt: '2024-09-01',
            reviewDate: '2025-06-01',
            status: 'ACTIVE',
            content: 'Monitor for signs of illness. Encourage hydration. Standard first aid protocols apply.'
        };
    }
};

export const generateMedicalProfile = (studentId: string) => {
    const allergies: Allergy[] = [];
    const conditions: string[] = [];
    const prescriptions: Prescription[] = [];

    // 15% chance of having a condition
    if (getBool(0.15)) {
        const cond = getRandomItem(CONDITIONS);
        conditions.push(cond);

        if (cond === 'Asthma') {
            prescriptions.push({
                id: `rx_${studentId}_1`,
                medicationName: 'Albuterol Sulfate',
                dosage: '2 Puffs',
                frequency: 'PRN',
                instructions: 'Every 4 hours as needed for wheezing',
                prescriber: 'Dr. Smith',
                hasAuthorization: true,
                storageLocation: 'Cabinet A'
            });
        } else if (cond === 'ADHD') {
            prescriptions.push({
                id: `rx_${studentId}_2`,
                medicationName: 'Methylphenidate',
                dosage: '10mg',
                frequency: 'DAILY',
                time: '12:00 PM',
                instructions: 'Give with lunch',
                prescriber: 'Dr. Jones',
                hasAuthorization: true,
                storageLocation: 'Lockbox'
            });
        }
    }

    // 8% chance of allergies
    if (getBool(0.08)) {
        const alg = getRandomItem(ALLERGIES);
        allergies.push(alg as any);
        if (alg.actionPlan === 'EpiPen') {
            prescriptions.push({
                id: `rx_${studentId}_epi`,
                medicationName: 'EpiPen Jr',
                dosage: '0.15mg',
                frequency: 'PRN',
                instructions: 'Inject into thigh immediately upon anaphylaxis. Call 911.',
                prescriber: 'Dr. Allergy',
                hasAuthorization: true,
                storageLocation: 'Emergency Wall Box'
            });
        }
    }

    return { allergies, conditions, prescriptions };
};

export const generateVisits = (studentId: string, grade: string, hasConditions: boolean): VisitLog[] => {
    const logs: VisitLog[] = [];
    const count = hasConditions ? getRandomInt(1, 8) : getRandomInt(0, 2);

    for (let i = 0; i < count; i++) {
        logs.push({
            id: `v_${studentId}_${i}`,
            studentId,
            timestamp: new Date(Date.now() - getRandomInt(0, 1000 * 60 * 60 * 24 * 90)).toISOString(), // Last 90 days
            visitReason: hasConditions ? 'Chronic Condition Mgmt' : 'Injury/Illness',
            symptoms: hasConditions ? 'Routine check' : 'Scrape/Headache',
            treatment: hasConditions ? 'Meds Administered' : 'Ice/Rest',
            outcome: 'Returned to class',
            urgency: Urgency.LOW,
            notes: 'Routine interaction',
            durationMinutes: getRandomInt(5, 15),
            processedByAI: getBool(0.3)
        });
    }
    return logs;
};
