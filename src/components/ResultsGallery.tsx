import { motion } from "framer-motion";
import { Download, X } from "lucide-react";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

interface ResultsGalleryProps {
  images: GeneratedImage[];
  onClear: () => void;
}

const ResultsGallery = ({ images, onClear }: ResultsGalleryProps) => {
  if (images.length === 0) return null;

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `peach-memory-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  // Masonry-style heights for visual interest
  const heightClasses = [
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/4]",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative py-16 px-4"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
              Your Memories
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {images.length} peach-printed {images.length === 1 ? "memory" : "memories"} created
            </p>
          </div>
          <motion.button
            onClick={onClear}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground bg-secondary hover:bg-secondary/80 transition-all duration-300"
          >
            <X className="w-3 h-3" />
            Clear
          </motion.button>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 sm:columns-2 md:columns-3 gap-3 space-y-3">
          {images.map((image, i) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: "easeOut",
              }}
              className="break-inside-avoid group relative overflow-hidden rounded-xl shadow-card border border-border/30"
            >
              <div className={heightClasses[i % heightClasses.length]}>
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Peach tint overlay */}
                <div className="absolute inset-0 bg-primary/[0.06] mix-blend-multiply pointer-events-none" />

                {/* Hover overlay with download */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                  <p className="text-[10px] text-background/90 max-w-[70%] line-clamp-2 font-sans">
                    {image.prompt}
                  </p>
                  <motion.button
                    onClick={() => handleDownload(image.url, i)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center shadow-soft"
                  >
                    <Download className="w-3.5 h-3.5 text-foreground" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: images.length * 0.12 + 0.3 }}
          className="text-center text-xs text-muted-foreground/60 mt-8 italic font-serif"
        >
          Every line deserves to be remembered.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default ResultsGallery;
