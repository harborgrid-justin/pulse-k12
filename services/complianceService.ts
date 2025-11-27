
import { Student, ImmunizationRecord } from '../types';

// --- State Rule Definitions (Mock for "Georgia" Style Rules) ---
// In a real app, these would come from a database or external API.

interface VaccineRule {
  dosesRequired: number;
  name: string;
}

const GRADE_RULES: Record<string, VaccineRule[]> = {
  'K': [
    { name: 'MMR', dosesRequired: 2 },
    { name: 'Varicella', dosesRequired: 2 },
    { name: 'DTaP', dosesRequired: 4 }, // Simplified
    { name: 'Polio', dosesRequired: 3 },
    { name: 'Hepatitis B', dosesRequired: 3 }
  ],
  '7': [
    { name: 'Tdap', dosesRequired: 1 },
    { name: 'MCV4', dosesRequired: 1 }
  ],
  '11': [
    { name: 'MCV4', dosesRequired: 2 } // Booster
  ]
};

const GENERIC_RULES = [
    { name: 'MMR', dosesRequired: 2 },
    { name: 'Varicella', dosesRequired: 2 },
    { name: 'Polio', dosesRequired: 3 }
];

export const ComplianceService = {
  
  /**
   * Determines the ruleset for a specific student based on Grade/Age
   */
  getRequiredVaccines: (grade: string): VaccineRule[] => {
    // Logic: Returns cumulative rules. 
    // E.g., A 7th grader needs K rules + 7th grade rules.
    
    let rules = [...(GRADE_RULES['K'] || [])]; 
    
    const g = parseInt(grade);
    if (!isNaN(g)) {
        if (g >= 7) rules = [...rules, ...(GRADE_RULES['7'] || [])];
        if (g >= 11) rules = [...rules, ...(GRADE_RULES['11'] || [])];
    } else if (grade === 'K') {
        // Just K rules
    } else {
        // Fallback
        return GENERIC_RULES;
    }
    
    // Dedup by vaccine name, taking the higher dose count
    const merged: Record<string, number> = {};
    rules.forEach(r => {
        merged[r.name] = Math.max(merged[r.name] || 0, r.dosesRequired);
    });

    return Object.entries(merged).map(([name, dosesRequired]) => ({ name, dosesRequired }));
  },

  /**
   * Evaluates a student's full record against state rules.
   */
  evaluateCompliance: (student: Student): { 
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PROVISIONAL'; 
    missing: string[];
    alerts: string[];
  } => {
    const required = ComplianceService.getRequiredVaccines(student.grade);
    const records = student.immunizations || [];
    const missing: string[] = [];
    const alerts: string[] = [];
    
    let isNonCompliant = false;
    let isProvisional = false;

    required.forEach(rule => {
        // Check for exemptions first
        const exemption = records.find(r => r.name === rule.name && r.status === 'EXEMPT');
        if (exemption) {
            if (exemption.exemptionExpiry && new Date(exemption.exemptionExpiry) < new Date()) {
                missing.push(`${rule.name} (Exemption Expired)`);
                isNonCompliant = true;
            }
            return; // Skip if valid exempt
        }

        // Check record count
        const doses = records.filter(r => r.name === rule.name && r.status !== 'EXEMPT').length;
        
        if (doses < rule.dosesRequired) {
            missing.push(`${rule.name} (${doses}/${rule.dosesRequired})`);
            isNonCompliant = true;
        }
    });

    // Logic for provisional (e.g., in catch-up schedule) could go here
    // For now, strictly Compliant or Not.

    return {
        status: isNonCompliant ? 'NON_COMPLIANT' : 'COMPLIANT',
        missing,
        alerts
    };
  },

  /**
   * Generates the "State Audit Format" data structure
   */
  generateAuditExport: (students: Student[]) => {
    const rows = students.map(s => {
        const check = ComplianceService.evaluateCompliance(s);
        const exemptions = s.immunizations?.filter(i => i.status === 'EXEMPT').map(i => i.name).join(', ');
        
        return {
            StudentID: s.id,
            LastName: s.lastName,
            FirstName: s.firstName,
            Grade: s.grade,
            DOB: s.dob,
            ComplianceStatus: check.status,
            MissingVaccines: check.missing.join('; '),
            Exemptions: exemptions || 'None',
            LastUpdated: new Date().toLocaleDateString()
        };
    });
    
    return rows;
  }
};
