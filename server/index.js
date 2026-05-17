import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Peach Paper API Server - Gemini Imagen', model: 'imagen-3.0-generate-001' });
});

app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Missing GEMINI_API_KEY in server/.env',
    });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key=${GEMINI_API_KEY}`;
  console.log(`Generating image via ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        numberOfImages: 1,
        aspectRatio: '3:4',  // Portrait for receipts
        safetyFilterLevel: 'block_only_high',
        personGeneration: 'allow_adult',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini Imagen API error:', response.status, errorText);
      return res.status(500).json({
        success: false,
        error: `Gemini Imagen API error (${response.status}): ${errorText || response.statusText}`,
      });
    }

    const data = await response.json();
    if (!data.generatedImages || data.generatedImages.length === 0) {
      return res.status(500).json({ success: false, error: 'No images generated' });
    }

    const base64Image = data.generatedImages[0].imageBytes;
    return res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Peach Paper API Server (Gemini Imagen) running on http://localhost:${PORT}`);
  console.log(`Frontend CORS enabled for http://localhost:8080 & 5173`);
});
