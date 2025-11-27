
export interface DrugConcept {
  name: string;
  rxcui: string;
  synonym?: string;
}

export const PublicHealthService = {
  /**
   * Searches for medications using the National Library of Medicine's RxNav API.
   * Endpoint: https://rxnav.nlm.nih.gov/REST/drugs.json
   */
  searchMedications: async (query: string): Promise<DrugConcept[]> => {
    if (!query || query.length < 3) return [];

    try {
      const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('RxNav API Error');

      const data = await response.json();
      
      // The API returns a complex structure. 
      // drugGroup -> conceptGroup -> [ { tty: 'SCD', conceptProperties: [...] }, ... ]
      // We want to aggregate all conceptProperties.
      
      if (!data.drugGroup || !data.drugGroup.conceptGroup) return [];

      const concepts: DrugConcept[] = [];
      
      data.drugGroup.conceptGroup.forEach((group: any) => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach((prop: any) => {
            // Filter out very long names or duplicates if necessary
            concepts.push({
              name: prop.name,
              rxcui: prop.rxcui,
              synonym: prop.synonym
            });
          });
        }
      });

      // Basic deduping by name
      const uniqueConcepts = Array.from(new Map(concepts.map(item => [item.name, item])).values());
      
      return uniqueConcepts.slice(0, 20); // Limit results

    } catch (error) {
      console.error("Medication Search Error", error);
      return [];
    }
  },

  /**
   * Fetches approximate spelling suggestions if no exact match is found.
   */
  getSpellingSuggestions: async (term: string): Promise<string[]> => {
      try {
          const response = await fetch(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${encodeURIComponent(term)}`);
          const data = await response.json();
          return data.suggestionGroup?.suggestionList?.suggestion || [];
      } catch (e) {
          return [];
      }
  }
};
