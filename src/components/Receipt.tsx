import { forwardRef, useMemo } from "react";
import { motion, MotionValue, useTransform, motionValue } from "framer-motion";

interface ReceiptProps {
  songLineOpacity?: MotionValue<number>;
  songLine?: MotionValue<string> | string;
  scrollProgress?: MotionValue<number>;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ songLine, songLineOpacity, scrollProgress }, ref) => {
  const fallbackScroll = useMemo(() => motionValue(0), []);
  const fallbackSongOpacity = useMemo(() => motionValue(0), []);
  const scroll = scrollProgress ?? fallbackScroll;
  const songOpacity = songLineOpacity ?? fallbackSongOpacity;

  const infinityOpacity = useTransform(songOpacity, [0, 0.1], [1, 0]);

  // Get current timestamp
  const timestamp = useMemo(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-[260px] sm:w-[300px] mx-auto receipt-edge"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="bg-receipt rounded-t-sm px-6 py-8 transition-all duration-500 ease-out shadow-receipt"
        style={{
          transform: "rotateX(8deg) rotateZ(2deg)",
          transformStyle: "preserve-3d",
          minHeight: "420px",
          cursor: "default",
        }}
        whileHover={{
          rotateX: 12,
          rotateZ: -2,
          y: -12,
          scale: 1.03,
          transition: { duration: 0.4, ease: "easeOut" }
        }}
      >
        {/* Receipt header - enhanced */}
        <div className="text-center border-b border-dashed border-brown-muted/20 pb-4 mb-5">
          <motion.h3
            className="font-serif text-xl text-foreground tracking-wide mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Peach & Paper
          </motion.h3>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
            Memory Receipt
          </p>
          <div className="flex justify-center gap-1 opacity-40">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-[2px] h-[8px] bg-foreground" />
            ))}
          </div>
        </div>

        {/* Receipt lines - enhanced */}
        <div className="space-y-2.5 text-[11px] text-muted-foreground font-mono">
          <div className="flex justify-between">
            <span>Date</span>
            <span className="text-foreground">{timestamp.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Time</span>
            <span className="text-foreground">{timestamp.time}</span>
          </div>
          <div className="flex justify-between">
            <span>Feeling</span>
            <span className="text-foreground font-serif italic text-xs">Nostalgic</span>
          </div>
          <div className="border-t border-dashed border-brown-muted/20 pt-2 mt-2" />
          <div className="relative min-h-[40px]">
            <div className="flex justify-between">
              <span>Lines</span>
              {/* Default ∞ - hides when song line active */}
              <motion.span
                style={{ opacity: infinityOpacity }}
                className="transition-opacity duration-300 text-foreground"
              >
                ∞
              </motion.span>
            </div>
            {/* Song lyric replaces ∞ */}
            {songLineOpacity && (
              <motion.div
                className="absolute right-0 top-0 text-right max-w-[170px]"
                style={{ opacity: songOpacity }}
              >
                <motion.span className="font-serif text-[11px] text-foreground italic leading-tight block">
                  {songLine}
                </motion.span>
              </motion.div>
            )}
          </div>
          <div className="border-t border-dashed border-brown-muted/20 pt-3 mt-3">
            <div className="flex justify-between font-medium text-foreground text-xs">
              <span>Memories</span>
              <span className="font-serif">Priceless</span>
            </div>
          </div>
        </div>

        {/* Thank you message */}
        <p className="text-center text-[10px] text-muted-foreground/60 mt-6 italic">
          Thank you for preserving this moment
        </p>

        {/* Faint watermark - enhanced */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[70px] opacity-[0.035] font-serif select-none pointer-events-none">
          🍑
        </div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-t-sm pointer-events-none" />
      </motion.div>
    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
