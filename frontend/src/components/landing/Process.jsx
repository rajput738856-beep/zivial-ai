import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Cpu,
  Table,
  Download,
} from "lucide-react";

const steps = [
  {
    id: "01",
    icon: ClipboardList,
    title: "Enter House Info",
    description:
      "Provide your shed size, fan properties, placement date, and environmental coordinates.",
  },
  {
    id: "02",
    icon: Cpu,
    title: "ZSE Module Processing",
    description:
      "Our calculation engine analyzes inputs and maps targets using strict engineering standards.",
  },
  {
    id: "03",
    icon: Table,
    title: "Verify Table Curve",
    description:
      "Review Celsius curves, 16 ventilation levels, and check individual fan statuses.",
  },
  {
    id: "04",
    icon: Download,
    title: "Print or Export PDF",
    description:
      "Download a print-optimized recipe containing multi-page reports to deploy on site.",
  },
];

export default function Process() {
  const navigate = useNavigate();

  return (
    <section
      id="solutions"
      className="pt-10 pb-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm text-brand">
            Work Flow
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            How
            <span className="bg-gradient-to-r from-brand to-white bg-clip-text text-transparent">
              {" "}
              Zivial ZSE{" "}
            </span>
            Works
          </h2>

          <p className="mt-6 text-lg text-gray-400">
            Generate precise climate configuration sheets in a streamlined four-step workflow 
            driven by deterministic poultry calculations.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -8,
                }}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                {/* Step Number */}
                <div className="absolute right-6 top-6 text-5xl font-bold text-white/5">
                  {step.id}
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-brand to-brand-dark">
                  <Icon className="text-white" size={28} />
                </div>

                <h3 className="mb-4 text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="leading-7 text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl"
        >
          <h3 className="text-3xl font-bold">
            Ready to Generate Your First Controller Recipe?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Start generating detailed settings for poultry climate controllers dynamically 
            configured in Celsius and seconds timers.
          </p>

          <button 
            onClick={() => navigate("/farm-infrastructure")}
            className="mt-8 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-8 py-4 font-semibold text-white transition hover:scale-105 cursor-pointer shadow-lg shadow-brand/20 hover:shadow-brand/40"
          >
            Generate Settings Recipe
          </button>
        </motion.div>

      </div>
    </section>
  );
}