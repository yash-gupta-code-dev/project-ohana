// Simple Express server to proxy Ollama requests and avoid CORS issues
// Run with: node server/ollama-proxy.js

const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Ollama client
const ollama = new Ollama({ host: 'http://localhost:11434' });

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Ollama Proxy' });
});

// List available models
app.get('/api/models', async (req, res) => {
  try {
    const models = await ollama.list();
    res.json(models);
  } catch (error) {
    console.error('Error listing models:', error);
    res.status(500).json({ error: 'Failed to list models' });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages, options } = req.body;
    
    if (!model || !messages) {
      return res.status(400).json({ error: 'Model and messages are required' });
    }

    console.log(`[PROXY] Chat request for model: ${model}`);
    
    const response = await ollama.chat({
      model,
      messages,
      options: options || {}
    });

    res.json(response);
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ 
      error: 'Chat failed', 
      details: error.message 
    });
  }
});

// Generate endpoint (for completion)
app.post('/api/generate', async (req, res) => {
  try {
    const { model, prompt, options } = req.body;
    
    if (!model || !prompt) {
      return res.status(400).json({ error: 'Model and prompt are required' });
    }

    console.log(`[PROXY] Generate request for model: ${model}`);
    
    const response = await ollama.generate({
      model,
      prompt,
      options: options || {}
    });

    res.json(response);
  } catch (error) {
    console.error('Error in generate:', error);
    res.status(500).json({ 
      error: 'Generation failed', 
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🦙 Ollama Proxy Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   GET  /api/models - List available models`);
  console.log(`   POST /api/chat - Chat with a model`);
  console.log(`   POST /api/generate - Generate text`);
});

module.exports = app;