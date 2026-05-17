/**
 * Receipt Image Generation Service
 * Stage 2 of the two-stage AI narrative system
 */

import { GeminiImagenClient, getGeminiImagenClient } from './apiClients/geminiImagen';
import { PuterAIClient, getPuterAIClient } from './apiClients/puter';
import { OpenAIImageClient, getOpenAIImageClient } from './apiClients/openaiImage';
import { BytezClient, getBytezClient } from './apiClients/bytez';
import { GoogleAIStudioClient, getGoogleAIStudioClient } from './apiClients/googleAIStudio';

export type StyleIntensity = 'minimal' | 'medium' | 'detailed';
export type ImageProvider = 'google-ai-studio' | 'bytez' | 'openai-image' | 'puter' | 'gemini' | 'backend' | 'demo';

// ... (rest of imports/types)

export interface GenerationOptions {
    provider?: ImageProvider;
    styleIntensity?: StyleIntensity;
}

/**
 * Receipt-style prompt templates for different intensity levels
 */
const STYLE_TEMPLATES: Record<StyleIntensity, (scene: string) => string> = {
    minimal: (scene) =>
        `${scene}, simple black ink line sketch on thermal receipt paper, minimalist doodle, photorealistic receipt texture, top-down view, warm lighting`,

    medium: (scene) =>
        `${scene}, minimalist black ink hand-drawn doodle on realistic thermal receipt paper, simple emotional line art, warm desk lamp lighting, top-down photography, subtle grain texture, soft shadows, intimate aesthetic`,

    detailed: (scene) =>
        `${scene}, detailed black ink sketch on photorealistic thermal receipt, professional hand-drawn doodle art, warm ambient lighting from desk lamp, top-down realistic photography, paper grain texture, soft natural shadows, 3D perspective, intimate and personal aesthetic, not cartoon, not digital art`,
};

/**
 * Generates a receipt-style doodle image from a scene description
 */
export async function generateReceiptImage(
    sceneDescription: string,
    options: GenerationOptions = {}
): Promise<string> {
    const {
        provider = (import.meta.env.VITE_IMAGE_PROVIDER as ImageProvider) || 'demo',
        styleIntensity = (import.meta.env.VITE_STYLE_INTENSITY as StyleIntensity) || 'minimal',
    } = options;

    // Build the full prompt
    const styleTemplate = STYLE_TEMPLATES[styleIntensity];
    const fullPrompt = styleTemplate(sceneDescription);

    console.log("Generating receipt image with prompt:", fullPrompt);

    try {
        switch (provider) {
            case 'google-ai-studio':
                return await generateWithGoogleAIStudio(fullPrompt);

            case 'bytez':
                return await generateWithBytez(fullPrompt);

            case 'openai-image':
                return await generateWithOpenAIImage(fullPrompt);

            case 'puter':
                return await generateWithPuter(fullPrompt);

            case 'gemini':
                return await generateWithGeminiDirect(fullPrompt);

            case 'backend':
                return await generateWithBackend(fullPrompt);

            case 'demo':
            default:
                return await generateDemoImage(sceneDescription);
        }
    } catch (error) {
        console.error("Image generation failed:", error);
        // Fallback to demo
        return await generateDemoImage(sceneDescription);
    }
}

/**
 * Generate using OpenAI DALL-E 3
 */
async function generateWithOpenAIImage(prompt: string): Promise<string> {
    const client = getOpenAIImageClient();

    if (!client) {
        throw new Error("OpenAI API key not configured");
    }

    // specific prompt tweaks for DALL-E
    const enhancedPrompt = `${prompt}. Minimalist, black ink on white paper, no background context.`;
    return await client.generateImage(enhancedPrompt);
}

/**
 * Generate using Gemini Imagen via backend proxy
 */
async function generateWithBackend(prompt: string): Promise<string> {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const response = await fetch(`${backendUrl}/api/generate-image`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success || !data.image) {
        throw new Error('No image generated');
    }

    return data.image;
}

/**
 * Generate using Puter AI (free, serverless)
 */
async function generateWithPuter(prompt: string): Promise<string> {
    const client = getPuterAIClient();

    if (!client) {
        throw new Error("Puter.js not loaded. Add script tag to index.html");
    }

    // Add receipt-specific guidance
    const enhancedPrompt = `${prompt}. Style: minimalist black and white sketch, monochrome, no colors, simple line art`;

    return await client.generateImage(enhancedPrompt);
}

/**
 * Generate using Gemini Imagen directly (client-side)
 */
async function generateWithGeminiDirect(prompt: string): Promise<string> {
    const client = getGeminiImagenClient();

    if (!client) {
        throw new Error("Gemini Imagen client not configured");
    }

    // Add negative prompt guidance
    const enhancedPrompt = `${prompt}. Avoid: cartoon, anime, colorful, saturated, CGI, text, words`;

    return await client.generateImage(enhancedPrompt);
}

/**
 * Demo/fallback: Returns a placeholder image
 * In production, this could return Unsplash images or placeholder receipts
 */
async function generateDemoImage(scene: string): Promise<string> {
    // Generate a placeholder with scene info
    // For now, return a random Unsplash image related to the scene keywords
    const keywords = extractKeywords(scene);
    const query = keywords.join(',') || 'minimalist,sketch';

    return `https://source.unsplash.com/800x1000/?${query},monochrome,minimal`;
}

/**
 * Extract keywords from scene description for demo images
 */
function extractKeywords(scene: string): string[] {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);

    return scene
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.has(word))
        .slice(0, 3);
}

/**
 * Generate using Bytez.js
 */
async function generateWithBytez(prompt: string): Promise<string> {
    const client = getBytezClient();

    if (!client) {
        throw new Error("Bytez API key not configured");
    }

    // Bytez expects prompt, and maybe a seed or other params
    // DALL-E 3 on Bytez might need specific prompting
    return await client.generateImage(prompt);
}

/**
 * Generate using Google AI Studio (Imagen 3)
 */
async function generateWithGoogleAIStudio(prompt: string): Promise<string> {
    const client = getGoogleAIStudioClient();

    if (!client) {
        throw new Error("Gemini API key not configured for Google AI Studio");
    }

    // Enhance prompt for Imagen
    const enhancedPrompt = `${prompt}. High contrast, sharp lines, minimalist receipt art.`;
    return await client.generateImage(enhancedPrompt);
}
