import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Receipt from "./Receipt";
import sketch1 from "@/assets/sketch-1.png";
import sketch2 from "@/assets/sketch-2.png";
import sketch3 from "@/assets/sketch-3.png";
import sketch4 from "@/assets/sketch-4.png";
import sketch5 from "@/assets/sketch-5.png";

const sketches = [
  { src: sketch1, range: [0.10, 0.25] as [number, number], x: -20, y: -30, rotate: -5, scale: 0.6 },
  { src: sketch2, range: [0.25, 0.40] as [number, number], x: 30, y: 10, rotate: 3, scale: 0.5 },
  { src: sketch3, range: [0.40, 0.55] as [number, number], x: -10, y: 60, rotate: -2, scale: 0.45 },
  { src: sketch4, range: [0.55, 0.70] as [number, number], x: 20, y: 100, rotate: 4, scale: 0.5 },
  { src: sketch5, range: [0.70, 0.85] as [number, number], x: -15, y: 150, rotate: -3, scale: 0.55 },
];

function SketchLayer({
  src,
  range,
  x,
  y,
  rotate,
  scale: targetScale,
  scrollProgress,
}: {
  src: string;
  range: [number, number];
  x: number;
  y: number;
  rotate: number;
  scale: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(
    scrollProgress,
    [range[0], range[0] + (range[1] - range[0]) * 0.4, range[1]],
    [0, 1, 1]
  );
  const translateY = useTransform(
    scrollProgress,
    [range[0], range[1]],
    [-40, 0]
  );
  const scaleVal = useTransform(
    scrollProgress,
    [range[0], range[1]],
    [0.95, 1]
  );

  return (
    <motion.img
      src={src}
      alt=""
      className="absolute pointer-events-none"
      style={{
        opacity,
        y: translateY,
        scale: scaleVal,
        left: `calc(50% + ${x}px)`,
        top: `${y}px`,
        width: `${targetScale * 200}px`,
        height: `${targetScale * 200}px`,
        rotate: `${rotate}deg`,
        mixBlendMode: "multiply",
        transform: `translate(-50%, 0)`,
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

  const receiptY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={containerRef} className="relative" style={{ height: "500vh" }}>
      {/* Sticky wrapper */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center pt-16 sm:pt-20 overflow-hidden">
        {/* Hero text - appears at start */}
        <motion.div
          className="text-center mb-8 px-4"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
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

        {/* Receipt with sketch overlays */}
        <motion.div
          className="relative"
          style={{ y: receiptY }}
        >
          <Receipt />

          {/* Sketch overlay layers */}
          {sketches.map((sketch, i) => (
            <SketchLayer
              key={i}
              {...sketch}
              scrollProgress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroScrollStory;
