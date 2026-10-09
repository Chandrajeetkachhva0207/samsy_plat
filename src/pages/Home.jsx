import HeroSection from "../components/home/HeroSection.jsx";
import MarketStrip from "../components/home/MarketStrip.jsx";
import EcosystemSection from "../components/home/EcosystemSection.jsx";
import AboutSection from "../components/home/AboutSection.jsx";
import NewsCommunity from "../components/home/NewsCommunity.jsx";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarketStrip />
      <EcosystemSection />
      <AboutSection />
      <NewsCommunity />
    </>
  );
}
