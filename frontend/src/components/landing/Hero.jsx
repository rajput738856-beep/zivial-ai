import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Controller from "../../assets/images/Controller.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        
        {/* Left Content - ZSE Math Engine Focused */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-5 py-2 text-sm text-brand backdrop-blur-xl">
            <Sparkles size={18} className="text-brand" />
            Zivial Setting Engine (ZSE)
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Build Smart
            <span className="block bg-gradient-to-r from-brand to-white bg-clip-text text-transparent">
              ZSE Settings
            </span>
            for Poultry
          </h1>

          {/* Description */}
          <p className="max-w-xl text-lg leading-relaxed text-gray-400">
            Generate precise climate controller recipes for poultry farms using 
            automated engineering calculations. Optimize temperature curves, 16 ventilation levels, 
            cooling pad times, and lighting schedules dynamically based on bird age.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              onClick={() => navigate("/farm-infrastructure")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-8 py-4 font-semibold text-white shadow-lg shadow-brand/30 transition-all cursor-pointer"
            >
              Generate Settings Recipe
              <ArrowRight size={20} />
            </motion.button>

            <motion.button
              onClick={() => navigate("/farm-infrastructure")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl hover:bg-white/10 cursor-pointer"
            >
              <Play size={20} />
              Calculate Farm CFM
            </motion.button>
          </div>

          {/* Simple Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
              10 core math modules
            </div>
            <div>Celsius Settings Curve</div>
            <div>Automatic Fan Matrix</div>
          </motion.div>
        </motion.div>

        {/* Right Side - Controller Image with Animation */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-10 bg-gradient-to-br from-brand/20 via-brand-dark/15 to-transparent blur-3xl" />
            
            {/* Controller Image Container */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-3 shadow-2xl"
            >
              <img
                src={Controller} 
                alt="Poultry Climate Controller Hardware"
                className="h-auto w-full max-w-[520px] rounded-2xl object-cover"
              />
              
              {/* Overlay Label */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-black/70 px-5 py-3 backdrop-blur-md">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-brand font-semibold">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-brand" />
                    Z1000 PRO READY
                  </div>
                  <div className="font-medium text-white">Climate Settings Engine</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
