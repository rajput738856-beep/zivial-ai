import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Loader2, Cpu } from 'lucide-react';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import PageStepper from "../../components/common/PageStepper";

const AIProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    "Validating Farm Configuration",
    "Fetching Weather Coordinates",
    "Calculating Engineering Parameters",
    "Applying Climate Standards",
    "Mapping 16 Ventilation Levels",
    "Finalizing Controller Configuration"
  ];

  useEffect(() => {
    let isMounted = true;
    let localResult = null;
    let isError = false;

    const farmData = location.state?.farmData || {};

    // Fetch from backend
    fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(farmData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API call failed");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.success) {
          localResult = data.recipe;
        }
      })
      .catch((err) => {
        console.error("Error generating recipe from backend:", err);
        isError = true;
      });

    let elapsed = 0;
    const totalTime = 3000; // 3 seconds calculation progress
    const intervalTime = 100;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      let targetProgress = Math.min(Math.floor((elapsed / totalTime) * 100), 100);

      if (targetProgress >= 90 && !localResult && !isError) {
        targetProgress = 90;
      }

      setProgress((prev) => {
        const next = Math.max(prev, targetProgress);

        const stepIndex = Math.floor((next / 100) * steps.length);
        
        setCompletedSteps(prevCompleted => {
          if (stepIndex > prevCompleted.length) {
            return steps.slice(0, stepIndex);
          }
          return prevCompleted;
        });
        
        setCurrentStep(Math.min(stepIndex, steps.length - 1));

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/generated-settings", {
              state: {
                recipe: localResult,
                formData: farmData,
                isError: isError
              },
            });
          }, 400);
        }

        return next;
      });
    }, intervalTime);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [navigate, location.state]);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6 min-h-[calc(100vh-80px)] flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <PageStepper currentStep={3} />
        </div>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual Math Processing Wheel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[520px] flex items-center justify-center"
            >
              <div className="relative w-[420px] h-[420px]">
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.03, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity }
                  }}
                  className="absolute inset-0 border border-brand/20 rounded-full"
                />
                
                <motion.div 
                  animate={{ 
                    rotate: -360 
                  }}
                  transition={{ 
                    duration: 18, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-8 border border-brand-dark/20 rounded-full"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      boxShadow: [
                        "0 0 60px 20px rgba(209, 18, 67, 0.25)",
                        "0 0 90px 35px rgba(153, 13, 49, 0.2)"
                      ]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-52 h-52 bg-gradient-to-br from-zinc-900 to-black border border-brand/50 rounded-3xl flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="grid grid-cols-4 grid-rows-4 gap-1.5 w-36 h-36 opacity-35">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="bg-brand rounded-sm" />
                      ))}
                    </div>

                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute text-brand"
                    >
                      <Cpu size={84} strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div 
                  animate={{ scale: [0.6, 1.8, 2.4], opacity: [0.5, 0.15, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity }}
                  className="absolute inset-0 border border-brand/30 rounded-full"
                />
              </div>
            </motion.div>

            {/* Processing Steps list */}
            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand/10 border border-brand/20 rounded-3xl mb-6">
                  <div className="w-2.5 h-2.5 bg-brand rounded-full animate-pulse" />
                  <span className="text-sm font-semibold tracking-widest text-brand">ZSE MODULE ACTIVE</span>
                </div>
                
                <h1 className="text-5xl font-semibold tracking-tighter leading-none mb-6">
                  Calculating Controller<br />Settings...
                </h1>
                
                <p className="text-xl text-zinc-400 max-w-md">
                  Please wait while the calculation engine creates the climate controller config.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5">
                {steps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step);
                  const isCurrent = index === currentStep && !isCompleted;
                  
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-5"
                    >
                      <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-brand"
                          >
                            <Check size={26} strokeWidth={3} />
                          </motion.div>
                        ) : isCurrent ? (
                          <Loader2 size={26} className="text-brand animate-spin" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-zinc-700 rounded-full" />
                        )}
                      </div>
                      
                      <div className={`text-lg transition-all duration-300 ${isCompleted ? 'text-brand opacity-60 line-through' : isCurrent ? 'text-white font-medium' : 'text-zinc-400'}`}>
                        {step}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-4">
                <div className="flex justify-between text-sm mb-3 px-1">
                  <span className="text-zinc-400">Processing calculations</span>
                  <span className="font-mono text-brand font-bold tabular-nums">{Math.floor(progress)}%</span>
                </div>
                
                <div className="h-2.5 bg-zinc-900 rounded-3xl overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-3xl relative"
                  />
                </div>
                
                <div className="text-[10px] font-mono text-center text-zinc-500 mt-4 tracking-[2px]">
                  SOLVING ENVIRONMENTAL EQUATIONS
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIProcessing;