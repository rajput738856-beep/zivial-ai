import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const benefits = [
  "Strict Engineering Formula Calculations",
  "Visual Fan Settings Matrix Output",
  "Celsius Curve Targets Calibration",
  "Export Ready Configuration Report",
];

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-24 text-white"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-10 backdrop-blur-xl md:p-16 hover:border-brand/20 transition-colors duration-500 shadow-2xl"
        >

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles size={14} className="text-brand animate-pulse" />
            Start Calculating Today
          </div>

          {/* Heading */}
          <h2 className="max-w-3xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Ready to Generate Your
            <span className="block text-brand-gradient mt-2 py-0.5">
              Controller Settings Recipe?
            </span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-3xl text-xs md:text-sm leading-relaxed text-gray-400">
            Generate precise settings configurations for Zivial Z1000 and Z800 climate controllers instantly 
            by inputting your poultry shed dimensions and bird parameters.
          </p>

          {/* Benefits */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#07080c]/60 px-4 py-3.5 hover:border-brand/20 transition-all duration-300"
              >
                <CheckCircle2
                  size={18}
                  className="text-brand"
                />

                <span className="text-xs md:text-sm text-gray-300 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <motion.button 
              onClick={() => navigate("/farm-infrastructure")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-8 py-3.5 text-xs md:text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-300 cursor-pointer hover:shadow-brand/45"
            >
              Generate Recipe Now
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>

            <motion.button 
              onClick={() => navigate("/farm-infrastructure")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-xs md:text-sm font-semibold text-white transition hover:bg-white/10 cursor-pointer"
            >
              Contact Support
            </motion.button>
          </div>

          {/* Bottom Stats Grid */}
          <div className="mt-16 grid gap-6 grid-cols-2 lg:grid-cols-4">
            {[
              ["10", "Core Calculation Modules"],
              ["100%", "Manual Engineer Match"],
              ["Z1000", "Controller Model Support"],
              ["Celsius", "Curve Formats"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/5 bg-[#07080c]/60 p-6 text-center hover:border-brand/20 transition-all duration-300"
              >
                <h3 className="text-2xl md:text-3xl font-extrabold text-brand">
                  {number}
                </h3>

                <p className="mt-2 text-xs md:text-sm text-gray-400 font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  );
}