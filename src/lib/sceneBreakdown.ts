/**
 * Scene Breakdown Service
 * Stage 1 of the two-stage AI narrative system
 */

import { GeminiClient, getGeminiClient } from './apiClients/gemini';
import { OpenAIClient, getOpenAIClient } from './apiClients/openai';
import { BytezLLMClient, getBytezLLMClient } from './apiClients/bytezLLM';

export interface SceneBreakdown {
    tone: string;
    scenes: Array<{
        id: string;
        description: string;
        order: number;
    }>;
}

export interface BreakdownOptions {
    sceneCount: number;
    provider?: 'gemini' | 'openai' | 'bytez';
}

/**
 * Breaks down emotional text into visual scenes using LLM
 */
export async function breakdownText(
    text: string,
    options: BreakdownOptions
): Promise<SceneBreakdown> {
    const { sceneCount, provider = 'bytez' } = options;

    // Validate inputs
    if (!text || text.trim().length === 0) {
        throw new Error("Text cannot be empty");
    }

    if (sceneCount < 1 || sceneCount > 5) {
        throw new Error("Scene count must be between 1 and 5");
    }

    // Try AI-powered breakdown
    try {
        if (provider === 'bytez') {
            const client = getBytezLLMClient();
            if (client) {
                const result = await client.generateSceneBreakdown(text, sceneCount);
                return result;
            }
        }

        if (provider === 'openai') {
            const client = getOpenAIClient();
            if (client) {
                const result = await client.generateSceneBreakdown(text, sceneCount);
                return result;
            }
        }

        if (provider === 'gemini') {
            const client = getGeminiClient();
            if (client) {
                const result = await client.generateSceneBreakdown(text, sceneCount);
                return result;
            }
        }

        throw new Error(`Provider ${provider} not configured`);
    } catch (error) {
        console.error("Scene breakdown failed:", error);

        // Fallback to simple text splitting
        return fallbackBreakdown(text, sceneCount);
    }
}

/**
 * Fallback breakdown when AI fails
 * Simple sentence-based splitting with basic tone detection
 */
function fallbackBreakdown(text: string, sceneCount: number): SceneBreakdown {
    // Detect tone from keywords
    const lowerText = text.toLowerCase();
    let tone = "neutral";

    if (lowerText.match(/love|kiss|heart|together|forever/)) tone = "romantic";
    else if (lowerText.match(/lost|gone|miss|alone|empty/)) tone = "heartbreak";
    else if (lowerText.match(/remember|used to|back then|childhood/)) tone = "nostalgia";
    else if (lowerText.match(/wait|hope|someday|maybe/)) tone = "longing";
    else if (lowerText.match(/happy|smile|laugh|joy/)) tone = "joy";

    // Split text into sentences
    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // Distribute sentences across scenes
    const scenesPerSentence = Math.ceil(sentences.length / sceneCount);
    const scenes: SceneBreakdown['scenes'] = [];

    for (let i = 0; i < sceneCount; i++) {
        const startIdx = i * scenesPerSentence;
        const endIdx = Math.min(startIdx + scenesPerSentence, sentences.length);
        const sceneText = sentences.slice(startIdx, endIdx).join('. ');

        scenes.push({
            id: String(i + 1),
            description: sceneText || `Scene ${i + 1} from: ${text.slice(0, 50)}...`,
            order: i + 1,
        });
    }

    return { tone, scenes };
}
