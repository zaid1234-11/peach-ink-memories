/**
 * Bytez.js LLM Client for Scene Breakdown
 */
import Bytez from "bytez.js";

export interface BytezLLMConfig {
    apiKey: string;
    model?: string;
}

export interface BytezLLMResponse {
    tone: string;
    scenes: Array<{
        id: string;
        description: string;
        order: number;
    }>;
}

const DEFAULT_BYTEZ_LLM_MODEL = "openai/gpt-5.2";

export class BytezLLMClient {
    private client: any;
    private modelName: string;

    constructor(config: BytezLLMConfig) {
        this.client = new Bytez(config.apiKey);
        this.modelName = config.model || DEFAULT_BYTEZ_LLM_MODEL;
    }

    async generateSceneBreakdown(text: string, sceneCount: number): Promise<BytezLLMResponse> {
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
            console.log(`Generating scene breakdown with Bytez LLM (${this.modelName})...`);

            const model = this.client.model(this.modelName);
            const { error, output } = await model.run([
                {
                    "role": "system",
                    "content": systemPrompt
                },
                {
                    "role": "user",
                    "content": userPrompt
                }
            ]);

            if (error) {
                throw new Error(`Bytez API error: ${JSON.stringify(error)}`);
            }

            if (!output) {
                throw new Error("No output received from Bytez");
            }

            // Output from chat models is usually a string or an object with message content
            console.log("Bytez LLM output:", output);

            let content = "";

            // Handle different potential output formats
            if (typeof output === 'string') {
                content = output;
            } else if (Array.isArray(output) && output.length > 0) {
                // Check if it's an array of choice objects or strings
                const firstChoice = output[0];
                if (typeof firstChoice === 'string') {
                    content = firstChoice;
                } else if (typeof firstChoice === 'object' && firstChoice.message && firstChoice.message.content) {
                    content = firstChoice.message.content;
                } else if (typeof firstChoice === 'object' && firstChoice.text) {
                    content = firstChoice.text;
                } else {
                    content = JSON.stringify(output);
                }
            } else if (typeof output === 'object') {
                // Check common response formats
                if ((output as any).message && (output as any).message.content) {
                    content = (output as any).message.content;
                } else if ((output as any).content) {
                    content = (output as any).content;
                } else if ((output as any).text) {
                    content = (output as any).text;
                } else {
                    content = JSON.stringify(output);
                }
            }

            // Extract JSON from content (it might be wrapped in markdown code blocks)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error(`Could not find JSON in response: ${content.substring(0, 100)}...`);
            }

            const result = JSON.parse(jsonMatch[0]);

            // Validate response structure
            if (!result.tone || !result.scenes || !Array.isArray(result.scenes)) {
                throw new Error("Invalid response format from Bytez LLM");
            }

            return result;

        } catch (error) {
            console.error("Bytez scene breakdown error:", error);
            throw error;
        }
    }
}

export function getBytezLLMClient(): BytezLLMClient | null {
    const apiKey = import.meta.env.VITE_BYTEZ_API_KEY;

    if (!apiKey) {
        console.warn("No Bytez API key configured");
        return null;
    }

    return new BytezLLMClient({ apiKey });
}
