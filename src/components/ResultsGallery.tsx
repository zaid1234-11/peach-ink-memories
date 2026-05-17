import { motion } from "framer-motion";
import { Download, X, Sparkles } from "lucide-react";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

interface ResultsGalleryProps {
  images: GeneratedImage[];
  onClear: () => void;
}

type FilterType = "none" | "peach" | "vintage" | "warm" | "cool" | "noir";

const filters: Record<FilterType, string> = {
  none: "",
  peach: "saturate(110%) hue-rotate(-5deg) brightness(105%)",
  vintage: "sepia(40%) saturate(80%) contrast(90%) brightness(95%)",
  warm: "saturate(120%) contrast(105%) brightness(103%) hue-rotate(-10deg)",
  cool: "saturate(90%) hue-rotate(10deg) brightness(98%) contrast(102%)",
  noir: "grayscale(100%) contrast(115%) brightness(95%)",
};

const filterNames: Record<FilterType, string> = {
  none: "Original",
  peach: "Peach Glow",
  vintage: "Vintage",
  warm: "Warm",
  cool: "Cool",
  noir: "Noir",
};

const ResultsGallery = ({ images, onClear }: ResultsGalleryProps) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      window.open(url, "_blank");
    }
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
  };

  const handleLightboxClose = () => {
    setLightboxIndex(null);
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : 0
    );
  };

  const handlePreviousImage = () => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : 0
    );
  };

  const heightClasses = [
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/4]",
  ];

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative py-16 px-4"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <motion.h2
                className="font-serif text-2xl sm:text-3xl text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Memories
              </motion.h2>
              <p className="text-sm text-muted-foreground mt-1">
                {images.length} peach-printed {images.length === 1 ? "memory" : "memories"} created
              </p>
            </div>
            <motion.button
              onClick={onClear}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 transition-all duration-300 shadow-soft"
            >
              <X className="w-3.5 h-3.5" />
              Clear All
            </motion.button>
          </div>

          {/* Filter pills */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Apply filter</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(filters) as FilterType[]).map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${selectedFilter === filter
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                >
                  {filterNames[filter]}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Masonry grid */}
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((image, i) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
                className="break-inside-avoid group relative overflow-hidden rounded-xl shadow-card border border-border/30 cursor-pointer"
                onClick={() => handleImageClick(i)}
              >
                <div className={heightClasses[i % heightClasses.length]}>
                  <motion.img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    style={{ filter: filters[selectedFilter] }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Peach tint overlay */}
                  <div className="absolute inset-0 bg-primary/[0.04] mix-blend-multiply pointer-events-none" />

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-end justify-between p-3">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image.url, i);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-background/95 flex items-center justify-center shadow-soft hover:shadow-glow transition-all"
                    >
                      <Download className="w-4 h-4 text-foreground" />
                    </motion.button>

                    <p className="text-[11px] text-background/95 line-clamp-2 font-sans w-full">
                      {image.prompt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom caption */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: images.length * 0.08 + 0.4 }}
            className="text-center text-xs text-muted-foreground/60 mt-10 italic font-serif"
          >
            Every line deserves to be remembered.
          </motion.p>
        </div>
      </motion.section>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={handleLightboxClose}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </>
  );
};

export default ResultsGallery;
