/**
 * OpenAI API Client for Scene Breakdown
 */

export interface OpenAIConfig {
    apiKey: string;
    model?: string;
}

export interface OpenAIResponse {
    tone: string;
    scenes: Array<{
        id: string;
        description: string;
        order: number;
    }>;
}

const DEFAULT_MODEL = "gpt-5.2"; // Latest 2026 flagship model

export class OpenAIClient {
    private apiKey: string;
    private model: string;
    private baseUrl = "https://api.openai.com/v1";

    constructor(config: OpenAIConfig) {
        this.apiKey = config.apiKey;
        this.model = config.model || DEFAULT_MODEL;
    }

    async generateSceneBreakdown(text: string, sceneCount: number): Promise<OpenAIResponse> {
        const systemPrompt = `You are an AI that analyzes emotional text and breaks it down into visual scenes for artistic illustration.

Your task:
1. Detect the overall emotional tone (romantic, heartbreak, nostalgia, longing, joy, neutral)
2. Break the text into ${sceneCount} distinct visual scenes that tell a narrative story
3. Each scene should be a vivid, visual description suitable for image generation

Return ONLY valid JSON in this exact format:
{
  "tone": "emotional_tone",
  "scenes": [
    {"id": "1", "description": "visual description", "order": 1},
    {"id": "2", "description": "visual description", "order": 2}
  ]
}`;

        const userPrompt = `Analyze this emotional text and create ${sceneCount} visual scenes:\n\n"${text}"`;

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            const result = JSON.parse(content);

            // Validate response structure
            if (!result.tone || !result.scenes || !Array.isArray(result.scenes)) {
                throw new Error("Invalid response format from OpenAI");
            }

            return result;
        } catch (error) {
            console.error("OpenAI scene breakdown error:", error);
            throw error;
        }
    }
}

export function getOpenAIClient(): OpenAIClient | null {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("No OpenAI API key configured");
        return null;
    }

    return new OpenAIClient({ apiKey });
}
