
import { County } from '../../types';

export const MOCK_COUNTY: County = {
    id: 'cnty_newton',
    name: 'Newton County',
    headOfAdmin: 'Director Sarah James',
    director: 'Director Sarah James',
    contactPhone: '(770) 786-5555',
    totalPopulation: 115000, // Total students in county scope
    totalDistricts: 3,
    complianceRate: 91.2,
    healthDepartmentContact: 'Dr. Emily Stone (County Health)',
    budget: {
        allocated: 4500000,
        spent: 3200000,
        currency: 'USD',
        fiscalYear: '2024-2025'
    },
    epidemiologyAlerts: ['Influenza B Cluster identified in Southern District', 'Measles Watch (Statewide)']
};
