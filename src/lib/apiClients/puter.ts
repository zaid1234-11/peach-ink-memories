/**
 * Puter.js AI Image Generation Client
 * Free, serverless AI image generation
 */

// @ts-ignore - Puter is loaded via CDN
declare const puter: any;

export interface PuterConfig {
    model?: string;
}

// Available models: 'gpt-image', 'dall-e-2', 'dall-e-3', 'flux-schnell', 'sd-xl', etc.
const DEFAULT_MODEL = 'gpt-image-2'; // Bleeding edge (2026)

export class PuterAIClient {
    private model: string;

    constructor(config: PuterConfig = {}) {
        this.model = config.model || DEFAULT_MODEL;
    }

    async generateImage(prompt: string): Promise<string> {
        try {
            console.log(`Generating image with Puter AI (${this.model})...`);
            return await this.tryGenerate(this.model, prompt);
        } catch (error) {
            console.warn(`Puter AI (${this.model}) failed, trying fallback models...`);

            // Fallback strategy: Latest -> Stable -> Legacy
            const fallbackModels = ['gpt-image-1.5', 'dall-e-3', 'flux-schnell'];

            for (const model of fallbackModels) {
                if (model === this.model) continue;

                try {
                    console.log(`Trying fallback model: ${model}`);
                    return await this.tryGenerate(model, prompt);
                } catch (e) {
                    console.warn(`Fallback model ${model} failed`, e);
                    // Continue to next model
                }
            }


            console.error("All Puter AI models failed:", JSON.stringify(error, null, 2));
            throw error;
        }
    }

    private async tryGenerate(model: string, prompt: string): Promise<string> {
        // Updated call based on user provided example
        console.log(`Calling Puter AI with model: ${model}`);

        // For gpt-image-1.5 and similar models
        const result = await puter.ai.txt2img(prompt);

        // Result can be an image element, URL, or object
        if (typeof result === 'string') {
            return result;
        }

        if (result instanceof HTMLImageElement) {
            return result.src;
        }

        if (result && result.src) {
            return result.src;
        }

        // If it's a blob/file object (common in puter.js v2)
        if (result instanceof Blob || (result as any) instanceof File) {
            return URL.createObjectURL(result);
        }

        if (typeof result === 'object') {
            // Try to find any property that looks like a URL
            const possibleUrl = Object.values(result).find(val =>
                typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:'))
            );
            if (possibleUrl) return possibleUrl as string;
        }

        throw new Error(`Unexpected Puter response format: ${typeof result}`);
    }
}

export function getPuterAIClient(): PuterAIClient {
    // Check if Puter is loaded
    if (typeof puter === 'undefined') {
        console.warn("Puter.js not loaded. Add script tag: <script src='https://js.puter.com/v2/'></script>");
        return null as any;
    }

    return new PuterAIClient();
}
