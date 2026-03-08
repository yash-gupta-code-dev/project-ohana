# 🦙 Ollama Integration Guide for Project Ohana

This guide will help you set up Ollama as an alternative to Google Gemini for your AI chat functionality.

## **Option 1: Browser-Based Ollama (Recommended for Testing)**

### Step 1: Install Ollama
1. Download Ollama from https://ollama.com
2. Install it on your system (Windows/Mac/Linux)
3. Verify installation: Open terminal and run:
   ```bash
   ollama --version
   ```

### Step 2: Download a Model
Pull a lightweight model for testing:
```bash
ollama pull llama3.2
```

Or try other models:
```bash
ollama pull mistral        # Good general purpose
ollama pull llama2         # Popular choice
ollama pull deepseek-coder # For coding tasks
```

### Step 3: Test Ollama
Run a quick test:
```bash
ollama run llama3.2 "Hello, how are you?"
```

### Step 4: Update Your React App

1. **Import the Ollama service** in your DogChat component:

```typescript
// In DogChat.tsx, add this import:
import { generateDogResponseOllama } from '../services/ollamaBrowserService';

// Then modify your generateDogResponse function to use Ollama:
const generateDogResponse = async (userMessage: string): Promise<string> => {
  if (!isAIEnabled) {
    return getFallbackResponse(userMessage);
  }
  try {
    const conversationHistory = messages.map(msg => `${msg.sender}: ${msg.text}`);
    
    // Use Ollama instead of Gemini
    const response = await generateDogResponseOllama(userMessage, conversationHistory);
    return response.text;
  } catch (error) {
    console.error('AI response failed:', error);
    return getFallbackResponse(userMessage);
  }
};
```

2. **Test the connection** by adding a button to check if Ollama is working:

```typescript
// Add this test function to DogChat.tsx
const testOllama = async () => {
  try {
    const { testOllamaConnection } = await import('../services/ollamaBrowserService');
    const isWorking = await testOllamaConnection();
    alert(isWorking ? '✅ Ollama is working!' : '❌ Ollama not available');
  } catch (error) {
    alert('❌ Error testing Ollama: ' + error);
  }
};

// Add a test button in your JSX:
<button onClick={testOllama}>Test Ollama Connection</button>
```

## **Option 2: Backend Proxy Server (More Reliable)**

If you encounter CORS issues with the browser approach:

### Step 1: Install Dependencies
```bash
npm install express cors
```

### Step 2: Start the Proxy Server
```bash
node server/ollama-proxy.js
```

### Step 3: Update the Service
Modify `ollamaBrowserService.ts` to use the proxy:

```typescript
// Change the base URL from 'http://localhost:11434' to 'http://localhost:3001'
const checkOllamaAvailability = async (): Promise<string | null> => {
  try {
    // Try the proxy server first
    const proxyResponse = await fetch('http://localhost:3001/health');
    if (proxyResponse.ok) {
      return 'http://localhost:3001';
    }
  } catch (error) {
    console.log('[OLLAMA] Proxy not available, trying direct connection');
  }
  
  // Fall back to direct connection...
};
```

## **Option 3: Ollama Cloud (No Local Setup)**

If you don't want to install anything locally, you can use Ollama's cloud service:

1. Sign up at https://ollama.com
2. Get your API key
3. Update the service to use cloud endpoints
4. Models are hosted and managed for you

## **Testing Your Setup**

1. **Start Ollama**: Make sure Ollama is running locally
2. **Pull a model**: `ollama pull llama3.2`
3. **Start your app**: `npm run dev`
4. **Test the chat**: Send a message in the Mowgli chat
5. **Check console**: Look for Ollama logs in browser console

## **Troubleshooting**

### **CORS Issues**
- Use the proxy server (Option 2)
- Or install a CORS extension in your browser
- Or run Chrome with CORS disabled for development

### **Model Not Found**
- Make sure you pulled the model: `ollama pull llama3.2`
- Check available models: `ollama list`
- Try a different model: `ollama pull mistral`

### **Connection Refused**
- Ensure Ollama is running: `ollama serve`
- Check if port 11434 is available: `netstat -an | grep 11434`
- Restart Ollama: `ollama serve` (in a separate terminal)

### **Slow Responses**
- Use smaller models: `llama3.2` instead of `llama2`
- Reduce context size in the prompt
- Use the 1.5B parameter models for faster responses

## **Benefits of Ollama vs Google Gemini**

✅ **Completely Free** - No API keys or usage limits
✅ **Private** - All processing happens locally
✅ **Offline** - Works without internet connection
✅ **Customizable** - Choose from many models
✅ **No Rate Limits** - Chat as much as you want
✅ **Open Source** - Transparent and trustworthy

## **Popular Models to Try**

```bash
# Small & Fast
ollama pull llama3.2          # 3B params, fast
ollama pull mistral           # 7B params, balanced

# Medium Quality
ollama pull llama2            # 7B params, popular
ollama pull codellama         # Code-focused

# Large & Powerful (slower)
ollama pull llama2:13b        # 13B params
ollama pull mistral:7b        # 7B params, high quality
```

## **Next Steps**

1. **Choose your approach** (Browser, Proxy, or Cloud)
2. **Install Ollama** and pull a model
3. **Update your code** to use the Ollama service
4. **Test the integration**
5. **Customize prompts** for Mowgli's personality

The browser-based approach is easiest to start with, but the proxy server is more reliable for production use. Let me know which approach you'd like to try first!