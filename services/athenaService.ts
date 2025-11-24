
import { Student } from '../types';

// FHIR R4 Interfaces based on AthenaHealth documentation
export interface FHIRImmunization {
  resourceType: 'Immunization';
  status: 'completed' | 'entered-in-error' | 'not-done';
  vaccineCode: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
    text: string;
  };
  patient: {
    reference: string; // e.g., "Patient/1001"
  };
  occurrenceDateTime: string;
  lotNumber?: string;
  site?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
    text?: string;
  };
  manufacturer?: {
    display: string;
  };
  doseQuantity?: {
    value: number;
    unit: string;
  };
}

// Mock database of CVX codes for the "Auto-selection" / Search feature
// In a real app, this would query a Terminology Service or Athena's ValueSet API.
const VACCINE_CVX_CODES = [
  { code: '03', display: 'MMR', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '94', display: 'MMR-V', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '115', display: 'Tdap', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '09', display: 'Td (adult)', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '20', display: 'DTaP', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '21', display: 'Varicella', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '140', display: 'Influenza, seasonal, injectable', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '141', display: 'Influenza, seasonal, injectable', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '208', display: 'Pfizer COVID-19 Vaccine', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '207', display: 'Moderna COVID-19 Vaccine', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '83', display: 'Hepatitis A', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '08', display: 'Hepatitis B', system: 'http://hl7.org/fhir/sid/cvx' },
  { code: '10', display: 'IPV (Polio)', system: 'http://hl7.org/fhir/sid/cvx' },
];

export const AthenaService = {
  /**
   * Simulates searching Athena/Standard vocabulary for vaccines (CVX)
   */
  searchVaccines: async (query: string) => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return VACCINE_CVX_CODES.filter(v => 
      v.display.toLowerCase().includes(lowerQuery) || 
      v.code.includes(lowerQuery)
    );
  },

  /**
   * Saves an immunization record to the Athena FHIR API
   */
  createImmunization: async (studentId: string, data: any): Promise<boolean> => {
    console.log("Saving to AthenaHealth FHIR API...");

    // 1. Construct FHIR R4 Resource
    const fhirResource: FHIRImmunization = {
      resourceType: 'Immunization',
      status: 'completed',
      vaccineCode: {
        coding: [{
          system: 'http://hl7.org/fhir/sid/cvx',
          code: data.cvxCode || 'UNKNOWN',
          display: data.name
        }],
        text: data.name
      },
      patient: {
        reference: `Patient/${studentId}`
      },
      occurrenceDateTime: data.date,
      lotNumber: data.lotNumber,
      manufacturer: data.manufacturer ? { display: data.manufacturer } : undefined,
      site: data.site ? {
        coding: [{
            system: "http://terminology.hl7.org/CodeSystem/v3-ActSite", 
            code: "LA", // Mock logic, defaulting to Left Arm for demo
            display: data.site 
        }],
        text: data.site
      } : undefined,
      doseQuantity: {
        value: data.doseNumber,
        unit: 'dose'
      }
    };

    console.log("FHIR Payload:", JSON.stringify(fhirResource, null, 2));

    try {
      // 2. In a real environment, this would be the fetch call:
      /*
      const response = await fetch('https://api.athenahealth.com/preview1/fhir/r4/Immunization', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ATHENA_TOKEN}`,
          'Content-Type': 'application/fhir+json'
        },
        body: JSON.stringify(fhirResource)
      });
      if (!response.ok) throw new Error('FHIR Submit Failed');
      return true;
      */

      // Simulate successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    } catch (error) {
      console.error("Athena API Error", error);
      return false;
    }
  }
};
