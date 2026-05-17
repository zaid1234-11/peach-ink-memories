import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ResultsGallery, { type GeneratedImage } from "./ResultsGallery";
import { generateNarrativeMemory, type GenerationProgress } from "../lib/narrativeGenerator";

const InputSection = () => {
  const [text, setText] = useState("");
  const [imageCount, setImageCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please paste a line first.");
      return;
    }

    setIsLoading(true);
    setProgress(null);
    setGeneratedImages([]);

    try {
      // Generate narrative memory using two-stage AI pipeline
      const memory = await generateNarrativeMemory(
        text,
        imageCount,
        {}, // Use default options from env
        (progressUpdate) => {
          setProgress(progressUpdate);
          console.log("Progress:", progressUpdate);
        }
      );

      // Convert narrative scenes to GeneratedImage format
      const images: GeneratedImage[] = memory.scenes.map((scene) => ({
        id: scene.id,
        url: scene.imageUrl,
        prompt: scene.description,
      }));

      setGeneratedImages(images);
      setIsLoading(false);
      setProgress(null);

      toast.success(
        `${imageCount} ${imageCount === 1 ? "memory" : "memories"} ${memory.tone ? `(${memory.tone})` : ""
        } printed and saved!`
      );

      // Scroll to gallery after short delay
      setTimeout(() => {
        galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (error) {
      console.error("Generation failed:", error);
      setIsLoading(false);
      setProgress(null);
      toast.error("Failed to generate memories. Please try again.");
    }
  };

  const handleClear = () => {
    setGeneratedImages([]);
  };

  return (
    <>
      <section className="relative py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg mx-auto"
        >
          <motion.div
            className="glass-strong rounded-2xl p-8 sm:p-10 shadow-card border border-border/50"
            whileHover={{ scale: 1.01, boxShadow: "var(--shadow-glow)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="font-serif text-2xl sm:text-3xl text-foreground text-center mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Memory
            </motion.h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Paste the words that still echo, and we'll turn them into art.
            </p>

            {/* Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the line that still lives in your head…"
              className="w-full h-32 px-4 py-3 rounded-xl bg-background/80 border-2 border-border text-foreground placeholder:text-muted-foreground/60 font-sans text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-inner-soft"
            />

            {/* Image count pills */}
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Number of images
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <motion.button
                    key={n}
                    onClick={() => setImageCount(n)}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${imageCount === n
                      ? "bg-primary text-primary-foreground shadow-soft scale-110"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Progress Indicator */}
            <AnimatePresence>
              {progress && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="bg-background/60 rounded-lg p-4 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">
                        {progress.stage === 'breakdown' && '📖 Stage 1: Scene Breakdown'}
                        {progress.stage === 'image-generation' && '🎨 Stage 2: Generating Receipts'}
                        {progress.stage === 'complete' && '✅ Complete!'}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {progress.current}/{progress.total}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {progress.message}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate button */}
            <motion.button
              onClick={handleGenerate}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
              className="w-full mt-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-serif text-base tracking-wide shadow-soft transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow relative overflow-hidden"
            >
              {/* Button shine effect */}
              {!isLoading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Printing...
                </span>
              ) : (
                <span className="relative z-10">Print My Memories</span>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Results gallery */}
      <div ref={galleryRef}>
        <ResultsGallery images={generatedImages} onClear={handleClear} />
      </div>
    </>
  );
};

export default InputSection;
