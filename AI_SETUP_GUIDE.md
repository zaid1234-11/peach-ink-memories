# AI Setup Guide

## Complete Two-Stage AI System

Your app now supports multiple AI providers for both stages!

---

## 🎯 Current Configuration

### Stage 1: Scene Breakdown
**Provider:** OpenAI GPT-4
- Analyzes emotional text
- Detects tone (romantic, heartbreak, nostalgia, etc.)
- Creates visual scene descriptions

### Stage 2: Image Generation  
**Provider:** Puter.js AI
- FREE, serverless AI image generation
- Multiple models: DALL-E 3, Flux.1, Stable Diffusion XL
- No API keys needed (user-pays model)

---

## 🔑 API Keys Needed

### OpenAI API Key (Required for Stage 1)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env.local`:
   ```env
   VITE_OPENAI_API_KEY=sk-proj-...
   ```

**Cost:** ~$0.0001-0.001 per scene breakdown (very cheap!)

### Puter.js (Stage 2)
✅ **No API key needed!** Works automatically.

---

## 🔄 Alternative Providers

### Stage 1 Options:
- **OpenAI GPT-4** (current) - Best quality, ~$0.001/request
- **Gemini** (free!) - Good quality, free tier available
  ```env
  VITE_LLM_PROVIDER=gemini
  VITE_GEMINI_API_KEY=your_key_here
  ```

### Stage 2 Options:
- **Puter.js** (current) - FREE, multiple models
- **Backend proxy** - For custom image APIs
- **Demo mode** - Unsplash placeholders

---

## 🚀 Getting Started

1. **Get OpenAI API Key** from https://platform.openai.com/api-keys
2. **Update `.env.local`:**
   ```env
   VITE_OPENAI_API_KEY=sk-proj-your_key_here
   ```
3. **Restart dev server** (if running)
4. **Test the app:**
   - Enter emotional text
   - Click "Print My Memories"
   - Puter will ask for permission (first time only)
   - Watch your two-stage AI system work! 🎨

---

## 💰 Cost Breakdown

**Per Memory Generation:**
- Stage 1 (OpenAI): ~$0.0001-0.001
- Stage 2 (Puter): FREE (user pays for their own usage)

**Total: Almost free!** 🎉

For Gemini instead (completely free), change provider in `.env.local`.
