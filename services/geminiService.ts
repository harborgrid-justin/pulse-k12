import { GoogleGenAI, Type } from "@google/genai";
import { Urgency, VisitAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * Analyzes raw clinical notes and extracts structured data for the visit log.
   */
  processClinicalNote: async (rawText: string): Promise<VisitAnalysis> => {
    try {
      const modelId = 'gemini-2.5-flash';
      
      const response = await ai.models.generateContent({
        model: modelId,
        contents: `You are an expert school nurse assistant. 
        Analyze the following raw input from a nurse about a student visit: "${rawText}".
        
        Extract the information into a structured JSON object.
        If a field is not explicitly mentioned, infer a reasonable professional default or leave it empty.
        
        1. symptoms: The complaint or physical signs.
        2. treatment: What actions were taken.
        3. outcome: The result of the visit (e.g. Returned to class, Sent home).
        4. urgency: One of [LOW, MEDIUM, HIGH, CRITICAL].
        5. formattedNote: A professional SOAP note summary of the event.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              symptoms: { type: Type.STRING },
              treatment: { type: Type.STRING },
              outcome: { type: Type.STRING },
              formattedNote: { type: Type.STRING },
              urgency: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            },
            required: ['symptoms', 'treatment', 'outcome', 'formattedNote', 'urgency']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return {
        symptoms: result.symptoms || '',
        treatment: result.treatment || '',
        outcome: result.outcome || 'Returned to class',
        formattedNote: result.formattedNote || rawText,
        urgency: (result.urgency as Urgency) || Urgency.LOW,
      };

    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fallback
      return {
        symptoms: rawText,
        treatment: '',
        outcome: '',
        formattedNote: rawText,
        urgency: Urgency.LOW,
      };
    }
  },

  /**
   * General assistant chat
   */
  askAssistant: async (query: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                systemInstruction: "You are a helpful, knowledgeable school nurse assistant. Keep answers concise, professional, and relevant to K-12 school health protocols. Do not provide definitive medical diagnoses, but suggest potential assessments."
            }
        });
        return response.text || "I'm sorry, I couldn't process that.";
    } catch (e) {
        console.error(e);
        return "Service unavailable.";
    }
  },

  /**
   * Generates a formal state report narrative based on compliance data.
   */
  generateStateReport: async (schoolName: string, complianceData: any): Promise<string> => {
      try {
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Generate a formal state health reporting narrative for ${schoolName}.
              Data: ${JSON.stringify(complianceData)}.
              
              The report should be addressed to the State Department of Health. 
              It should summarize immunization compliance, communicable disease incidents, and general health screenings.
              Use a formal, bureaucratic tone suitable for official government submission.`,
          });
          return response.text || "Report generation failed.";
      } catch (e) {
          console.error(e);
          return "Error generating report.";
      }
  }
};