import ollama from 'ollama';

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

export interface OllamaResponse {
  text: string;
  isAI: boolean;
}

// Configure Ollama client
const getOllamaClient = () => {
  try {
    // Try local Ollama first (default: http://localhost:11434)
    return new ollama.Ollama({ host: 'http://localhost:11434' });
  } catch (error) {
    console.log('Local Ollama not available:', error);
    return null;
  }
};

// Try Ollama Cloud as backup
const getOllamaCloudClient = () => {
  try {
    return new ollama.Ollama({ host: 'https://ollama.com' });
  } catch (error) {
    console.log('Ollama Cloud not available:', error);
    return null;
  }
};

export const generateDogResponseOllama = async (
  userMessage: string, 
  conversationHistory: string[]
): Promise<OllamaResponse> => {
  console.log('[OLLAMA SERVICE] generateDogResponseOllama called');
  console.log('[OLLAMA SERVICE] User message:', userMessage);
  console.log('[OLLAMA SERVICE] Navigator online:', navigator.onLine);

  // Check if online
  if (!navigator.onLine) {
    console.log('[OLLAMA SERVICE] Offline - using fallback');
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

    console.log('[OLLAMA SERVICE] Trying local Ollama first...');
    let client = getOllamaClient();
    
    if (!client) {
      console.log('[OLLAMA SERVICE] Local Ollama not available, trying Ollama Cloud...');
      client = getOllamaCloudClient();
    }

    if (!client) {
      throw new Error('No Ollama client available');
    }

    console.log('[OLLAMA SERVICE] Using model: llama3.2');
    
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

    console.log('[OLLAMA SERVICE] Response received');
    
    if (response.message?.content) {
      return {
        text: response.message.content,
        isAI: true
      };
    } else {
      throw new Error('Empty response from Ollama');
    }

  } catch (error) {
    console.error('[OLLAMA SERVICE] Ollama error:', error);
    console.log('[OLLAMA SERVICE] Using fallback response');
    
    return { 
      text: MOWGLI_FALLBACKS[Math.floor(Math.random() * MOWGLI_FALLBACKS.length)], 
      isAI: false 
    };
  }
};

// Test function to check if Ollama is working
export const testOllamaConnection = async (): Promise<boolean> => {
  try {
    console.log('[OLLAMA SERVICE] Testing connection...');
    const client = getOllamaClient() || getOllamaCloudClient();
    
    if (!client) {
      console.log('[OLLAMA SERVICE] No Ollama client available');
      return false;
    }

    const response = await client.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: 'Hello' }],
      options: { temperature: 0.1 }
    });

    console.log('[OLLAMA SERVICE] Connection test successful');
    return !!response.message?.content;
  } catch (error) {
    console.log('[OLLAMA SERVICE] Connection test failed:', error);
    return false;
  }
};