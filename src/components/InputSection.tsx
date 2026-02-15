import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ResultsGallery, { type GeneratedImage } from "./ResultsGallery";

// Demo placeholder images for preview (will be replaced by real AI output)
const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
];

const InputSection = () => {
  const [text, setText] = useState("");
  const [imageCount, setImageCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please paste a line first.");
      return;
    }

    setIsLoading(true);

    // Simulate generation with demo images (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const images: GeneratedImage[] = Array.from({ length: imageCount }, (_, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: DEMO_IMAGES[i % DEMO_IMAGES.length],
      prompt: `Scene ${i + 1} inspired by: "${text.slice(0, 60)}${text.length > 60 ? "…" : ""}"`,
    }));

    setGeneratedImages(images);
    setIsLoading(false);
    toast.success(`${imageCount} ${imageCount === 1 ? "memory" : "memories"} printed!`);

    // Scroll to gallery after short delay
    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
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
          <div className="bg-card rounded-2xl p-8 sm:p-10 shadow-card border border-border/50">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground text-center mb-2">
              Your Memory
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Paste the words that still echo, and we'll turn them into art.
            </p>

            {/* Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the line that still lives in your head…"
              className="w-full h-32 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/60 font-sans text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-300"
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                      imageCount === n
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <motion.button
              onClick={handleGenerate}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
              className="w-full mt-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-serif text-base tracking-wide shadow-soft transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
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
                "Print My Memories"
              )}
            </motion.button>
          </div>
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
