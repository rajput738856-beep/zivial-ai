import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Sparkles,
  Calculator,
  Thermometer,
  Wind,
  Lightbulb,
  Target,
  Shield,
  Zap,
  Cloud,
} from "lucide-react";
import Controller from "../../assets/images/Controller.jpg";

const indicators = [
  {
    icon: Calculator,
    value: "10+",
    label: "Core Math Modules",
  },
  {
    icon: Thermometer,
    value: "Celsius",
    label: "Settings Curve",
  },
  {
    icon: Wind,
    value: "16-Level",
    label: "Automatic Fan Matrix",
  },
  {
    icon: Lightbulb,
    value: "Smart",
    label: "Lighting Schedules",
  },
];

const bottomFeatures = [
  {
    icon: Target,
    title: "Engineered Accuracy",
    description: "Built on real-world farm data and engineering logic.",
  },
  {
    icon: Shield,
    title: "Bird-Centric Control",
    description: "Every setting optimized for bird comfort and performance.",
  },
  {
    icon: Zap,
    title: "Time Saving",
    description: "Automated calculations that save hours of manual work.",
  },
  {
    icon: Cloud,
    title: "Easy Deployment",
    description: "Export, print, and implement with confidence.",
  },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden pt-24 pb-8"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Premium Technical Blueprint & Ambient Glow Background */}
      <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full pointer-events-none z-0 select-none overflow-hidden">
        {/* Glow spotlight behind the device */}
        <div className="absolute top-[45%] right-[20%] -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand/10 rounded-full blur-[130px]" />
        <div className="absolute top-[45%] right-[25%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-dark/15 rounded-full blur-[90px]" />

        {/* Technical Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.08]" 
          style={{
            backgroundImage: `linear-gradient(rgba(238, 92, 120, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(238, 92, 120, 0.18) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 65% 45%, black 30%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(circle at 65% 45%, black 30%, transparent 85%)'
          }}
        />

        {/* Blueprint Radar Rings and Technical Axis lines */}
        <svg className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen" viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#tech-glow)">
            {/* Concentric blueprint circles (centered to the left of the card center for maximum visibility) */}
            <circle cx="650" cy="380" r="180" stroke="#EE5C78" strokeWidth="1.2" strokeDasharray="4 8" opacity="0.55" />
            <circle cx="650" cy="380" r="260" stroke="#EE5C78" strokeWidth="1.5" strokeDasharray="180 8 10 8" opacity="0.45" />
            <circle cx="650" cy="380" r="340" stroke="#CC3D58" strokeWidth="1.2" strokeDasharray="8 16" opacity="0.35" />
            <circle cx="650" cy="380" r="440" stroke="#EE5C78" strokeWidth="1.5" opacity="0.25" />
            <circle cx="650" cy="380" r="540" stroke="#CC3D58" strokeWidth="1.2" strokeDasharray="30 50" opacity="0.15" />

            {/* Crosshair / Engineering grid lines */}
            <line x1="100" y1="380" stroke="#EE5C78" strokeWidth="1" x2="1200" y2="380" opacity="0.3" strokeDasharray="10 10" />
            <line x1="650" y1="-100" stroke="#EE5C78" strokeWidth="1" x2="650" y2="900" opacity="0.3" strokeDasharray="10 10" />

            {/* Glowing data nodes (placed outside the device area so they are fully visible) */}
            <circle cx="470" cy="380" r="4.5" fill="#ffffff" opacity="0.95" />
            <circle cx="470" cy="380" r="9" fill="#EE5C78" opacity="0.5" />
            
            <circle cx="390" cy="380" r="3" fill="#EE5C78" opacity="0.8" />
            
            <circle cx="650" cy="200" r="4.5" fill="#ffffff" opacity="0.95" />
            <circle cx="650" cy="200" r="9" fill="#EE5C78" opacity="0.5" />

            <circle cx="650" cy="560" r="3" fill="#ff4d70" opacity="0.7" />
            <circle cx="650" cy="640" r="4" fill="#ffffff" opacity="0.8" />

            <circle cx="830" cy="200" r="3.5" fill="#ff4d70" opacity="0.65" />

            {/* Sweeping diagonal laser lines for sharp texture */}
            <path d="M 1200 -100 L 300 800" stroke="url(#laser-gradient)" strokeWidth="1.5" opacity="0.4" />
            <path d="M 1250 -50 L 350 850" stroke="url(#laser-gradient)" strokeWidth="1" opacity="0.25" />
          </g>

          <defs>
            <linearGradient id="laser-gradient" x1="1200" y1="-100" x2="300" y2="800" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EE5C78" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#CC3D58" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#EE5C78" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#EE5C78" stopOpacity="0" />
            </linearGradient>
            <filter id="tech-glow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* Left Content - ZSE Math Engine Focused */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand backdrop-blur-xl">
              <Sparkles size={12} className="text-brand animate-pulse" />
              Zivial Setting Engine (ZSE)
            </div>

            {/* Main Heading (Sized to fit on a single line and be clean) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold leading-[1.15] tracking-tight text-white">
              Smarter Climate.
              <span className="block text-brand-gradient mt-1.5 py-0.5">
                Precise Settings.
              </span>
              Healthier Flocks.
            </h1>

            {/* Description (Slightly smaller text size) */}
            <p className="max-w-md text-xs md:text-sm leading-relaxed text-gray-400">
              ZSE generates precise, automated climate controller recipes tailored for your poultry house. Optimize temperature curves, ventilation, cooling, and lighting — all based on real engineering calculations and bird age.
            </p>

            {/* CTA Buttons (Tighter Padding) */}
            <div className="flex flex-wrap gap-4 pt-1">
              <motion.button
                onClick={() => navigate("/farm-infrastructure")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-xs md:text-sm font-semibold text-white shadow-lg shadow-brand/20 hover:shadow-brand/40 transition-all duration-300 cursor-pointer"
              >
                Generate Settings Recipe
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                onClick={() => navigate("/farm-infrastructure")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs md:text-sm font-semibold text-white backdrop-blur-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <Play size={16} className="text-brand" />
                Calculate Farm CFM
              </motion.button>
            </div>

            {/* Indicators Box (Compact Layout) */}
            <div className="border border-white/5 bg-[#07080c]/50 backdrop-blur-md rounded-2xl p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl">
              {indicators.map((ind, idx) => {
                const Icon = ind.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs md:text-sm leading-tight">{ind.value}</div>
                      <div className="text-[9px] text-gray-500 font-medium leading-tight mt-0.5">{ind.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side - Controller Image with Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end z-10"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-10 bg-gradient-to-br from-brand/20 via-brand-dark/10 to-transparent blur-3xl pointer-events-none" />
              
              {/* Controller Image Container */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-[#06070a]/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-[500px] transition-all duration-300 hover:border-brand/20"
              >
                {/* Device Specs Header Dots */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.01]">
                  <span className="w-2 h-2 rounded-full bg-brand" />
                  <span className="text-[10px] text-gray-400 font-mono tracking-wide font-medium">Zivial Z1000 Interface</span>
                </div>

                <div className="p-1 bg-black">
                  <img
                    src={Controller} 
                    alt="Zivial Z1000 Climate Controller"
                    className="h-auto w-full rounded-2xl object-cover"
                  />
                </div>
                
                {/* Overlay Label */}
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-black/80 px-5 py-3 border border-white/10 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-brand font-semibold tracking-wide">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-brand" />
                      ZIVIAL Z1000 READY
                    </div>
                    <div className="font-medium text-white/95">Climate Settings Engine</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Value Propositions Grid (Tighter spacing) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/10 mt-12">
          {bottomFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <Icon size={20} className="text-brand mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white text-xs md:text-sm">{feat.title}</h4>
                  <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
