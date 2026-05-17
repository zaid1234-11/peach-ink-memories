/**
 * Google AI Studio (Imagen 3) Client
 * Uses the Generative Language API directly
 */

export interface GoogleAIStudioConfig {
    apiKey: string;
    model?: string;
}

const DEFAULT_MODEL = "imagen-4.0-generate-001"; // Updated to latest available model

export class GoogleAIStudioClient {
    private apiKey: string;
    private model: string;
    private baseUrl = "https://generativelanguage.googleapis.com/v1beta";

    constructor(config: GoogleAIStudioConfig) {
        this.apiKey = config.apiKey;
        this.model = config.model || DEFAULT_MODEL;
    }

    async generateImage(prompt: string): Promise<string> {
        try {
            console.log(`Generating image with Google AI Studio (${this.model})...`);

            const url = `${this.baseUrl}/models/${this.model}:predict?key=${this.apiKey}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    instances: [
                        { prompt: prompt }
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "1:1"
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Google AI Studio API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            // Check for predictions
            if (!data.predictions || data.predictions.length === 0) {
                throw new Error("No image predictions returned from Google AI Studio");
            }

            const prediction = data.predictions[0];

            // It often returns bytesBase64Encoded
            if (prediction.bytesBase64Encoded) {
                return `data:image/png;base64,${prediction.bytesBase64Encoded}`;
            }

            // Or sometimes it might be structured differently
            if (prediction.mimeType && prediction.bytesBase64Encoded) {
                return `data:${prediction.mimeType};base64,${prediction.bytesBase64Encoded}`;
            }

            throw new Error(`Unknown response format: ${JSON.stringify(prediction).substring(0, 100)}...`);

        } catch (error) {
            console.error("Google AI Studio image generation error:", error);
            throw error;
        }
    }
}

export function getGoogleAIStudioClient(): GoogleAIStudioClient | null {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("No Gemini API key configured for Google AI Studio");
        return null;
    }

    return new GoogleAIStudioClient({ apiKey });
}
