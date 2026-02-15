import HeroScrollStory from "@/components/HeroScrollStory";
import InputSection from "@/components/InputSection";
import Footer from "@/components/Footer";
import Snowfall from "react-snowfall";

const Index = () => {
  return (
    <div className="grain-overlay min-h-screen bg-background">
      <Snowfall
        color="hsl(10, 82%, 81%)"
        snowflakeCount={60}
        radius={[1, 4]}
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
