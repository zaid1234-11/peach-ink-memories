import { useMemo } from "react";
import HeroScrollStory from "@/components/HeroScrollStory";
import InputSection from "@/components/InputSection";
import Footer from "@/components/Footer";
import Snowfall from "react-snowfall";
import BackgroundDoodles from "@/components/BackgroundDoodles";

const Index = () => {
  const heartImages = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#F6B7A9";
    ctx.fillText("❤", 16, 17);

    const img = document.createElement("img");
    img.src = canvas.toDataURL();
    return [img];
  }, []);

  return (
    <div className="grain-overlay min-h-screen bg-background">
      <BackgroundDoodles />
      <Snowfall
        images={heartImages}
        snowflakeCount={40}
        radius={[6, 14]}
        speed={[0.5, 1.5]}
        wind={[-0.5, 1]}
        style={{ position: "fixed", zIndex: 40 }}
      />
      <HeroScrollStory />
      <InputSection />
      <Footer />
    </div>
  );
};

export default Index;
