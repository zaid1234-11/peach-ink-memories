import { forwardRef } from "react";

const Receipt = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-[260px] sm:w-[280px] mx-auto receipt-edge"
      style={{ perspective: "1000px" }}
    >
      <div
        className="bg-receipt rounded-t-sm px-6 py-8 shadow-receipt animate-float sm:animate-float md:animate-float"
        style={{
          transform: "rotateX(6deg) rotateZ(2deg)",
          transformStyle: "preserve-3d",
          minHeight: "380px",
        }}
      >
        {/* Receipt header */}
        <div className="text-center border-b border-dashed border-brown-muted/20 pb-4 mb-4">
          <h3 className="font-serif text-lg text-foreground tracking-wide">
            Peach & Paper
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase">
            Memory Receipt
          </p>
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
