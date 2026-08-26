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
        >
          <span className="rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm text-brand font-semibold">
            ZSE Engine
          </span>

          <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            Let ZSE Calculate Your
            <span className="block bg-gradient-to-r from-brand via-[#ff4c7d] to-[#ff82a5] bg-clip-text text-transparent">
              Controller Settings
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
            Zivial ZSE processes bird capacity, placement dates, and house geometry coordinates 
            to calculate exact heating limits, ventilation cycles, cooling pump delays, and lighting schedules.
          </p>

          <div className="mt-10 space-y-4">
            {capabilities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  size={20}
                  className="text-brand"
                />

                <span className="text-gray-300">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate("/farm-infrastructure")}
            className="mt-10 flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-8 py-4 font-semibold text-white transition hover:scale-105 cursor-pointer shadow-lg shadow-brand/20 hover:shadow-brand/40"
          >
            Run ZSE Calculations
            <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-brand to-brand-dark p-3">
                  <Cpu className="text-white" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Zivial ZSE Core
                  </h3>

                  <p className="text-sm text-gray-400">
                    Math Live Status
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-brand/20 px-4 py-2 text-sm text-brand font-semibold">
                SYSTEM ONLINE
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-brand" />

                  <div>
                    <h4 className="font-semibold">
                      Geometry Calculation
                    </h4>

                    <p className="text-sm text-gray-400">
                      Computing Shed Area & Bird Density
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Cpu className="text-brand" />

                  <div>
                    <h4 className="font-semibold">
                      Ventilation Logic
                    </h4>

                    <p className="text-sm text-gray-400">
                      Resolving Level 1-16 Fan Assignments
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-brand" />

                  <div>
                    <h4 className="font-semibold">
                      Climate curves compilation
                    </h4>

                    <p className="text-sm text-gray-400">
                      Export Ready Celsius targets
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm text-gray-400">
                <span>Calculations Progress</span>

                <span>100%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{
                    width: ["10%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    repeatType: "reverse",
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