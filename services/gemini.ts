
import { GoogleGenAI } from "@google/genai";
import { siteConfig } from "../data/config";

// Local fallback responses for offline mode or API failures
const STITCH_FALLBACKS = [
  "Meega nala kweesta! (I love you!)",
  "Aloha! Ohana means family!",
  "Stitch hungry... where coconut cake?",
  "Ih! (Yes!) Family together forever.",
  "Gaba ika bi daka? (What is happening?)",
  "Naga! (No!) Nobody left behind.",
  "Stitch heart big like galaxy!",
  "You my favorite experiment."
];

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateStitchResponse = async (userInput: string): Promise<{ text: string; source: 'cloud' | 'local' }> => {
  // Check if online
  if (!navigator.onLine) {
    return { 
      text: STITCH_FALLBACKS[Math.floor(Math.random() * STITCH_FALLBACKS.length)], 
      source: 'local' 
    };
  }

  try {
    const ai = getAI();
    if (!ai) throw new Error("API Key missing");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: siteConfig.lab.systemInstruction,
        temperature: 0.8,
      },
    });

    // CRITICAL: Use .text property as per SDK guidelines
    const responseText = response.text;
    
    if (!responseText) throw new Error("Empty response");

    return { text: responseText, source: 'cloud' };
  } catch (error) {
    console.warn("Gemini API failed, falling back to local brain:", error);
    return { 
      text: STITCH_FALLBACKS[Math.floor(Math.random() * STITCH_FALLBACKS.length)], 
      source: 'local' 
    };
  }
};

export const generateLoveLetter = async (context: string): Promise<string> => {
  if (!navigator.onLine) {
    return "Even without the stars as witness, my heart knows its home in you. You are my ohana, today and for every tomorrow.";
  }

  try {
    const ai = getAI();
    if (!ai) return "You are my entire world, my ohana, and my greatest adventure.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a beautiful, romantic love letter. Context: ${context || siteConfig.finale.letterContext}`,
      config: {
        systemInstruction: "You are a romantic poet writing a message for a soulmate. Use cosmic and tropical metaphors. Keep it deeply personal.",
      },
    });
    
    return response.text || "Our love is as vast as the universe and as warm as a Hawaiian sunset.";
  } catch (error) {
    return "Our bond is stronger than any storm. You are the light I follow home.";
  }
};
