import { motion } from "framer-motion";
import sketch1 from "@/assets/sketch-1.png";
import sketch2 from "@/assets/sketch-2.png";
import sketch3 from "@/assets/sketch-3.png";
import sketch4 from "@/assets/sketch-4.png";
import sketch5 from "@/assets/sketch-5.png";

const scatteredSketches = [
  { src: sketch1, x: "5%", y: "10%", size: 80, rotate: -12, opacity: 0.12 },
  { src: sketch3, x: "85%", y: "8%", size: 70, rotate: 18, opacity: 0.1 },
  { src: sketch2, x: "90%", y: "45%", size: 65, rotate: -8, opacity: 0.1 },
  { src: sketch5, x: "8%", y: "55%", size: 75, rotate: 25, opacity: 0.11 },
  { src: sketch4, x: "80%", y: "75%", size: 60, rotate: -20, opacity: 0.09 },
  { src: sketch1, x: "15%", y: "80%", size: 55, rotate: 15, opacity: 0.1 },
  { src: sketch3, x: "50%", y: "90%", size: 50, rotate: -5, opacity: 0.08 },
  { src: sketch2, x: "3%", y: "35%", size: 60, rotate: 30, opacity: 0.09 },
];

const BackgroundDoodles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[51] overflow-hidden">
      {scatteredSketches.map((s, i) => (
        <motion.img
          key={i}
          src={s.src}
          alt=""
          className="absolute"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            rotate: `${s.rotate}deg`,
            objectFit: "contain",
            mixBlendMode: "multiply",
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: s.opacity, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
        />
      ))}
    </div>
  );
};

export default BackgroundDoodles;
