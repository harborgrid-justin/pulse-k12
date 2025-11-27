
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

export interface ImmunizationInput {
    name: string;
    date: string;
    doseNumber: number;
    cvxCode?: string;
    lotNumber?: string;
    manufacturer?: string;
    site?: string;
}

export const AthenaService = {
  /**
   * Searches NLM Clinical Tables API for Vaccines (CVX)
   * Public Endpoint: https://clinicaltables.nlm.nih.gov/api/vaccines/v3/search
   */
  searchVaccines: async (query: string) => {
    if (!query || query.length < 2) return [];
    
    try {
      // Fetch from NLM Public API
      const response = await fetch(`https://clinicaltables.nlm.nih.gov/api/vaccines/v3/search?terms=${encodeURIComponent(query)}&maxList=10`);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      // API returns [count, codes, null, [[display, code, status], ...]]
      // We want the 4th element (index 3) which is the array of results
      const results = data[3];

      if (!Array.isArray(results)) return [];

      return results.map((item: any) => ({
        display: item[0], // Vaccine Name
        code: item[1],    // CVX Code
        system: 'http://hl7.org/fhir/sid/cvx'
      }));

    } catch (error) {
      console.error("NLM Vaccine Search Error", error);
      return [];
    }
  },

  /**
   * Saves an immunization record to the Athena FHIR API
   */
  createImmunization: async (studentId: string, data: ImmunizationInput): Promise<boolean> => {
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
      // Simulate successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    } catch (error) {
      console.error("Athena API Error", error);
      return false;
    }
  }
};
