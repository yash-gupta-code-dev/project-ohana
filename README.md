
# Project Rashi: Technical Implementation Guide

Welcome to your high-end digital scrapbook. This project is built using a modern stack (React, Three.js, Framer Motion) and is optimized for the **Gemini 3** AI series.

## 🚀 Deployment Checklist

### 1. API Key Setup
The application requires a valid Google Gemini API Key to power Stitch's "Cloud Brain".
- **Local Development:** The key is provided via `process.env.API_KEY`. 
- **Production:** In most deployment environments (Vercel, Netlify), you must add `API_KEY` to your Environment Variables dashboard.
- **Security:** Ensure the API key is restricted in the Google Cloud Console to only the models used (`gemini-3-flash-preview` and `gemini-3-pro-preview`).

### 2. Admin Integration (CMS)
The file `data/config.ts` acts as the single source of truth for the entire UI.
- **To make it dynamic:** Wrap the `App.tsx` logic in an API fetch call.
- **Example:**
```typescript
useEffect(() => {
  fetch('https://your-admin-cms.com/api/ohana-config')
    .then(res => res.json())
    .then(data => setConfig(data));
}, []);
```

## 🔋 Offline & Reliability Features

### The Hybrid Brain
- **Detection:** Uses `navigator.onLine` to check network status.
- **Cloud Mode:** Queries Gemini 3 for context-aware, creative responses.
- **Local Mode:** If offline or the API fails (e.g., quota exceeded), a heuristic engine provides randomized "Stitch-isms" to ensure the experience never breaks.

### Performance Optimization
- **Asset Loading:** Images are pulled from Unsplash but can be replaced with optimized WebP versions in the config.
- **3D Management:** The `StitchMascot` uses Three.js primitives for zero-latency loading and low GPU overhead compared to complex GLTF models.

## 🎨 Customization Guide

### Changing the Vibe
Modify `data/config.ts` to change:
- **The Story:** Update `landing.heroText` and `finale.letterContext`.
- **The Game:** Add more items to `gallery.hiddenItems` (ensure icons are emojis or Lucide icons).
- **The AI Persona:** Tweak `lab.systemInstruction` to change how Stitch talks (e.g., more alien, more English, more sassy).

### Adding New Memories
Simply add a new object to the `gallery.photos` array in `config.ts`. The masonry layout will automatically adjust.

---
*Created with love for the Ohana.*
