
import { State } from '../../types';

export const MOCK_STATE: State = {
    id: 'st_ga',
    name: 'State of Georgia',
    headOfAdmin: 'Gov. Brian Kemp',
    governor: 'Gov. Brian Kemp',
    contactPhone: '(404) 656-1776',
    totalPopulation: 1800000, // Total K-12 Students
    totalCounties: 159,
    complianceRate: 88.5,
    departmentOfHealthContact: 'Commissioner Kathleen Toomey',
    budget: {
        allocated: 120000000,
        spent: 98000000,
        currency: 'USD',
        fiscalYear: '2024-2025'
    },
    legislativeUpdates: ['HB 1013: Mental Health Parity Act Implementation', 'New Vaccination Schedule for 2025-26']
};
