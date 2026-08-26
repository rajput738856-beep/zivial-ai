import { motion } from "framer-motion";
import {
  Cpu,
  ThermometerSun,
  Wind,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "ZSE Calculation Engine",
    description:
      "Calculates settings dynamically matching the farm geometry, bird density, and placements curves.",
  },
  {
    icon: ThermometerSun,
    title: "Celsius Curves Control",
    description:
      "Calculates target, heating, and cooling temperatures in Celsius, with automatic minimum/maximum alarms.",
  },
  {
    icon: Wind,
    title: "16-Level Fan Matrix",
    description:
      "Generates a complete ventilation table mapping ON/OFF timers in seconds and precise active fan grids.",
  },
  {
    icon: Lightbulb,
    title: "Stage-Specific Lighting",
    description:
      "Configures optimal photoperiod ON/OFF times, brightness percentages, and lux levels based on growth stages.",
  },
  {
    icon: TrendingUp,
    title: "Engineering Analytics",
    description:
      "Resolves flock weight, air velocity, and volume air exchange seconds dynamically.",
  },
  {
    icon: ShieldCheck,
    title: "Industrial-Grade Outputs",
    description:
      "Produces recipes calibrated precisely to output configs configured manually by experienced engineers.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="pt-20 pb-10 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full border border-brand/20 bg-brand/10 px-5 py-2 text-sm font-medium text-brand">
            ZSE Features
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            Everything You Need
            <span className="block bg-gradient-to-r from-brand to-white bg-clip-text text-transparent">
              For Smart Controller Settings
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-400">
            Zivial ZSE delivers powerful calculation modules that optimize house environment, 
            reduce mortality rates, and improve flock feed conversion efficiency.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -12,
                  transition: { duration: 0.3 },
                }}
                className="group rounded-3xl border border-white/10 bg-white/5 p-9 backdrop-blur-xl transition-all hover:border-brand/30 hover:bg-white/10"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark shadow-lg shadow-brand/30 transition-transform group-hover:scale-110">
                  <Icon size={32} className="text-white" />
                </div>

                <h3 className="mb-4 text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Subtle Bottom Highlight */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="inline-flex items-center gap-3 text-sm text-brand">
            <span className="h-px w-12 bg-brand/50" />
            Configured according to standard industrial climate controllers
            <span className="h-px w-12 bg-brand/50" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}