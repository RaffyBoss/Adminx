
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize GoogleGenAI with the API key from environment variables as required
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Uses gemini-3-flash-preview for professional text rewriting task
  async rewriteText(text: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite the following text to be more professional and engaging:\n\n${text}`,
      config: {
        systemInstruction: "You are a professional copywriter. Your goal is to improve the tone and clarity of internal admin dashboard content."
      }
    });
    return response.text || 'Error generating text.';
  }

  // Uses gemini-3-flash-preview for lead summarization task
  async summarizeLead(leadData: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this lead and provide 3 key follow-up action points:\n\n${leadData}`,
      config: {
        systemInstruction: "You are a sales assistant helping an admin manage business leads."
      }
    });
    return response.text || 'Error generating summary.';
  }

  // Uses gemini-3-flash-preview for generating marketing content
  async generateServiceDescription(serviceName: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a compelling, 2-sentence marketing description for a service called: ${serviceName}`,
      config: {
        systemInstruction: "You are a creative marketer focused on high-conversion service descriptions."
      }
    });
    return response.text || 'Error generating description.';
  }
}

export const geminiService = new GeminiService();
