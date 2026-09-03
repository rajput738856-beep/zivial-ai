import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BackgroundParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles on client side to avoid hydration mismatch
    const generated = Array.from({ length: 15 }, (_, index) => ({
      id: index,
      size: Math.floor(Math.random() * 6) + 3,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 4,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Gradient Glow Left */}
      <div className="absolute left-[-200px] top-[-150px] h-[500px] w-[500px] rounded-full bg-brand/5 blur-[140px]" />

      {/* Gradient Glow Right */}
      <div className="absolute bottom-[-180px] right-[-200px] h-[500px] w-[500px] rounded-full bg-brand-dark/5 blur-[140px]" />

      {/* Center Glow */}
      <div className="absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-brand/5 blur-[120px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-brand/35"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.1, 0.45, 0.1],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}