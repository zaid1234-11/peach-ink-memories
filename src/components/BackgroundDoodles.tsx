import { motion } from "framer-motion";

const doodles = [
  // Small heart
  {
    path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    viewBox: "0 0 24 24",
    x: "8%", y: "15%", size: 28, rotate: -15, opacity: 0.06,
  },
  // Star
  {
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z",
    viewBox: "0 0 24 24",
    x: "88%", y: "10%", size: 24, rotate: 20, opacity: 0.05,
  },
  // Spiral/swirl
  {
    path: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.8 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.2-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z",
    viewBox: "0 0 24 24",
    x: "92%", y: "55%", size: 32, rotate: 45, opacity: 0.04,
  },
  // Small flower
  {
    path: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm0-18C8.1 4 5 7.1 5 11c0 2.4 1.2 4.5 3 5.7V18c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-1.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z",
    viewBox: "0 0 24 24",
    x: "5%", y: "45%", size: 22, rotate: -30, opacity: 0.05,
  },
  // Music note
  {
    path: "M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    viewBox: "0 0 24 24",
    x: "78%", y: "35%", size: 26, rotate: 12, opacity: 0.05,
  },
  // Leaf
  {
    path: "M17.8 2.8C16 2.09 13.86 2 12 2c-1.86 0-4 .09-5.8.8C3.53 3.84 2 6.05 2 8.86V22l4-4h12l4 4V8.86c0-2.81-1.53-5.02-4.2-6.06z",
    viewBox: "0 0 24 24",
    x: "15%", y: "72%", size: 20, rotate: 60, opacity: 0.04,
  },
  // Small circle doodle
  {
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
    viewBox: "0 0 24 24",
    x: "55%", y: "82%", size: 18, rotate: 0, opacity: 0.04,
  },
  // Tiny heart
  {
    path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    viewBox: "0 0 24 24",
    x: "42%", y: "92%", size: 16, rotate: 25, opacity: 0.05,
  },
  // Pencil squiggle (wavy line)
  {
    path: "M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0",
    viewBox: "0 0 22 24",
    x: "30%", y: "5%", size: 40, rotate: -8, opacity: 0.04,
    stroke: true,
  },
  // Another squiggle
  {
    path: "M2 12c2 4 4 4 6 0s4-4 6 0 4 4 6 0",
    viewBox: "0 0 22 24",
    x: "65%", y: "68%", size: 36, rotate: 15, opacity: 0.04,
    stroke: true,
  },
];

const BackgroundDoodles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {doodles.map((d, i) => (
        <motion.svg
          key={i}
          viewBox={d.viewBox}
          className="absolute"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            rotate: `${d.rotate}deg`,
            opacity: d.opacity,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: d.opacity, scale: 1 }}
          transition={{ delay: i * 0.15, duration: 0.8 }}
        >
          <path
            d={d.path}
            fill={(d as any).stroke ? "none" : "hsl(var(--brown-muted))"} 
            stroke={(d as any).stroke ? "hsl(var(--brown-muted))" : "none"}
            strokeWidth={(d as any).stroke ? 1.5 : 0}
            strokeLinecap="round"
          />
        </motion.svg>
      ))}
    </div>
  );
};

export default BackgroundDoodles;
