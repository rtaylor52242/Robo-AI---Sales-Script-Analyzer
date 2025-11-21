
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing the overall effectiveness of the script.",
    },
    hookStrength: {
      type: Type.INTEGER,
      description: "A score from 1 to 10 on how well the opening grabs attention.",
    },
    youUsageCount: {
      type: Type.INTEGER,
      description: "The exact number of times the words 'you' or 'your' appear.",
    },
    painPointClarity: {
      type: Type.INTEGER,
      description: "A score from 1 to 10 on how clearly the script identifies and addresses the customer's pain points.",
    },
    ctaStrength: {
      type: Type.INTEGER,
      description: "A score from 1 to 10 on the clarity and compellingness of the Call to Action.",
    },
    salesKeywordCount: {
      type: Type.INTEGER,
      description: "The count of strong sales-related keywords found (e.g., 'discount', 'free', 'limited time', 'guarantee', 'exclusive').",
    },
    improvements: {
      type: Type.ARRAY,
      description: "A list of 3 to 5 specific, actionable improvements.",
      items: {
        type: Type.OBJECT,
        properties: {
          before: {
            type: Type.STRING,
            description: "A short, relevant snippet from the original script that needs improvement.",
          },
          after: {
            type: Type.STRING,
            description: "The suggested improved version of the snippet.",
          },
          explanation: {
            type: Type.STRING,
            description: "A brief, clear explanation of why the 'after' version is an improvement over the 'before' version.",
          },
        },
        required: ["before", "after", "explanation"],
      },
    },
  },
  required: [
    "overallScore",
    "hookStrength",
    "youUsageCount",
    "painPointClarity",
    "ctaStrength",
    "salesKeywordCount",
    "improvements",
  ],
};

export const analyzeScript = async (scriptText: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  // Calculate word count locally
  const wordCount = scriptText.trim().length === 0 ? 0 : scriptText.trim().split(/\s+/).length;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are an expert sales copywriter and persuasion analyst. Analyze the following sales script.
  Provide a detailed analysis based on the following criteria:
  1.  **Overall Score:** A score from 0 to 100 representing the overall effectiveness of the script.
  2.  **Hook Strength:** A score from 1 to 10 on how well the opening grabs attention.
  3.  **"You" Usage Count:** Count the exact number of times the word "you" or "your" appears.
  4.  **Pain Point Clarity:** A score from 1 to 10 on how clearly the script identifies and addresses the customer's pain points.
  5.  **CTA Strength:** A score from 1 to 10 on the clarity and compellingness of the Call to Action.
  6.  **Sales Keyword Count:** Count the occurrences of key sales-related keywords (e.g., 'discount', 'free', 'limited time', 'guarantee', 'exclusive', 'save', 'now').
  7.  **Improvements:** Provide 3 to 5 specific, actionable improvements. For each improvement, provide a "before" snippet from the original script, a suggested "after" version, and an explanation.

  Here is the script:
  ---
  ${scriptText}
  ---

  Please return your analysis in a JSON format matching the specified schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const aiResult = JSON.parse(jsonText);

    return {
      ...aiResult,
      wordCount,
    } as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing script:", error);
    throw new Error("Failed to get analysis from AI. Please check the script or try again later.");
  }
};