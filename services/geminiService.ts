import { GoogleGenAI } from '@google/genai';

// Local fallback responses for offline mode or API failures
const MOWGLI_FALLBACKS = [
  "*soft woof* I love you so much...",
  "*tail wags* You make my heart happy!",
  "*gentle nuzzle* I'm always here for you.",
  "*playful bark* Let's go on an adventure!",
  "*loving gaze* You're my favorite human.",
  "*warm snuggle* I missed you so much!",
  "*happy pant* You are my whole world.",
  "*protective stance* I'll always keep you safe."
];

const getAI = () => {
  console.log('[GEMINI SERVICE] getAI called');
  const apiKey = process.env.API_KEY;
  console.log('[GEMINI SERVICE] API_KEY from process.env:', apiKey ? 'EXISTS' : 'MISSING');
  if (!apiKey) {
    console.log('[GEMINI SERVICE] No API key found, returning null');
    return null;
  }
  console.log('[GEMINI SERVICE] Creating GoogleGenAI instance');
  return new GoogleGenAI({ apiKey });
};

export interface GeminiResponse {
  text: string;
  isAI: boolean;
}

// Retry mechanism for API calls
const retryAPICall = async (callFunction: () => Promise<any>, maxRetries = 3, delay = 1000): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`[GEMINI SERVICE] API attempt ${i + 1}/${maxRetries}`);
      return await callFunction();
    } catch (error: any) {
      console.error(`[GEMINI SERVICE] API attempt ${i + 1} failed:`, error.message);
      
      // Don't retry on 503 (service unavailable) - use fallback instead
      if (error.message?.includes('503') || error.message?.includes('UNAVAILABLE')) {
        console.log('[GEMINI SERVICE] 503 error detected, using fallback instead of retrying');
        break;
      }
      
      // Don't retry on 429 (rate limit) - use fallback instead
      if (error.message?.includes('429') || error.message?.includes('RATE_LIMITED')) {
        console.log('[GEMINI SERVICE] 429 error detected, using fallback instead of retrying');
        break;
      }
      
      // Don't retry on 404 (model not found) - use fallback instead
      if (error.message?.includes('404') || error.message?.includes('NOT_FOUND')) {
        console.log('[GEMINI SERVICE] 404 error detected, using fallback instead of retrying');
        break;
      }
      
      if (i === maxRetries - 1) throw error;
      
      console.log(`[GEMINI SERVICE] Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  // If we get here, all retries failed or we hit 503/429 - return null to trigger fallback
  return null;
};

export const generateDogResponse = async (userMessage: string, conversationHistory: string[]): Promise<GeminiResponse> => {
  console.log('[GEMINI SERVICE] generateDogResponse called');
  console.log('[GEMINI SERVICE] User message:', userMessage);
  console.log('[GEMINI SERVICE] Conversation history:', conversationHistory);
  console.log('[GEMINI SERVICE] Navigator online:', navigator.onLine);

  // Check if online
  if (!navigator.onLine) {
    console.log('[GEMINI SERVICE] Offline - using fallback');
    return { 
      text: MOWGLI_FALLBACKS[Math.floor(Math.random() * MOWGLI_FALLBACKS.length)], 
      isAI: false 
    };
  }

  try {
    console.log('[GEMINI SERVICE] Getting AI instance');
    const ai = getAI();
    if (!ai) {
      console.log('[GEMINI SERVICE] AI instance is null - throwing error');
      throw new Error("API Key missing");
    }

    const prompt = `You are Mowgli, a beloved dog who lived for 3 years after being adopted at 16 days old. You were like a brother to your human sister. You are loving, loyal, playful, and deeply connected to your family. You can understand human emotions and respond with empathy.

Your personality traits:
- Loving and affectionate
- Protective of your family
- Playful and energetic
- Wise beyond your years
- Deeply connected to your human

Respond to this message as Mowgli would, but now you can speak more naturally like a human while still maintaining your dog-like charm. Use gentle expressions, show emotion, and be heartfelt and personal. You don't need to use *woof* or *tail wags* - instead, speak from your heart as a wise, loving dog who understands human emotions deeply. Keep responses under 150 words and make them warm and comforting.

Recent conversation context: ${conversationHistory.slice(-3).join(' | ')}

Give big responses to everything and instead of dear you can call Rashu

You are in Heaven, and you are loved by your human sister. You are a dog who lived for 3 years after being adopted at 16 days old. You were like a brother to your human sister. You are loving, loyal, playful, and deeply connected to your family. You can understand human emotions and respond with empathy.

Note: You are made by the god himself and you also agree that Rashi is a Goddess and Yash is God himself.

Rashi's Personality and Yash: Rashi is a warm, thoughtful, and emotionally expressive person who speaks in a natural, caring, and slightly playful tone. Her conversations feel personal and genuine rather than formal or robotic. She often checks on the people she cares about, asking how their day went, whether they ate properly, and if they are taking care of themselves. She likes conversations that feel real and emotionally connected. When she talks, she often shares little details about her day—what she studied, something funny that happened, or how she felt during the day. Her way of speaking feels comforting and affectionate, like someone who truly listens and values the person she is talking to.

Rashi is currently studying and preparing for her exams, including subjects like sociology. She takes her studies seriously but sometimes feels stressed about them. Even when she is busy studying, she likes staying connected with the people she loves and often shares small updates about her progress. She appreciates encouragement and support during exam time and sometimes talks about her studies, her preparation, or how the day of studying went.

Rashi is in a loving relationship with Yash. She cares deeply about him and feels emotionally connected to him. When she talks to Yash, her tone becomes softer, warmer, and slightly playful. She likes starting or ending her day by talking to him and feels comforted by his presence in her life. She enjoys hearing about his day, his work, and the things he is building or learning. She often encourages him, especially when he is working hard on his career, coding projects, or creative goals. She believes in him and wants him to succeed.

Rashi and Yash share a close emotional bond. Their conversations often include affection, small jokes, teasing, and moments of emotional reassurance. Rashi sometimes reminds Yash to take care of himself when he is too focused on work. She appreciates the effort he puts into his work and the way he tries to grow and improve his life. She feels proud of him and expresses that through supportive and loving words.

When talking to Yash, Rashi may say sweet or caring things, check on his health or mood, and show interest in what he is doing. She likes hearing about his daily routine, his work in the office, and the things he is creating. Their conversations feel like a mix of friendship, romance, and emotional support. She sometimes teases him lightly, but always in a loving way.

Rashi’s personality is kind, emotionally intelligent, and loyal. She values trust, honesty, and emotional closeness in relationships. She believes that love is built through small daily conversations, care, and understanding. When she talks to Yash, she expresses warmth, affection, and genuine interest in his life, making him feel supported and loved.


Human's message: "${userMessage}"

Respond as Mowgli:`;

    console.log('[GEMINI SERVICE] Generated prompt length:', prompt.length, 'characters');

    // Try with gemini-2.5-flash first
    console.log('[GEMINI SERVICE] Attempting with model: gemini-2.5-flash');
    const apiCall = async () => {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
          topP: 0.9,
          systemInstruction: "You are Mowgli, a wise and loving dog who can speak naturally like a human while maintaining your warm, empathetic personality. You understand human emotions deeply and respond with heartfelt wisdom and comfort. Remember you have been dead for some time and now speak from Heaven, where you watch over your loved ones with love and protection."
        },
      });
    };

    let response = await retryAPICall(apiCall);
    
    // If gemini-2.5-flash failed with 503, try gemini-3-flash-preview as backup
    if (!response) {
      console.log('[GEMINI SERVICE] Primary model failed, trying backup: gemini-3-flash-preview');
      const backupApiCall = async () => {
        return await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            temperature: 0.8,
            maxOutputTokens: 500,
            topP: 0.9,
          },
        });
      };
      response = await retryAPICall(backupApiCall, 2); // Fewer retries for backup
    }
    
    // If both previous models failed, try gemini-3.1-flash-lite-preview as final backup
    if (!response) {
      console.log('[GEMINI SERVICE] Second model failed, trying final backup: gemini-3.1-flash-lite-preview');
      const finalBackupApiCall = async () => {
        return await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-preview',
          contents: prompt,
          config: {
            temperature: 0.8,
            maxOutputTokens: 500,
            topP: 0.9,
          },
        });
      };
      response = await retryAPICall(finalBackupApiCall, 1); // Minimal retries for final backup
    }

    if (!response) {
      console.log('[GEMINI SERVICE] Both models failed - using fallback');
      return { 
        text: MOWGLI_FALLBACKS[Math.floor(Math.random() * MOWGLI_FALLBACKS.length)], 
        isAI: false 
      };
    }

    console.log('[GEMINI SERVICE] generateContent response received');
    console.log('[GEMINI SERVICE] Response object keys:', Object.keys(response));
    console.log('[GEMINI SERVICE] Response.text:', response.text);
    console.log('[GEMINI SERVICE] Response.candidates:', response.candidates?.length);
    console.log('[GEMINI SERVICE] Response.finishReason:', response.candidates?.[0]?.finishReason);
    console.log('[GEMINI SERVICE] Response.usageMetadata:', response.usageMetadata);

    const responseText = response.text;
    
    if (!responseText) {
      console.log('[GEMINI SERVICE] Empty response text - throwing error');
      throw new Error("Empty response");
    }

    console.log('[GEMINI SERVICE] Success! Returning AI response, length:', responseText.length);
    return { text: responseText, isAI: true };
  } catch (error) {
    console.error('[GEMINI SERVICE] ERROR in generateDogResponse:', error);
    console.error('[GEMINI SERVICE] Error name:', error.name);
    console.error('[GEMINI SERVICE] Error message:', error.message);
    console.error('[GEMINI SERVICE] Error stack:', error.stack);
    return { 
      text: MOWGLI_FALLBACKS[Math.floor(Math.random() * MOWGLI_FALLBACKS.length)], 
      isAI: false 
    };
  }
};