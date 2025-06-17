
import { GoogleGenAI, GenerateContentResponse, Part, Content } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';
import { Candidate } from "../types";


const getApiKey = (): string | undefined => {
  return import.meta.env.VITE_API_KEY;
};


const initializeGenAI = (): GoogleGenAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("Gemini API Key is not available.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Generic function to make generateContent calls
export async function generateContent<T>(
  prompt: string | Part | (string | Part)[],
  jsonOutput: boolean = false,
  useSearch: boolean = false
): Promise<{ text: string | null; parsedJson?: T; candidates?: Candidate[]; error?: string }> {
  const ai = initializeGenAI();
  if (!ai) {
    return { text: null, error: "API Key not configured." };
  }

  const config: any = {};
  if (jsonOutput) {
    config.responseMimeType = "application/json";
  }
  if (useSearch) {
    config.tools = [{ googleSearch: {} }];
    if (config.responseMimeType === "application/json") {
      delete config.responseMimeType;
      // jsonOutput = false; // Let it try to parse, but be aware it might not be JSON.
    }
  }
  
  // Correctly construct contents for the API
  let apiContents: Content[]; // This is an array of Content objects

  if (typeof prompt === 'string') {
    apiContents = [{ role: "user", parts: [{ text: prompt }] }];
  } else if (Array.isArray(prompt)) {
    // Map array of (string | Part) to Part[]
    const parts: Part[] = prompt.map(p_part => 
        typeof p_part === 'string' ? { text: p_part } : p_part
    );
    apiContents = [{ role: "user", parts: parts }];
  } else { // prompt is a single Part object
    apiContents = [{ role: "user", parts: [prompt] }];
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: apiContents,
      ...(Object.keys(config).length > 0 && { config }),
    });

    const responseText = response.text;
    const candidates = response.candidates as Candidate[] | undefined;

    if (jsonOutput && responseText) {
      let jsonStr = responseText.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      try {
        const parsedData = JSON.parse(jsonStr) as T;
        return { text: responseText, parsedJson: parsedData, candidates };
      } catch (e) {
        console.error("Failed to parse JSON response:", e, "\nRaw response:", responseText);
        return { text: responseText, error: "Failed to parse JSON response.", candidates };
      }
    }
    return { text: responseText, candidates };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      return { text: null, error: error.message, candidates: undefined };
    }
    return { text: null, error: "An unknown error occurred with the Gemini API.", candidates: undefined };
  }
}


export const fetchProblemSuggestions = async (
  jobToBevDone: string,
  suggestionType: 'Pains' | 'Gains'
): Promise<{ suggestions?: string[]; error?: string }> => {
  const promptText = `Based on the customer job-to-be-done: "${jobToBevDone}", list 5 potential customer ${suggestionType.toLowerCase()}. Provide the list as a JSON array of strings. Example: ["Suggestion 1", "Suggestion 2"]`;
  
  interface SuggestionResponse { // For cases where AI wraps it in an object
    suggestions: string[];
  }

  const result = await generateContent<string[] | SuggestionResponse>(promptText, true);
  
  if (result.error && !result.parsedJson) {
    if (result.text) {
      const lines = result.text.split('\n').map(s => s.replace(/^- /, '').trim()).filter(Boolean);
      return { suggestions: lines.slice(0, 5) };
    }
    return { error: result.error || "Failed to get suggestions." };
  }
  
  if (result.parsedJson) {
    if (Array.isArray(result.parsedJson)) {
      return { suggestions: result.parsedJson as string[] };
    } else if (typeof result.parsedJson === 'object' && result.parsedJson !== null && 'suggestions' in result.parsedJson) {
      const typedResult = result.parsedJson as SuggestionResponse;
      if (Array.isArray(typedResult.suggestions)) {
        return { suggestions: typedResult.suggestions };
      }
    }
  }

  if (result.text) {
    try {
      const potentialJsonArray = JSON.parse(result.text);
      if (Array.isArray(potentialJsonArray)) {
        return { suggestions: potentialJsonArray.map(String) };
      }
    } catch (e) {
      const lines = result.text.split('\n').map(s => s.replace(/^- /, '').trim()).filter(Boolean);
      if (lines.length > 0) return { suggestions: lines.slice(0,5) };
    }
  }

  return { error: "Received unexpected format for suggestions." };
};


export const checkInnovatorsBias = async (
  problemDescription: string
): Promise<{ rephrasedProblem?: string; error?: string }> => {
  const promptText = `Analyze the following problem description for innovator's bias (i.e., focusing on a solution instead of the problem). 
Problem: "${problemDescription}"
Rephrase the description to focus purely on the customer's situation, jobs, pains, or gains, without mentioning any specific product, service, or solution. 
If the original description is already well-focused on the problem, acknowledge that and briefly explain why.
Your response should be the rephrased problem statement or the acknowledgment.`;
  // Expecting simple text, not JSON
  const result = await generateContent<string>(promptText, false); 
  if (result.error) {
    return { error: result.error };
  }
  return { rephrasedProblem: result.text ?? undefined };
};

export const searchRecentEvents = async (query: string): Promise<{ text?: string | null; sources?: any[]; error?: string }> => {
    const promptText = `Provide information about: "${query}". Include sources if available.`;
    const result = await generateContent(promptText, false, true); // enable search
    
    if (result.error) {
        return { error: result.error };
    }

    const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        .map(chunk => ({ title: chunk.web?.title, uri: chunk.web?.uri }));

    return { text: result.text, sources };
};

// New AI helper functions will be added by AppContext or specific component files
// by directly calling the generic `generateContent` function.
// This keeps this service file leaner.
