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
          className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl md:p-16"
        >

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm text-brand">
            <Sparkles size={16} />
            Start Calculating Today
          </div>

          {/* Heading */}
          <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Ready to Generate Your
            <span className="block bg-gradient-to-r from-brand to-white bg-clip-text text-transparent">
              Controller Settings Recipe?
            </span>
          </h2>

          {/* Description */}
          <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-400">
            Generate precise settings configurations for Z1000, Z800, and Z1000 Pro climate controllers instantly 
            by inputting your poultry shed dimensions and bird parameters.
          </p>

          {/* Benefits */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4"
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

          {/* Buttons */}
          <div className="mt-12 flex flex-wrap gap-4">
            <button 
              onClick={() => navigate("/farm-infrastructure")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-8 py-4 font-semibold text-white shadow-lg shadow-brand/30 transition hover:scale-105 cursor-pointer hover:shadow-brand/50"
            >
              Generate Recipe Now
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => navigate("/farm-infrastructure")}
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition hover:bg-white/10 cursor-pointer"
            >
              Contact Support
            </button>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid gap-6 md:grid-cols-4">
            {[
              ["10", "Core Calculation Modules"],
              ["100%", "Manual Engineer Match"],
              ["Z1000", "Controller Model Support"],
              ["Celsius", "Curve Formats"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <h3 className="text-3xl font-bold text-brand">
                  {number}
                </h3>

                <p className="mt-2 text-gray-400">
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