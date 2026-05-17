/**
 * Bytez.js Image Generation Client
 */
import Bytez from "bytez.js";

export interface BytezConfig {
    apiKey: string;
    model?: string;
}

const DEFAULT_BYTEZ_MODEL = "openai/dall-e-3";

export class BytezClient {
    private client: any;
    private modelName: string;

    constructor(config: BytezConfig) {
        this.client = new Bytez(config.apiKey);
        this.modelName = config.model || DEFAULT_BYTEZ_MODEL;
    }

    async generateImage(prompt: string): Promise<string> {
        try {
            console.log(`Generating image with Bytez (${this.modelName})...`);

            const model = this.client.model(this.modelName);
            const { error, output } = await model.run(prompt);

            if (error) {
                throw new Error(`Bytez API error: ${JSON.stringify(error)}`);
            }

            if (!output) {
                throw new Error("No output received from Bytez");
            }

            // Check if output is a URL or base64
            // Usually Bytez returns an array of outputs or a single output depending on model
            // For dall-e-3 it likely returns a URL

            console.log("Bytez output:", output);

            // Access the first output if it's an array, or the output itself
            const result = Array.isArray(output) ? output[0] : output;

            // If it's an object with a url property
            if (typeof result === 'object' && result !== null && 'image' in result) {
                return result.image;
            }

            if (typeof result === 'string') {
                return result;
            }

            // Fallback: try to find any URL in the object
            if (typeof result === 'object') {
                const possibleUrl = Object.values(result).find(val =>
                    typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:'))
                );
                if (possibleUrl) return possibleUrl as string;
            }

            throw new Error(`Unknown output format from Bytez: ${JSON.stringify(output)}`);

        } catch (error) {
            console.error("Bytez generation error:", error);
            throw error;
        }
    }
}

export function getBytezClient(): BytezClient | null {
    const apiKey = import.meta.env.VITE_BYTEZ_API_KEY;

    if (!apiKey) {
        console.warn("No Bytez API key configured");
        return null;
    }

    return new BytezClient({ apiKey });
}
