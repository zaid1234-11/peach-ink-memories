# 🚀 Peach & Paper - Backend Setup Guide

## Quick Start

Your Express backend is ready! This proxy server bypasses CORS and lets you use Hugging Face from the browser.

### Step 1: Install Backend Dependencies

```powershell
cd server
npm install
```

### Step 2: Configure Backend (Optional)

Create `server/.env` (optional - works without API key but has rate limits):

```env
PORT=3001
HUGGINGFACE_API_KEY=your_hf_token_here
HF_MODEL=black-forest-labs/FLUX.1-schnell
```

**To get Hugging Face token (Free):**
1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new token (Read access)
3. Paste into `server/.env`

### Step 3: Start Backend Server

```powershell
# From peach-ink-memories/server directory
npm start
```

You should see:
```
🚀 Peach & Paper API Server running on http://localhost:3001
📡 Frontend CORS enabled for http://localhost:8080
```

### Step 4: Keep Frontend Running

In **another terminal** (keep backend running!):

```powershell
# From peach-ink-memories directory
npm run dev
```

### Step 5: Test It!

1. Go to http://localhost:8080/
2. Enter: "When I'm away, I'll remember how you kissed me"
3. Select 3 images
4. Click "Print My Memories"

**You should now see REAL AI-generated receipt images!** 🎨✨

---

## Architecture

```
Frontend (React/Vite)           Backend (Express)           Hugging Face API
http://localhost:8080     →    http://localhost:3001   →   api-inference.huggingface.co
                                (Proxy server)
                               (Bypasses CORS)
```

---

## Troubleshooting

**Backend won't start:**
- Make sure you ran `npm install` in the `server` directory
- Check if port 3001 is already in use

**Images still not generating:**
- Make sure BOTH servers are running (frontend AND backend)
- Check browser console for errors
- Verify `.env.local` has `VITE_IMAGE_PROVIDER=huggingface`

**Slow generation:**
- Normal! Hugging Face free tier can be slow
- First image takes longest (model loading)
- Add HF API token for faster generation

---

## What You Have Now

✅ **Stage 1**: Gemini scene breakdown (working!)  
✅ **Stage 2**: Real AI receipt generation via backend proxy  
✅ **No CORS errors**: Backend handles all API calls  
✅ **Secure**: API keys stay on server, not exposed to browser  

**Your full two-stage AI narrative system is complete!** 🎉
