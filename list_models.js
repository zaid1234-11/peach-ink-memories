
const apiKey = "AIzaSyBaGUErBF_oYbL1omSRdzMgl81Idjf3VAM";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(model => {
                if (model.name.includes("imagen") || model.supportedGenerationMethods.includes("predict")) {
                    console.log(`- ${model.name}`);
                    console.log(`  Supported methods: ${model.supportedGenerationMethods}`);
                }
            });
            // Log all for good measure if filter misses
            // console.log(JSON.stringify(data, null, 2));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
