import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Receipt from "./Receipt";
import sketch1 from "@/assets/sketch-1.png";
import sketch2 from "@/assets/sketch-2.png";
import sketch3 from "@/assets/sketch-3.png";
import sketch4 from "@/assets/sketch-4.png";
import sketch5 from "@/assets/sketch-5.png";

const steps = [
  { src: sketch1, range: [0.10, 0.25] as [number, number], line: "And in the end, the love you take…" },
  { src: sketch2, range: [0.25, 0.40] as [number, number], line: "We're just two lost souls swimming…" },
  { src: sketch3, range: [0.40, 0.55] as [number, number], line: "I will always love you…" },
  { src: sketch4, range: [0.55, 0.70] as [number, number], line: "Maybe I was born to hold you…" },
  { src: sketch5, range: [0.70, 0.85] as [number, number], line: "Every little thing is gonna be alright…" },
];

// Shared opacity hook — used for BOTH sketch and lyric so they're perfectly synced
function useStepOpacity(
  scrollProgress: MotionValue<number>,
  range: [number, number]
) {
  const fadeIn = range[0];
  const visible = range[0] + (range[1] - range[0]) * 0.25;
  const holdEnd = range[1] - (range[1] - range[0]) * 0.1;
  const fadeOut = range[1];
  return useTransform(
    scrollProgress,
    [fadeIn, visible, holdEnd, fadeOut],
    [0, 1, 1, 0]
  );
}

function SketchAtBottom({
  src,
  opacity,
  scrollProgress,
  range,
}: {
  src: string;
  opacity: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  range: [number, number];
}) {
  const mid = range[0] + (range[1] - range[0]) * 0.25;
  const translateY = useTransform(scrollProgress, [range[0], mid], [20, 0]);

  return (
    <motion.img
      src={src}
      alt=""
      className="absolute left-1/2 pointer-events-none"
      style={{
        opacity,
        y: translateY,
        x: "-50%",
        bottom: "-20px",
        width: "160px",
        height: "160px",
        objectFit: "contain",
        mixBlendMode: "multiply",
      }}
    />
  );
}

const HeroScrollStory = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const receiptY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -100, -250]);

  // Single shared opacity per step — drives both sketch AND lyric
  const op0 = useStepOpacity(scrollYProgress, steps[0].range);
  const op1 = useStepOpacity(scrollYProgress, steps[1].range);
  const op2 = useStepOpacity(scrollYProgress, steps[2].range);
  const op3 = useStepOpacity(scrollYProgress, steps[3].range);
  const op4 = useStepOpacity(scrollYProgress, steps[4].range);
  const allOpacities = [op0, op1, op2, op3, op4];

  // Combined opacity: is any step active?
  const anySongOpacity = useTransform(
    allOpacities,
    (values: number[]) => Math.max(...values)
  );

  // Active song line text — picks the step with highest opacity
  const activeSongLine = useTransform(
    allOpacities,
    (values: number[]) => {
      let maxIdx = 0;
      let maxVal = 0;
      values.forEach((v, i) => {
        if (v > maxVal) { maxVal = v; maxIdx = i; }
      });
      return maxVal > 0.05 ? steps[maxIdx].line : "";
    }
  );

  return (
    <section ref={containerRef} className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center pt-16 sm:pt-20 overflow-hidden">
        {/* Hero text */}
        <motion.div
          className="text-center mb-8 px-4"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
            y: useTransform(scrollYProgress, [0, 0.1], [0, -80]),
          }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-foreground mb-3 tracking-tight">
            Peach & Paper
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto italic">
            Turn your lines into peach-printed memories.
          </p>
          <motion.div
            className="mt-6 text-muted-foreground/50 text-sm"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓ scroll to reveal
          </motion.div>
        </motion.div>

        {/* Receipt with single sketch + song line */}
        <motion.div
          className="relative"
          style={{ y: receiptY }}
        >
          <Receipt songLine={activeSongLine} songLineOpacity={anySongOpacity} scrollProgress={scrollYProgress} />

          {/* Sketches use the SAME opacity as the lyrics */}
          {steps.map((step, i) => (
            <SketchAtBottom
              key={i}
              src={step.src}
              opacity={allOpacities[i]}
              scrollProgress={scrollYProgress}
              range={step.range}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroScrollStory;
