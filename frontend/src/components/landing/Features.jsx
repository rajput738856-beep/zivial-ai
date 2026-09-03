import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Cpu,
  ThermometerSun,
  Wind,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Cpu,
    title: "ZSE Calculation Engine",
    description:
      "Dynamic controller settings based on house geometry, flock density, and growth stage.",
  },
  {
    number: "02",
    icon: ThermometerSun,
    title: "Temperature Curve Control",
    description:
      "Automatically defines target, heating, and cooling temperatures with built-in alarm limits.",
  },
  {
    number: "03",
    icon: Wind,
    title: "16-Level Fan Matrix",
    description:
      "Creates precise fan stages, ON/OFF timings, and ventilation sequences automatically.",
  },
  {
    number: "04",
    icon: Lightbulb,
    title: "Stage-Based Lighting",
    description:
      "Sets lighting schedules, brightness, and photoperiods for every growth stage.",
  },
  {
    number: "05",
    icon: TrendingUp,
    title: "Engineering Analytics",
    description:
      "Calculates airflow, air velocity, flock load, and required air-exchange time.",
  },
  {
    number: "06",
    icon: ShieldCheck,
    title: "Precision Outputs",
    description:
      "Delivers calibrated controller recipes ready for real-world operation.",
  },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <section
      id="features"
      className="relative pt-24 pb-24 text-white overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            ZSE Features
          </span>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-white">
            Smart Control.
            <span className="block text-brand-gradient mt-3">
              Precisely Engineered.
            </span>
          </h2>

          <p className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From temperature and ventilation to lighting and airflow, ZSE transforms farm conditions into precise controller settings.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-8 transition-all duration-300 hover:border-brand/30 hover:bg-white/[0.05] hover:shadow-[0_12px_30px_rgba(3,7,18,0.5)]"
              >
                {/* Large Background Watermark Number */}
                <div className="absolute top-4 right-6 font-mono text-5xl font-black text-white/[0.02] transition-colors duration-300 group-hover:text-brand/[0.04] select-none pointer-events-none">
                  {feature.number}
                </div>

                <div>
                  {/* Icon Container */}
                  <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#0d0e12] text-white transition-all duration-300 group-hover:border-brand/30 group-hover:shadow-[0_0_15px_rgba(238,92,120,0.15)]">
                    <Icon size={20} className="text-gray-300 group-hover:text-brand transition-colors duration-300" />
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-white tracking-tight group-hover:text-brand transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-400 pr-2">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Right Arrow Icon appearing on hover */}
                <div className="absolute bottom-6 right-6 opacity-0 translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <ArrowRight size={16} className="text-brand" />
                </div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
}