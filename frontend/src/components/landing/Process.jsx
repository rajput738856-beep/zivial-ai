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
    stage: "INPUT",
    title: "Enter Farm Details",
    description:
      "Add house dimensions, fan configuration, placement date, and environmental coordinates.",
  },
  {
    id: "02",
    icon: Table,
    stage: "VERIFY",
    title: "Review & Validate",
    description:
      "Verify temperature curves, ventilation levels, and individual fan settings before deployment.",
  },
  {
    id: "03",
    icon: Cpu,
    stage: "CALCULATE",
    title: "Run ZSE Engine",
    description:
      "ZSE processes farm inputs and calculates precise climate settings using engineering logic.",
  },
  {
    id: "04",
    icon: Download,
    stage: "DEPLOY",
    title: "Export Settings",
    description:
      "Generate a print-ready PDF with complete climate settings for on-site implementation.",
  },
];

export default function Process() {
  const navigate = useNavigate();

  return (
    <section
      id="solutions"
      className="pt-16 pb-24 text-white"
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
          <span className="rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand uppercase">
            WORKFLOW
          </span>

          <h2 className="mt-6 text-4xl font-extrabold md:text-5xl text-white">
            How{" "}
            <span className="text-brand-gradient">
              ZSE
            </span>{" "}
            Works
          </h2>

          <p className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From farm inputs to deployment-ready climate settings — generated through a precise four-step workflow.
          </p>
        </motion.div>

        {/* Timeline Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="relative flex flex-col justify-between rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-7 pb-9 backdrop-blur-xl h-full transition-all duration-300 hover:border-brand/35 hover:bg-white/[0.06] hover:shadow-[0_12px_24px_rgba(238,92,120,0.08)]"
              >
                {/* Step Number */}
                <div className="absolute right-6 top-6 text-5xl font-extrabold text-white/10 font-mono tracking-wider select-none pointer-events-none">
                  {step.id}
                </div>

                <div>
                  {/* Icon Container */}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-brand to-brand-dark shadow-md shadow-brand/20">
                    <Icon className="text-white" size={24} />
                  </div>

                  {/* Stage tag */}
                  <div className="mb-3">
                    <span className="inline-block text-[10px] font-mono tracking-widest text-brand font-bold bg-brand/10 border border-brand/20 px-2 py-0.5 rounded uppercase">
                      {step.stage}
                    </span>
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-white tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-20 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-10 text-center backdrop-blur-xl hover:border-brand/20 transition-colors duration-500"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">
            Ready to Generate Your First Controller Recipe?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-gray-400 leading-relaxed">
            Start generating detailed settings for poultry climate controllers dynamically 
            configured in Celsius and seconds timers.
          </p>

          <motion.button 
            onClick={() => navigate("/farm-infrastructure")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-8 py-4 font-semibold text-white transition-all duration-300 cursor-pointer shadow-lg shadow-brand/20 hover:shadow-brand/40"
          >
            Generate Settings Recipe
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}