import { motion } from "framer-motion";

const doodles = [
  {
    path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    viewBox: "0 0 24 24",
    x: "8%", y: "15%", size: 48, rotate: -15, opacity: 0.15,
  },
  {
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z",
    viewBox: "0 0 24 24",
    x: "88%", y: "10%", size: 40, rotate: 20, opacity: 0.12,
  },
  {
    path: "M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    viewBox: "0 0 24 24",
    x: "78%", y: "38%", size: 44, rotate: 12, opacity: 0.13,
  },
  {
    path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    viewBox: "0 0 24 24",
    x: "92%", y: "65%", size: 36, rotate: 30, opacity: 0.1,
  },
  {
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
    viewBox: "0 0 24 24",
    x: "5%", y: "50%", size: 34, rotate: 0, opacity: 0.1,
  },
  {
    path: "M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0",
    viewBox: "0 0 22 24",
    x: "25%", y: "6%", size: 70, rotate: -8, opacity: 0.1,
    stroke: true,
  },
  {
    path: "M2 12c2 4 4 4 6 0s4-4 6 0 4 4 6 0",
    viewBox: "0 0 22 24",
    x: "60%", y: "75%", size: 60, rotate: 15, opacity: 0.1,
    stroke: true,
  },
  {
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z",
    viewBox: "0 0 24 24",
    x: "42%", y: "88%", size: 30, rotate: -20, opacity: 0.12,
  },
  {
    path: "M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    viewBox: "0 0 24 24",
    x: "3%", y: "82%", size: 38, rotate: -25, opacity: 0.11,
  },
];

const BackgroundDoodles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[51] overflow-hidden">
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
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: d.opacity, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
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
