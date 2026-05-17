import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useEffect, useCallback } from "react";
import type { GeneratedImage } from "./ResultsGallery";

interface ImageLightboxProps {
    images: GeneratedImage[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

const ImageLightbox = ({
    images,
    currentIndex,
    isOpen,
    onClose,
    onNext,
    onPrevious,
}: ImageLightboxProps) => {
    const currentImage = images[currentIndex];

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowLeft":
                    onPrevious();
                    break;
                case "ArrowRight":
                    onNext();
                    break;
            }
        },
        [isOpen, onClose, onNext, onPrevious]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleDownload = async () => {
        if (!currentImage) return;

        try {
            const response = await fetch(currentImage.url);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `peach-memory-${currentIndex + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch {
            window.open(currentImage.url, "_blank");
        }
    };

    const handleShare = async () => {
        if (!currentImage) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Peach Ink Memory",
                    text: currentImage.prompt,
                    url: currentImage.url,
                });
            } catch (error) {
                // User cancelled or error occurred
                console.log("Share cancelled");
            }
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(currentImage.url);
        }
    };

    if (!currentImage) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 backdrop-blur-md"
                    onClick={onClose}
                >
                    {/* Close button */}
                    <motion.button
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.1 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-background/90 hover:bg-background transition-colors shadow-soft"
                    >
                        <X className="w-5 h-5 text-foreground" />
                    </motion.button>

                    {/* Image counter */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.15 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/90 text-foreground text-sm font-mono shadow-soft"
                    >
                        {currentIndex + 1} / {images.length}
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload();
                            }}
                            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground flex items-center gap-2 shadow-soft hover:shadow-glow transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span className="text-sm font-medium">Download</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShare();
                            }}
                            className="px-5 py-2.5 rounded-full bg-background text-foreground flex items-center gap-2 shadow-soft hover:shadow-glow transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Share</span>
                        </motion.button>
                    </motion.div>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                        <>
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                whileHover={{ scale: 1.1, x: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPrevious();
                                }}
                                className="absolute left-6 p-4 rounded-full bg-background/90 hover:bg-background shadow-soft transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-foreground" />
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                whileHover={{ scale: 1.1, x: 4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNext();
                                }}
                                className="absolute right-6 p-4 rounded-full bg-background/90 hover:bg-background shadow-soft transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-foreground" />
                            </motion.button>
                        </>
                    )}

                    {/* Main image */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-[90vw] max-h-[80vh] rounded-2xl overflow-hidden shadow-glow"
                    >
                        <img
                            key={currentImage.id}
                            src={currentImage.url}
                            alt={currentImage.prompt}
                            className="w-full h-full object-contain"
                        />

                        {/* Image caption */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent backdrop-blur-sm"
                        >
                            <p className="text-background text-sm font-serif italic text-center">
                                {currentImage.prompt}
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageLightbox;
