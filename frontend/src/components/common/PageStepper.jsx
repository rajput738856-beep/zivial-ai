import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

/**
 * PageStepper — shared 4-step progress indicator
 * Props:
 *   currentStep: 1 | 2 | 3 | 4
 */
const STEPS = [
  { id: 1, label: 'Farm Data' },
  { id: 2, label: 'Farm Intelligence' },
  { id: 3, label: 'AI Analysis' },
  { id: 4, label: 'Controller Recipe' },
];

export default function PageStepper({ currentStep = 1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center flex-wrap gap-y-3 text-[10px] md:text-xs font-semibold mb-10"
    >
      {STEPS.map((step, idx) => {
        const isDone    = step.id < currentStep;
        const isActive  = step.id === currentStep;
        const isUpcoming = step.id > currentStep;
        const isLast    = idx === STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step node */}
            <div className={`flex items-center gap-1.5 ${
              isDone    ? 'text-emerald-500' :
              isActive  ? 'text-white' :
              'text-zinc-500'
            }`}>
              {isDone ? (
                <CheckCircle2 size={14} />
              ) : isActive ? (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-[10px] shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                  {step.id}
                </span>
              ) : (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-[10px]">
                  {step.id}
                </span>
              )}

              <span className={isActive ? 'font-bold' : ''}>
                {step.label}
              </span>

              {/* Active underline */}
              {isActive && (
                <span className="hidden" />
              )}
            </div>

            {/* Connector */}
            {!isLast && (
              <div className={`h-[1px] w-8 md:w-16 mx-2 ${isDone ? 'bg-emerald-500/40' : 'bg-zinc-800'}`} />
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
