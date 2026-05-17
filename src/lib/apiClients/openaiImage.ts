/**
 * OpenAI DALL-E Image Generation Client
 */

export interface OpenAIImageConfig {
    apiKey: string;
    model?: string;
}

const DEFAULT_IMAGE_MODEL = "dall-e-3";

export class OpenAIImageClient {
    private apiKey: string;
    private model: string;
    private baseUrl = "https://api.openai.com/v1";

    constructor(config: OpenAIImageConfig) {
        this.apiKey = config.apiKey;
        this.model = config.model || DEFAULT_IMAGE_MODEL;
    }

    async generateImage(prompt: string): Promise<string> {
        try {
            console.log(`Generating image with OpenAI ${this.model}...`);

            const response = await fetch(`${this.baseUrl}/images/generations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024",
                    quality: "standard",
                    style: "natural", // Use natural for receipt-style art
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenAI Image API error: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            const imageUrl = data.data[0].url;

            // Convert URL to blob and then to data URL for local storage
            const imageBlob = await fetch(imageUrl).then(r => r.blob());
            return await blobToDataUrl(imageBlob);
        } catch (error) {
            console.error("OpenAI image generation error:", error);
            throw error;
        }
    }
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function getOpenAIImageClient(): OpenAIImageClient | null {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("No OpenAI API key configured");
        return null;
    }

    return new OpenAIImageClient({ apiKey });
}
