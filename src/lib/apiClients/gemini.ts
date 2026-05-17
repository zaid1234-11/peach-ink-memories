/**
 * Gemini API Client for Scene Breakdown
 */

export interface GeminiConfig {
    apiKey: string;
    model?: string;
}

export interface GeminiResponse {
    tone: string;
    scenes: Array<{
        id: string;
        description: string;
        order: number;
    }>;
}

const DEFAULT_MODEL = "gemini-1.5-flash";

export class GeminiClient {
    private apiKey: string;
    private model: string;
    private baseUrl = "https://generativelanguage.googleapis.com/v1beta";

    constructor(config: GeminiConfig) {
        this.apiKey = config.apiKey;
        this.model = config.model || DEFAULT_MODEL;
    }

    async generateSceneBreakdown(
        text: string,
        sceneCount: number
    ): Promise<GeminiResponse> {
        const prompt = this.buildPrompt(text, sceneCount);

        try {
            const response = await fetch(
                `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024,
                        },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.statusText}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0]?.content?.parts[0]?.text;

            if (!generatedText) {
                throw new Error("No response from Gemini");
            }

            // Parse JSON response
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Invalid JSON response from Gemini");
            }

            const parsed = JSON.parse(jsonMatch[0]) as GeminiResponse;
            return parsed;
        } catch (error) {
            console.error("Gemini API error:", error);
            throw error;
        }
    }

    private buildPrompt(text: string, sceneCount: number): string {
        return `You are a visual storytelling AI that converts emotional text into minimal, narrative visual scenes for receipt-style doodle art.

Analyze this text and break it down into exactly ${sceneCount} visual scene${sceneCount > 1 ? 's' : ''}.

RULES:
- Each scene should be a single, simple visual moment
- Create logical narrative progression
- Focus on minimalist, emotional imagery suitable for hand-drawn doodles
- Descriptions should be concrete and visual (not abstract)
- Keep each description under 20 words
- NO dialogue or text in scenes
- Suitable for simple black ink line art on receipt paper

TEXT TO ANALYZE:
"${text}"

Respond ONLY with valid JSON in this exact format:
{
  "tone": "romantic|heartbreak|nostalgia|longing|joy|melancholy|peaceful|hopeful",
  "scenes": [
    {"id": "1", "description": "simple visual description here", "order": 1},
    {"id": "2", "description": "next scene description", "order": 2}
    ${sceneCount > 2 ? '...' : ''}
  ]
}`;
    }
}

// Helper function to get configured Gemini client
export function getGeminiClient(): GeminiClient | null {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("No Gemini API key configured");
        return null;
    }

    return new GeminiClient({ apiKey });
}
