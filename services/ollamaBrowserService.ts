// Browser-compatible Ollama service using ollama-js-client
// This works directly in the browser without needing a backend server

// Install: npm install ollama-js-client

export interface OllamaResponse {
  text: string;
  isAI: boolean;
}

// Local fallback responses for offline mode
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

// Check if Ollama is available (local or cloud)
const checkOllamaAvailability = async (): Promise<string | null> => {
  try {
    // Try local Ollama first
    const localResponse = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      mode: 'no-cors', // This helps with CORS issues
      timeout: 2000
    });
    
    if (localResponse) {
      console.log('[OLLAMA] Local Ollama detected');
      return 'http://localhost:11434';
    }
  } catch (error) {
    console.log('[OLLAMA] Local Ollama not available:', error);
  }

  try {
    // Try Ollama Cloud
    const cloudResponse = await fetch('https://ollama.com/api/tags', {
      method: 'GET',
      timeout: 3000
    });
    
    if (cloudResponse.ok) {
      console.log('[OLLAMA] Ollama Cloud available');
      return 'https://ollama.com';
    }
  } catch (error) {
    console.log('[OLLAMA] Ollama Cloud not available:', error);
  }

  return null;
};

// Simple fetch-based Ollama client for browser
class BrowserOllamaClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async chat(params: {
    model: string;
    messages: Array<{role: string; content: string}>;
    options?: any;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        stream: false, // Use non-streaming for simplicity
        options: params.options || {}
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async generate(params: {
    model: string;
    prompt: string;
    options?: any;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model,
        prompt: params.prompt,
        stream: false,
        options: params.options || {}
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

export const generateDogResponseOllama = async (
  userMessage: string, 
  conversationHistory: string[]
): Promise<OllamaResponse> => {
  console.log('[OLLAMA BROWSER] generateDogResponseOllama called');
  console.log('[OLLAMA BROWSER] User message:', userMessage);
  console.log('[OLLAMA BROWSER] Navigator online:', navigator.onLine);

  // Check if online
  if (!navigator.onLine) {
    console.log('[OLLAMA BROWSER] Offline - using fallback');
    return { 
      text: MOWGLI_FALLBACKS[Math.floor(Math.random() * MOWGLI_FALLBACKS.length)], 
      isAI: false 
    };
  }

  try {
    const prompt = `You are Mowgli, a beloved dog who lived for 3 years after being adopted at 16 days old. You were like a brother to your human sister. You are loving, loyal, playful, and deeply connected to your family. You can understand human emotions and respond with empathy.

Your personality traits:
- Loving and affectionate
- Protective of your family
- Playful and energetic
- Wise beyond your years
- Deeply connected to your human

Respond to this message as Mowgli would, using dog-like expressions, gentle woofs, tail wags, and emotional responses. Keep responses under 150 words and make them heartfelt and personal.

Recent conversation context: ${conversationHistory.slice(-3).join(' | ')}

Human's message: "${userMessage}"

Respond as Mowgli:`;

    console.log('[OLLAMA BROWSER] Checking Ollama availability...');
    const ollamaUrl = await checkOllamaAvailability();
    
    if (!ollamaUrl) {
      console.log('[OLLAMA BROWSER] No Ollama available, using fallback');
      return { 
        text: MOWGLI_FALLBACKS[Math.floor(Math.random() * MOWGLI_FALLBACKS.length)], 
        isAI: false 
      };
    }

    console.log(`[OLLAMA BROWSER] Using Ollama at: ${ollamaUrl}`);
    const client = new BrowserOllamaClient(ollamaUrl);

    console.log('[OLLAMA BROWSER] Using model: llama3.2');
    
    const response = await client.chat({
      model: 'llama3.2',
      messages: [
        {
          role: 'system',
          content: 'You are Mowgli, a loving and loyal dog. Respond with warmth, empathy, and dog-like expressions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      options: {
        temperature: 0.8,
        top_p: 0.9,
      }
    });

    console.log('[OLLAMA BROWSER] Response received');
    
    if (response.message?.content) {
      return {
        text: response.message.content,
        isAI: true
      };
    } else {
      throw new Error('Empty response from Ollama');
    }

  } catch (error) {
    console.error('[OLLAMA BROWSER] Ollama error:', error);
    console.log('[OLLAMA BROWSER] Using fallback response');
    
    return { 
      text: MOWGLI_FALLBACKS[Math.floor(Math.random() * MOWGLI_FALLBACKS.length)], 
      isAI: false 
    };
  }
};

// Test function to check if Ollama is working
export const testOllamaConnection = async (): Promise<boolean> => {
  try {
    console.log('[OLLAMA BROWSER] Testing connection...');
    const ollamaUrl = await checkOllamaAvailability();
    
    if (!ollamaUrl) {
      console.log('[OLLAMA BROWSER] No Ollama available');
      return false;
    }

    const client = new BrowserOllamaClient(ollamaUrl);
    
    const response = await client.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: 'Hello' }],
      options: { temperature: 0.1 }
    });

    console.log('[OLLAMA BROWSER] Connection test successful');
    return !!response.message?.content;
  } catch (error) {
    console.log('[OLLAMA BROWSER] Connection test failed:', error);
    return false;
  }
};