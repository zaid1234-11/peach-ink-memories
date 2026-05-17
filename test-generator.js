// Quick test to verify the narrative generator works
import { generateNarrativeMemory } from './src/lib/narrativeGenerator';

console.log('Testing narrative generator...');

generateNarrativeMemory(
    "When I'm away, I'll remember how you kissed me",
    3,
    {},
    (progress) => {
        console.log('Progress:', progress);
    }
).then(memory => {
    console.log('SUCCESS! Generated memory:', memory);
    console.log('Tone:', memory.tone);
    console.log('Scenes:', memory.scenes.length);
}).catch(error => {
    console.error('ERROR:', error);
});
