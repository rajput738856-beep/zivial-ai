import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Cpu,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const capabilities = [
  "10 Core Engineering Modules",
  "Visual Fan Settings Matrix",
  "Celsius Curve Mapping",
  "Print & PDF Ready Output Reports",
];

export default function AISection() {
  const navigate = useNavigate();

  return (
    <section
      id="generator"
      className="relative overflow-hidden py-24 text-white"
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-brand/5 blur-[120px]" />
      <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-brand-dark/5 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            ZSE Engine
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Let ZSE Calculate Your
            <span className="block text-brand-gradient mt-2 py-0.5">
              Controller Settings
            </span>
          </h2>

          <p className="max-w-xl text-xs md:text-sm leading-relaxed text-gray-400">
            ZSE processes bird capacity, placement dates, and house geometry coordinates 
            to calculate exact heating limits, ventilation cycles, cooling pump delays, and lighting schedules.
          </p>

          <div className="space-y-3 pt-2">
            {capabilities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-xs md:text-sm"
              >
                <CheckCircle2
                  size={18}
                  className="text-brand"
                />

                <span className="text-gray-300 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <motion.button 
            onClick={() => navigate("/farm-infrastructure")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-xs md:text-sm font-semibold text-white transition-all duration-300 cursor-pointer shadow-lg shadow-brand/20 hover:shadow-brand/40"
          >
            Run ZSE Calculations
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-8 backdrop-blur-xl hover:border-brand/30 hover:shadow-[0_12px_30px_rgba(3,7,18,0.5)] transition-all duration-300">

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-brand to-brand-dark p-2.5 shadow-md shadow-brand/20">
                  <Cpu className="text-white" size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-white tracking-tight">
                    ZSE Core
                  </h3>

                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    Math Live Status
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                SYSTEM ONLINE
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">

              <div className="rounded-2xl border border-white/5 bg-[#07080c]/60 p-4 transition-all duration-300 hover:border-brand/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-brand" size={18} />

                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Geometry Calculation
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Computing Shed Area & Bird Density
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#07080c]/60 p-4 transition-all duration-300 hover:border-brand/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <Cpu className="text-brand" size={18} />

                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Ventilation Logic
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Resolving Level 1-16 Fan Assignments
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#07080c]/60 p-4 transition-all duration-300 hover:border-brand/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-brand" size={18} />

                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Climate curves compilation
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Export Ready Celsius targets
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-xs text-gray-400 font-medium">
                <span>Calculations Progress</span>

                <span>100%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/5 border border-white/5">
                <motion.div
                  animate={{
                    width: ["10%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-brand to-brand-dark"
                />
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}