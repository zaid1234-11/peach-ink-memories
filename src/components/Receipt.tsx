import { forwardRef, useMemo } from "react";
import { motion, MotionValue, useTransform, motionValue } from "framer-motion";

interface ReceiptProps {
  songLineOpacity?: MotionValue<number>;
  songLine?: MotionValue<string> | string;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ songLine, songLineOpacity }, ref) => {
  const fallback = useMemo(() => motionValue(0), []);
  const source = songLineOpacity ?? fallback;
  const defaultOpacity = useTransform(source, [0, 1], [1, 0]);

  return (
    <div
      ref={ref}
      className="relative w-[260px] sm:w-[280px] mx-auto receipt-edge"
      style={{ perspective: "1000px" }}
    >
      <div
        className="bg-receipt rounded-t-sm px-6 py-8 shadow-receipt animate-float"
        style={{
          transform: "rotateX(6deg) rotateZ(2deg)",
          transformStyle: "preserve-3d",
          minHeight: "380px",
        }}
      >
        {/* Receipt header */}
        <div className="text-center border-b border-dashed border-brown-muted/20 pb-4 mb-4 relative min-h-[52px]">
          {/* Default heading - hides when song line visible */}
          <motion.div
            className="flex flex-col items-center justify-center"
            style={{ opacity: defaultOpacity }}
          >
            <h3 className="font-serif text-lg text-foreground tracking-wide">
              Peach & Paper
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase">
              Memory Receipt
            </p>
          </motion.div>

          {/* Song line overlay */}
          {songLineOpacity && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center px-2"
              style={{ opacity: songLineOpacity }}
            >
              <motion.p className="font-serif text-sm text-foreground leading-snug italic">
                {songLine}
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* Receipt lines */}
        <div className="space-y-2 text-[11px] text-muted-foreground font-mono">
          <div className="flex justify-between">
            <span>Date</span>
            <span>••/••/••••</span>
          </div>
          <div className="flex justify-between">
            <span>Feeling</span>
            <span>Nostalgic</span>
          </div>
          <div className="flex justify-between">
            <span>Lines</span>
            <span>∞</span>
          </div>
          <div className="border-t border-dashed border-brown-muted/20 pt-2 mt-3">
            <div className="flex justify-between font-medium text-foreground">
              <span>Memories</span>
              <span>Priceless</span>
            </div>
          </div>
        </div>

        {/* Faint watermark */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[60px] opacity-[0.04] font-serif select-none">
          🍑
        </div>
      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
