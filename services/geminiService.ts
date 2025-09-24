
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeReport = async (reportText: string): Promise<string> => {
    if (!reportText || reportText.trim().length < 20) {
        return "The report is too short to summarize.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following physiotherapy SOAP note. Focus on the patient's primary complaint, key objective findings (like ROM/MMT deficits), the clinical diagnosis, and the main treatment interventions planned. Keep the summary concise and professional for a quick clinical overview.\n\nREPORT:\n${reportText}`,
            config: {
                systemInstruction: "You are a highly skilled medical scribe specializing in physical therapy documentation. Your summaries are precise and clinically relevant.",
                temperature: 0.3,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error summarizing report with Gemini API:", error);
        return "There was an issue generating the summary. The AI model may be temporarily unavailable. Please try again later.";
    }
};
