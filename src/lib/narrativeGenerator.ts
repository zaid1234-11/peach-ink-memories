/**
 * Narrative Generator - Orchestrates the two-stage AI pipeline
 */

import { breakdownText, type SceneBreakdown } from './sceneBreakdown';
import { generateReceiptImage, type GenerationOptions } from './receiptImageGeneration';

export interface NarrativeScene {
    id: string;
    description: string;
    imageUrl: string;
    order: number;
}

export interface NarrativeMemory {
    id: string;
    originalText: string;
    tone: string;
    scenes: NarrativeScene[];
    createdAt: string;
}

export interface GenerationProgress {
    stage: 'breakdown' | 'image-generation' | 'complete';
    current: number;
    total: number;
    message: string;
}

export type ProgressCallback = (progress: GenerationProgress) => void;

/**
 * Main orchestrator: Generates complete narrative memory with receipt images
 */
export async function generateNarrativeMemory(
    text: string,
    imageCount: number,
    options: GenerationOptions = {},
    onProgress?: ProgressCallback
): Promise<NarrativeMemory> {
    const memoryId = `memory-${Date.now()}`;

    try {
        // Stage 1: Scene Breakdown
        onProgress?.({
            stage: 'breakdown',
            current: 0,
            total: imageCount,
            message: 'Breaking down your story into visual scenes...',
        });

        const breakdown: SceneBreakdown = await breakdownText(text, {
            sceneCount: imageCount,
        });

        console.log("Scene breakdown complete:", breakdown);

        //Stage 2: Generate Receipt Images
        const scenes: NarrativeScene[] = [];

        for (let i = 0; i < breakdown.scenes.length; i++) {
            const scene = breakdown.scenes[i];

            onProgress?.({
                stage: 'image-generation',
                current: i + 1,
                total: imageCount,
                message: `Generating receipt #${i + 1} of ${imageCount}...`,
            });

            try {
                const imageUrl = await generateReceiptImage(scene.description, options);

                scenes.push({
                    id: scene.id,
                    description: scene.description,
                    imageUrl,
                    order: scene.order,
                });
            } catch (error) {
                console.error(`Failed to generate image for scene ${i + 1}:`, error);
                // Continue with other scenes even if one fails
            }
        }

        // Complete
        onProgress?.({
            stage: 'complete',
            current: imageCount,
            total: imageCount,
            message: 'Your memory is ready!',
        });

        const memory: NarrativeMemory = {
            id: memoryId,
            originalText: text,
            tone: breakdown.tone,
            scenes,
            createdAt: new Date().toISOString(),
        };

        // Save to localStorage
        saveMemory(memory);

        return memory;
    } catch (error) {
        console.error("Narrative generation failed:", error);
        throw error;
    }
}

/**
 * Save memory to localStorage
 */
function saveMemory(memory: NarrativeMemory): void {
    try {
        const existingMemories = JSON.parse(
            localStorage.getItem("peach-memories") || "[]"
        );
        const updatedMemories = [memory, ...existingMemories].slice(0, 50);
        localStorage.setItem("peach-memories", JSON.stringify(updatedMemories));
    } catch (error) {
        console.error("Failed to save memory:", error);
    }
}

/**
 * Retrieve all saved memories
 */
export function getSavedMemories(): NarrativeMemory[] {
    try {
        return JSON.parse(localStorage.getItem("peach-memories") || "[]");
    } catch (error) {
        console.error("Failed to load memories:", error);
        return [];
    }
}
