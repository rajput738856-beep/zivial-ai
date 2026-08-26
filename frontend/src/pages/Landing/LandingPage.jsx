import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Process from "../../components/landing/Process";
import Footer from "../../components/layout/Footer";
import BackgroundParticles from "../../components/landing/BackgroundParticles";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#030712] overflow-x-hidden">
      {/* Dynamic futuristic animated background */}
      <BackgroundParticles />
      
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Landing sections */}
      <div className="relative z-10 space-y-4">
        <Hero />
        <Features />
        <Process />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}