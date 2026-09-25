import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, Printer, Save, ArrowLeft, CheckCircle, Fan } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import PageStepper from "../../components/common/PageStepper";

const GeneratedSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Stage');

  const [recipe] = useState(location.state?.recipe || null);
  const [recipeData] = useState(location.state?.recipe?.recipeData || null);
  const [calcParams] = useState(location.state?.recipe?.calculatedParameters || null);
  const [farmInputData] = useState(location.state?.formData || null);

  const isZ800 = recipe?.controllerModel === 'Z800';
  const tabs = isZ800 ? ['Stage', 'Ventilation', 'Cooling'] : ['Stage', 'Ventilation', 'Cooling', 'Humidity', 'Lighting', 'Feeding'];

  const handleDownloadPDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveRecipe = () => {
    try {
      const wb = XLSX.utils.book_new();

      // 1. Farm Information
      const farmInfoData = [
        { Parameter: "Farm Name", Value: farmInputData?.farmName || recipe?.farmName || "N/A" },
        { Parameter: "Owner Name", Value: farmInputData?.ownerName || recipe?.ownerName || "N/A" },
        { Parameter: "Location", Value: farmInputData?.location || recipe?.location || "N/A" },
        { Parameter: "Controller Model", Value: farmInputData?.controllerModel || recipe?.controllerModel || "N/A" },
        { Parameter: "Length (ft)", Value: farmInputData?.length || "N/A" },
        { Parameter: "Width (ft)", Value: farmInputData?.width || "N/A" },
        { Parameter: "Side Wall Height (ft)", Value: farmInputData?.sideWallHeight || "N/A" },
        { Parameter: "Center Peak Height (ft)", Value: farmInputData?.centerPeakHeight || "N/A" },
        { Parameter: "Bird Capacity", Value: farmInputData?.birdCapacity || "N/A" },
        { Parameter: "Volume (cu ft)", Value: calcParams?.volumeCuFt || "N/A" }
      ];
      const wsFarm = XLSX.utils.json_to_sheet(farmInfoData);
      XLSX.utils.book_append_sheet(wb, wsFarm, "Farm Info");

      // 2. Stage Settings
      if (recipeData?.stages && recipeData.stages.length > 0) {
        const stageSettingsData = recipeData.stages.map(s => ({
          "Stage": s.stageNum || s.stage,
          "Max Age (Days)": s.maxAge || s.dayRange || s.day,
          "Target Temp (°C)": s.target || s.targetTemp,
          "Heat Temp (°C)": s.heat || s.heatingTemp,
          "Cooling Temp (°C)": s.cool || s.coolingTemp,
          "Min Alarm (°C)": s.alarmMin || s.minAlarm,
          "Max Alarm (°C)": s.alarmMax || s.maxAlarm
        }));
        const wsStages = XLSX.utils.json_to_sheet(stageSettingsData);
        XLSX.utils.book_append_sheet(wb, wsStages, "Stage Settings");
      }

      // 3. Ventilation
      if (recipeData?.ventilation && recipeData.ventilation.length > 0) {
        const ventData = recipeData.ventilation.map(v => ({
          "Level": v.level,
          "CFM": v.cfm,
          "Fan On (s)": v.fanOn,
          "Fan Off (s)": v.fanOff,
          "Fan %": v.fanPct,
          "Active Fans": v.fans ? (Array.isArray(v.fans) ? v.fans.join(", ") : v.fans) : "None"
        }));
        const wsVent = XLSX.utils.json_to_sheet(ventData);
        XLSX.utils.book_append_sheet(wb, wsVent, "Ventilation");
      }

      // 4. Cooling
      if (recipeData?.cooling && recipeData.cooling.length > 0) {
        const coolingData = recipeData.cooling.map(c => ({
          "Day": c.day,
          "Start Time": c.startTime,
          "Stop Time": c.stopTime,
          "On Time (s)": c.onTime,
          "Min Off (s)": c.minOff,
          "Max Off (s)": c.maxOff,
          "Off RH (%)": c.offRH
        }));
        const wsCooling = XLSX.utils.json_to_sheet(coolingData);
        XLSX.utils.book_append_sheet(wb, wsCooling, "Cooling");
      }

      // 5. Humidity
      if (recipeData?.humidity && recipeData.humidity.length > 0 && !isZ800) {
        const humData = recipeData.humidity.map(h => ({
          "Day": h.day,
          "Target Humidity (%)": h.humidity,
          "Delay": h.delay,
          "Duration": h.duration
        }));
        const wsHum = XLSX.utils.json_to_sheet(humData);
        XLSX.utils.book_append_sheet(wb, wsHum, "Humidity");
      }

      // Generate Excel file and trigger download
      const fileName = `${(recipe?.recipeName || "Farm_Settings").replace(/\s+/g, '_')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success("Settings saved to Excel successfully.");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to save Excel file.");
    }
  };

  const renderTimeInputs = (timeStr) => {
    const [hh, mm] = (timeStr || "00:00").split(":");
    return (
      <div className="flex items-center justify-center gap-1">
        <div className="bg-zinc-900 border border-white/15 rounded-lg px-2 py-1 text-white font-mono text-xs w-9 text-center">
          {hh || "00"}
        </div>
        <span className="text-zinc-500 font-bold">:</span>
        <div className="bg-zinc-900 border border-white/15 rounded-lg px-2 py-1 text-white font-mono text-xs w-9 text-center">
          {mm || "00"}
        </div>
      </div>
    );
  };

  const isApiError = location.state?.isError || (!recipe || !recipeData || !calcParams);

  if (isApiError) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between">
        <div className="print:hidden">
          <Navbar />
        </div>
        <div className="pt-32 pb-16 px-6 flex items-center justify-center flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <Fan size={32} className="animate-spin [animation-duration:3s]" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Engine Offline</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              We couldn't retrieve the recipe from the ZSE Engine Backend. Please make sure both servers are running.
            </p>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 text-left font-mono text-xs text-zinc-300">
              <span className="text-zinc-500"># Start both servers together from root:</span>
              <div className="mt-1.5 text-brand font-semibold">npm run dev</div>
            </div>
            <button
              onClick={() => navigate('/farm-infrastructure')}
              className="w-full py-3.5 bg-brand hover:bg-brand-dark rounded-2xl text-sm font-semibold transition-all cursor-pointer text-white shadow-lg shadow-brand/20"
            >
              Configure Farm Setup
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const fanCount = recipeData.ventilation?.[0]?.fans?.length || 10;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-section {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .page-break-before {
            page-break-before: always;
          }
        }
      `}} />
      
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* ========================================== */}
      {/* SCREEN VIEW (HIDDEN ON PRINT)             */}
      {/* ========================================== */}
      <div className="pt-24 pb-16 px-6 print:hidden">
        <div className="max-w-7xl mx-auto">
          {/* Stepper */}
          <PageStepper currentStep={4} />

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <CheckCircle className="text-brand" size={38} />
                <h1 className="text-5xl font-semibold tracking-tight">Controller Settings</h1>
              </div>
              <p className="text-2xl text-zinc-400">{recipe.recipeName}</p>
            </div>

            <div className="flex gap-3 mt-8 lg:mt-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadPDF}
                className="flex items-center gap-3 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-sm font-medium transition-all cursor-pointer"
              >
                <Download size={18} />
                Save PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePrint}
                className="flex items-center gap-3 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-sm font-medium transition-all cursor-pointer"
              >
                <Printer size={18} />
                Print Settings
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveRecipe}
                className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-brand to-brand-dark rounded-2xl text-sm font-semibold shadow-lg shadow-brand/30 cursor-pointer text-white"
              >
                <Save size={18} />
                Save Settings
              </motion.button>
            </div>
          </div>

          {/* Recipe Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-9 text-sm">
              <div>
                <div className="text-zinc-400 mb-1">Farm Name</div>
                <div className="font-medium">{recipe.farmName}</div>
              </div>
              <div>
                <div className="text-zinc-400 mb-1">Controller Model</div>
                <div className="font-medium text-brand font-semibold">{recipe.controllerModel}</div>
              </div>
              <div>
                <div className="text-zinc-400 mb-1">Generated</div>
                <div className="font-medium">{recipe.generatedTime}</div>
              </div>
              <div>
                <div className="text-zinc-400 mb-1">Weather Parameters</div>
                <div className="font-medium">{recipe.weatherUsed}</div>
              </div>
              <div>
                <div className="text-zinc-400 mb-1">Farm Type</div>
                <div className="font-medium">{recipe.farmType}</div>
              </div>
              <div>
                <div className="text-zinc-400 mb-1">Location</div>
                <div className="font-medium">{recipe.location}</div>
              </div>
              <div>
                <div className="text-zinc-400 mb-1">Version</div>
                <div className="font-medium">{recipe.controllerVersion}</div>
              </div>
              <div>
                <div className="text-zinc-400 mb-1">Status</div>
                <div className="inline-flex items-center gap-2 text-brand">
                  <CheckCircle size={18} />
                  <span className="font-medium">{recipe.status}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Farm Input Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-brand"></span>
              Farm Input Summary
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Shed Dimensions (L×W×H)</div>
                <div className="text-xl font-semibold text-brand">
                  {farmInputData?.length || '--'} × {farmInputData?.width || '--'} × {farmInputData?.height || '--'} ft
                </div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Bird Capacity</div>
                <div className="text-xl font-semibold text-brand">{farmInputData?.birdCapacity ? Number(farmInputData.birdCapacity).toLocaleString() : '--'} birds</div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Fan Setup</div>
                <div className="text-xl font-semibold text-brand">{farmInputData?.fanCount || '--'} × {farmInputData?.fanSize || '--'}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Breed</div>
                <div className="text-xl font-semibold text-brand">{farmInputData?.breed || '--'}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Placement Date</div>
                <div className="text-xl font-semibold text-brand">{farmInputData?.placementDate || '--'}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Total Fan Capacity</div>
                <div className="text-xl font-semibold text-brand">{calcParams.totalFanCFM}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Shed Area</div>
                <div className="text-xl font-semibold text-brand">{calcParams.areaSqFt}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Shed Volume</div>
                <div className="text-xl font-semibold text-brand">{calcParams.volumeCuFt}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Cooling Pad Surface</div>
                <div className="text-xl font-semibold text-brand">{calcParams.coolingPadArea}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="text-zinc-500 mb-2 font-medium">Flock Density</div>
                <div className="text-xl font-semibold text-brand">{calcParams.birdDensity}</div>
              </div>
            </div>
          </motion.div>

          {/* Temperature & Humidity Set-Point Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-brand"></span>
              Temperature & Humidity Curve (by Bird Age)
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <ResponsiveContainer width="100%" height={420}>
                <AreaChart
                  data={(() => {
                    const chartData = [];
                    if (recipeData?.stages) {
                      recipeData.stages.forEach((s) => {
                        chartData.push({
                          day: parseInt(s.dayRange || s.day),
                          target: parseFloat(s.targetTemp),
                          heating: parseFloat(s.heatingTemp),
                          cooling: parseFloat(s.coolingTemp),
                          minAlarm: parseFloat(s.minAlarm),
                          maxAlarm: parseFloat(s.maxAlarm),
                        });
                      });
                    }
                    // add humidity data points
                    if (recipeData?.humidity) {
                      recipeData.humidity.forEach((h) => {
                        const existing = chartData.find(d => d.day === h.day);
                        if (existing) {
                          existing.humidity = h.humidity;
                        } else {
                          chartData.push({ day: h.day, humidity: h.humidity });
                        }
                      });
                    }
                    chartData.sort((a, b) => a.day - b.day);
                    
                    // Forward-fill humidity so the line continues to the end
                    let lastHum = null;
                    chartData.forEach(d => {
                      if (d.humidity !== undefined) lastHum = d.humidity;
                      else if (lastHum !== null) d.humidity = lastHum;
                    });

                    return chartData;
                  })()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                >
                  <defs>
                    <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d11243" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d11243" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradHumidity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis 
                    dataKey="day" 
                    height={80}
                    stroke="#71717a" 
                    tick={{ fill: '#a1a1aa', fontSize: 12, dy: 10 }} 
                    label={{ value: 'Bird Age (Days)', position: 'insideBottom', offset: 40, fill: '#a1a1aa', fontSize: 13 }}
                  />
                  <YAxis 
                    yAxisId="temp"
                    stroke="#71717a" 
                    tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                    label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#a1a1aa', fontSize: 13 }}
                    domain={['dataMin - 3', 'dataMax + 3']}
                  />
                  <YAxis 
                    yAxisId="hum"
                    orientation="right"
                    stroke="#38bdf8" 
                    tick={{ fill: '#38bdf8', fontSize: 12 }} 
                    label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight', fill: '#38bdf8', fontSize: 13 }}
                    domain={[30, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px', 
                      color: '#fff',
                      fontSize: '13px'
                    }} 
                    labelFormatter={(v) => `Day ${v}`}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: '25px', fontSize: '13px' }}
                  />
                  <Area yAxisId="temp" type="monotone" dataKey="target" stroke="#d11243" strokeWidth={2.5} fill="url(#gradTarget)" name="Target Temp (°C)" connectNulls />
                  <Line yAxisId="temp" type="monotone" dataKey="heating" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3 }} name="Heating Temp (°C)" connectNulls />
                  <Line yAxisId="temp" type="monotone" dataKey="cooling" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3 }} name="Cooling Temp (°C)" connectNulls />
                  <Line yAxisId="temp" type="monotone" dataKey="minAlarm" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Min Alarm (°C)" connectNulls />
                  <Line yAxisId="temp" type="monotone" dataKey="maxAlarm" stroke="#f87171" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Max Alarm (°C)" connectNulls />
                  <Area yAxisId="hum" type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} fill="url(#gradHumidity)" name="Humidity Set Point (%)" connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="border-b border-white/10 mb-8">
            <div className="flex overflow-x-auto pb-1 gap-10 text-lg">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-5 px-1 font-medium transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab ? 'text-brand' : 'text-zinc-400 hover:text-white'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
            >
              {/* STAGE TAB */}
              {activeTab === 'Stage' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-center border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-400 bg-zinc-950/20">
                          <th className="px-4 py-6 font-medium border-r border-white/10">Stage</th>
                          <th className="px-4 py-6 font-medium border-r border-white/10">Day</th>
                          <th className="px-4 py-6 font-medium border-r border-white/10">Target Temp</th>
                          <th className="px-4 py-6 font-medium border-r border-white/10">Heating Temp</th>
                          <th className="px-4 py-6 font-medium border-r border-white/10">Cooling Temp</th>
                          <th className="px-4 py-6 font-medium border-r border-white/10">Min Alarm</th>
                          <th className="px-4 py-6 font-medium border-r border-white/10">Max Alarm</th>
                          <th className="px-4 py-6 font-medium border-r border-white/10">Level Safe</th>
                          <th className="px-4 py-6 font-medium border-r border-white/10">Level Min</th>
                          <th className="px-4 py-6 font-medium">Level Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-sm">
                        {recipeData.stages.map((stage, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-5 font-semibold text-zinc-300 border-r border-white/5">STAGE {stage.stage}</td>
                            <td className="px-4 py-5 font-bold text-zinc-200 border-r border-white/5">{stage.dayRange || stage.day}</td>
                            <td className="px-4 py-5 text-brand font-bold border-r border-white/5">{stage.targetTemp}</td>
                            <td className="px-4 py-5 border-r border-white/5">{stage.heatingTemp}</td>
                            <td className="px-4 py-5 border-r border-white/5 text-brand">{stage.coolingTemp}</td>
                            <td className="px-4 py-5 text-rose-400 border-r border-white/5">{stage.minAlarm}</td>
                            <td className="px-4 py-5 text-rose-400 border-r border-white/5">{stage.maxAlarm}</td>
                            <td className="px-4 py-5 border-r border-white/5 text-brand font-bold">{stage.ventSafe}</td>
                            <td className="px-4 py-5 border-r border-white/5 font-bold text-zinc-200">{stage.ventMin}</td>
                            <td className="px-4 py-5 font-bold text-zinc-200">{stage.ventMax}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VENTILATION TAB */}
              {activeTab === 'Ventilation' && (
                <div className="space-y-6">
                  {/* Ventilation Warnings */}
                  {recipeData.ventilationWarnings && recipeData.ventilationWarnings.length > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
                      <div className="text-amber-400 font-semibold text-sm mb-2">⚠ Capacity Warnings</div>
                      {recipeData.ventilationWarnings.map((w, i) => (
                        <div key={i} className="text-amber-300/80 text-xs mb-1">{w}</div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1800px] text-center border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-400 bg-zinc-950/20">
                            <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Level</th>
                            <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Effective CFM</th>
                            <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Error %</th>
                            <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Air Speed</th>
                            <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">T-Delta</th>
                            <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Fan On(s)</th>
                            <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Fan Off(s)</th>
                            <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Capacity %</th>
                            <th colSpan={fanCount} className="px-4 py-3 font-semibold bg-brand/10 text-brand border-b border-white/10">
                              VENTILATION FAN SETTINGS
                            </th>
                          </tr>
                          <tr className="border-b border-white/10 text-xs text-zinc-400 bg-zinc-950/10">
                            {Array.from({ length: fanCount }).map((_, fIdx) => (
                              <th key={fIdx} className="px-2 py-3 border-r border-white/5 last:border-r-0 min-w-[75px]">
                                <div className="w-7 h-7 rounded-full border border-zinc-500 flex items-center justify-center mx-auto text-zinc-300 font-bold text-xs bg-zinc-900">
                                  {fIdx + 1}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                          {recipeData.ventilation.map((vent, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-5 font-bold text-zinc-300 border-r border-white/5">L{vent.level}</td>
                              <td className="px-4 py-5 border-r border-white/5 font-semibold text-zinc-200">{vent.cfm}</td>
                              <td className="px-4 py-5 border-r border-white/5">
                                <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                                  (vent.errorPercent || 0) <= 2 ? 'bg-emerald-500/15 text-emerald-400' :
                                  (vent.errorPercent || 0) <= 5 ? 'bg-amber-500/15 text-amber-400' :
                                  'bg-rose-500/15 text-rose-400'
                                }`}>
                                  {vent.errorPercent != null ? `${vent.errorPercent}%` : '—'}
                                </span>
                              </td>
                              <td className="px-4 py-5 border-r border-white/5 text-cyan-400 font-mono text-xs">
                                <div>{vent.airSpeedFtMin || '—'}</div>
                                <div className="text-zinc-500 text-[10px]">{vent.airSpeedMs || ''}</div>
                              </td>
                              <td className="px-4 py-5 border-r border-white/5 text-brand font-semibold">{vent.tDelta}</td>
                              <td className="px-4 py-5 border-r border-white/5 font-mono">{vent.fanOn}</td>
                              <td className="px-4 py-5 border-r border-white/5 font-mono">{vent.fanOff}</td>
                              <td className="px-4 py-5 border-r border-white/5 text-brand font-bold">{vent.fanPct}</td>
                              {vent.fans && vent.fans.map((fanStatus, fIdx) => {
                                let circleClass;
                                let label;
                                let labelClass;
                                let iconClass;
                                let dutyBadge = null;

                                const detail = vent.fanDetails && vent.fanDetails[fIdx];

                                if (fanStatus === "ON") {
                                  // CONTINUOUS ON
                                  circleClass = "border-emerald-400 bg-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/5";
                                  label = "ON";
                                  labelClass = "text-emerald-400 font-semibold";
                                  iconClass = "animate-spin [animation-duration:2.5s]";
                                } else if (fanStatus === "TIMER") {
                                  // TIMER ON/OFF
                                  circleClass = "border-amber-400 bg-amber-500/15 text-amber-400 shadow-md shadow-amber-500/5";
                                  label = "TIMER";
                                  labelClass = "text-amber-400 font-semibold";
                                  iconClass = "animate-pulse";
                                  if (detail && detail.dutyPercent) {
                                    dutyBadge = `${detail.dutyPercent}%`;
                                  }
                                } else if (fanStatus === "CYCLE") {
                                  // CYCLE / ROTATION
                                  circleClass = "border-sky-400 bg-sky-500/15 text-sky-400 shadow-md shadow-sky-500/5";
                                  label = "ROTATION";
                                  labelClass = "text-sky-400 font-semibold";
                                  iconClass = "animate-spin [animation-duration:4s]";
                                  if (detail && detail.dutyPercent && !detail.isStandby) {
                                    dutyBadge = `${detail.dutyPercent}%`;
                                  }
                                  if (detail && detail.isStandby) {
                                    label = "STBY";
                                  }
                                } else if (fanStatus === "ON/OFF") {
                                  // Legacy ON/OFF support
                                  circleClass = "border-amber-400 bg-amber-500/15 text-amber-400 shadow-md shadow-amber-500/5";
                                  label = "ON/OFF";
                                  labelClass = "text-amber-400 font-semibold";
                                  iconClass = "animate-pulse";
                                } else {
                                  // OFF
                                  circleClass = "border-zinc-700 bg-zinc-900/60 text-zinc-500";
                                  label = "OFF";
                                  labelClass = "text-zinc-500";
                                  iconClass = "";
                                }

                                return (
                                  <td key={fIdx} className="px-2 py-4 border-r border-white/5 last:border-r-0">
                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center mx-auto ${circleClass}`}>
                                      <Fan size={14} className={iconClass} />
                                    </div>
                                    <div className={`text-[8px] mt-1 font-bold uppercase tracking-tight ${labelClass}`}>
                                      {label}
                                    </div>
                                    {dutyBadge && (
                                      <div className="text-[7px] mt-0.5 font-mono text-zinc-400">
                                        {dutyBadge}
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* COOLING TAB */}
              {activeTab === 'Cooling' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] text-center border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-400 bg-zinc-950/20">
                           <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Day</th>
                           <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Start Time(24hr)</th>
                           <th rowSpan={2} className="px-4 py-4 font-medium border-r border-white/10">Stop Time(24hr)</th>
                           <th colSpan={5} className="px-4 py-2 font-semibold bg-brand/10 text-brand border-b border-white/10 border-r border-white/10">
                             COOLING PAD SETTINGS
                           </th>
                           <th colSpan={5} className="px-4 py-2 font-semibold bg-white/5 text-zinc-400 border-b border-white/10">
                             FOGGER SETTINGS
                           </th>
                         </tr>
                         <tr className="border-b border-white/10 text-xs text-zinc-400 bg-zinc-950/10">
                           <th className="px-2 py-3 border-r border-white/5">On(s)</th>
                           <th className="px-2 py-3 border-r border-white/5">Min Off(s)</th>
                           <th className="px-2 py-3 border-r border-white/5">Max Off(s)</th>
                           <th className="px-2 py-3 border-r border-white/5">Off RH(%)</th>
                           <th className="px-2 py-3 border-r border-white/10">T-Diff(°C)</th>
                           
                           <th className="px-2 py-3 border-r border-white/5">On(s)</th>
                           <th className="px-2 py-3 border-r border-white/5">Min Off(s)</th>
                           <th className="px-2 py-3 border-r border-white/5">Max Off(s)</th>
                           <th className="px-2 py-3 border-r border-white/5">Off RH(%)</th>
                           <th className="px-2 py-3">T-Diff(°C)</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-white/10 text-sm">
                         {recipeData.cooling.map((cool, idx) => (
                           <tr key={idx} className="hover:bg-white/5 transition-colors">
                             <td className="px-4 py-5 font-bold text-zinc-300 border-r border-white/5">{cool.day}</td>
                             <td className="px-4 py-5 border-r border-white/5">{renderTimeInputs(cool.startTime)}</td>
                             <td className="px-4 py-5 border-r border-white/5">{renderTimeInputs(cool.stopTime)}</td>
                            
                            {/* Cooling Pad Settings */}
                            <td className="px-2 py-5 border-r border-white/5 text-brand font-semibold">{cool.onTime}</td>
                            <td className="px-2 py-5 border-r border-white/5">{cool.minOff}</td>
                            <td className="px-2 py-5 border-r border-white/5">{cool.maxOff}</td>
                            <td className="px-2 py-5 border-r border-white/5 text-brand font-semibold">{cool.offRH}</td>
                            <td className="px-2 py-5 border-r border-white/10 text-brand font-semibold">{cool.tDiff}</td>

                            {/* Fogger Settings */}
                            <td className="px-2 py-5 border-r border-white/5 text-zinc-500">{cool.foggerOn}</td>
                            <td className="px-2 py-5 border-r border-white/5 text-zinc-500">{cool.foggerMinOff}</td>
                            <td className="px-2 py-5 border-r border-white/5 text-zinc-500">{cool.foggerMaxOff}</td>
                            <td className="px-2 py-5 border-r border-white/5 text-zinc-500">{cool.foggerOffRH}</td>
                            <td className="px-2 py-5 text-zinc-500">{cool.foggerTDiff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* HUMIDITY TAB */}
              {activeTab === 'Humidity' && (
                <div className="space-y-8">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-center border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-400 bg-zinc-950/20">
                            <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Day</th>
                            <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Humidity (%)</th>
                            <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Delay (Sec)</th>
                            <th className="px-8 py-6 font-medium text-center">Duration (Sec)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                          {recipeData.humidity.map((hum, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-8 py-6 font-medium text-zinc-300 border-r border-white/5">{hum.day}</td>
                              <td className="px-8 py-6 text-brand font-bold border-r border-white/5">{hum.humidity}</td>
                              <td className="px-8 py-6 border-r border-white/5">{hum.delay}</td>
                              <td className="px-8 py-6">{hum.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* LIGHTING TAB */}
              {activeTab === 'Lighting' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-center border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-400 bg-zinc-950/20">
                          <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Day</th>
                          <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Start Time</th>
                          <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Stop Time</th>
                          <th className="px-8 py-6 font-medium border-r border-white/10 text-center">On min</th>
                          <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Off min</th>
                          <th className="px-8 py-6 font-medium text-center">Intensity(%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-sm">
                        {recipeData.lighting.map((light, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-8 py-6 font-medium text-zinc-300 border-r border-white/5">{light.day}</td>
                            <td className="px-8 py-6 border-r border-white/5">{renderTimeInputs(light.startTime)}</td>
                            <td className="px-8 py-6 border-r border-white/5">{renderTimeInputs(light.stopTime)}</td>
                            <td className="px-8 py-6 border-r border-white/5">{light.onMin}</td>
                            <td className="px-8 py-6 border-r border-white/5">{light.offMin}</td>
                            <td className="px-8 py-6 text-brand font-bold">{light.intensity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FEEDING TAB */}
              {activeTab === 'Feeding' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-center border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-zinc-400 bg-zinc-950/20">
                          <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Day</th>
                          <th className="px-8 py-6 font-medium border-r border-white/10 text-center">Start Time</th>
                          <th className="px-8 py-6 font-medium text-center">Stop Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-sm">
                        {recipeData.feeding.map((feed, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-8 py-6 font-medium text-zinc-300 border-r border-white/5">{feed.day}</td>
                            <td className="px-8 py-6 border-r border-white/5">{renderTimeInputs(feed.startTime)}</td>
                            <td className="px-8 py-6">{renderTimeInputs(feed.stopTime)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Navigation */}
          <div className="mt-16 flex justify-between items-center text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/farm-infrastructure')}
              className="flex items-center gap-3 px-8 py-4 border border-white/20 hover:bg-white/5 rounded-2xl text-lg cursor-pointer"
            >
              <ArrowLeft size={22} />
              Back to Farm Setup
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-10 py-4 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold rounded-2xl text-lg cursor-pointer"
            >
              Return to Dashboard
            </motion.button>
          </div>
        </div>
        <Footer />
      </div>

      {/* ========================================== */}
      {/* PRINT LAYOUT (HIDDEN ON SCREEN, SAVES TO PDF) */}
      {/* ========================================== */}
      <div className="hidden print:block text-black bg-white font-sans p-8 space-y-12">
        {/* Cover Header */}
        <div className="border-b-2 border-black pb-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">Zivial Setting Engine (ZSE)</h1>
          <p className="text-lg font-medium text-gray-700 mt-2">Official Controller Configuration Report - {recipe.controllerModel}</p>
          
          <div className="grid grid-cols-2 gap-4 text-left text-sm mt-6 border border-gray-300 p-4 rounded-lg bg-gray-50">
            <div>
              <div><strong>Farm Name:</strong> {recipe.farmName}</div>
              <div><strong>Owner Name:</strong> {recipe.ownerName}</div>
              <div><strong>Location:</strong> {recipe.location}</div>
            </div>
            <div>
              <div><strong>Generated Time:</strong> {recipe.generatedTime}</div>
              <div><strong>Weather Condition:</strong> {recipe.weatherUsed}</div>
              <div><strong>Controller Version:</strong> {recipe.controllerVersion}</div>
            </div>
          </div>
        </div>

        {/* Calculations Section */}
        <div className="space-y-4 print-section">
          <h2 className="text-2xl font-bold border-b border-gray-400 pb-2">1. Farm Input Summary & Parameters</h2>
          <div className="grid grid-cols-3 gap-y-3 gap-x-6 text-sm">
            <div><strong>Shed Dimensions:</strong> {farmInputData?.length || '--'} × {farmInputData?.width || '--'} × {farmInputData?.height || '--'} ft</div>
            <div><strong>Bird Capacity:</strong> {farmInputData?.birdCapacity ? Number(farmInputData.birdCapacity).toLocaleString() : '--'} birds</div>
            <div><strong>Breed:</strong> {farmInputData?.breed || '--'}</div>
            <div><strong>Shed Area:</strong> {calcParams.areaSqFt}</div>
            <div><strong>Shed Volume:</strong> {calcParams.volumeCuFt}</div>
            <div><strong>Flock Density:</strong> {calcParams.birdDensity}</div>
            <div><strong>Fan Setup:</strong> {farmInputData?.fanCount || '--'} × {farmInputData?.fanSize || '--'}</div>
            <div><strong>Single Fan Rating:</strong> {calcParams.singleFanCFM}</div>
            <div><strong>Total Fan Capacity:</strong> {calcParams.totalFanCFM}</div>
            <div><strong>Cooling Pad Surface:</strong> {calcParams.coolingPadArea}</div>
            <div><strong>Placement Date:</strong> {farmInputData?.placementDate || '--'}</div>
            <div><strong>Required CFM:</strong> {calcParams.requiredCFM}</div>
          </div>
        </div>
        {/* Temperature & Humidity Chart (Print Version) */}
        <div className="space-y-4 print-section page-break-before">
          <h2 className="text-2xl font-bold border-b border-gray-400 pb-2">2. Temperature & Humidity Curve</h2>
          <div className="border border-gray-400 p-4 rounded-lg bg-white flex justify-center">
              <AreaChart
                width={750}
                height={350}
                data={(() => {
                  const chartData = [];
                  if (recipeData?.stages) {
                    recipeData.stages.forEach((s) => {
                      chartData.push({
                        day: parseInt(s.dayRange || s.day),
                        target: parseFloat(s.targetTemp),
                        heating: parseFloat(s.heatingTemp),
                        cooling: parseFloat(s.coolingTemp),
                        minAlarm: parseFloat(s.minAlarm),
                        maxAlarm: parseFloat(s.maxAlarm),
                      });
                    });
                  }
                  if (recipeData?.humidity) {
                    recipeData.humidity.forEach((h) => {
                      const existing = chartData.find(d => d.day === h.day);
                      if (existing) {
                        existing.humidity = h.humidity;
                      } else {
                        chartData.push({ day: h.day, humidity: h.humidity });
                      }
                    });
                  }
                  chartData.sort((a, b) => a.day - b.day);
                  
                  // Forward-fill humidity so the line continues to the end
                  let lastHum = null;
                  chartData.forEach(d => {
                    if (d.humidity !== undefined) lastHum = d.humidity;
                    else if (lastHum !== null) d.humidity = lastHum;
                  });

                  return chartData;
                })()}
                margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="gradTargetPrint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d11243" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#d11243" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="gradHumidityPrint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  height={80}
                  stroke="#374151" 
                  tick={{ fill: '#374151', fontSize: 12, dy: 10 }} 
                  label={{ value: 'Bird Age (Days)', position: 'insideBottom', offset: 40, fill: '#374151', fontSize: 13 }}
                />
                <YAxis 
                  yAxisId="temp"
                  stroke="#374151" 
                  tick={{ fill: '#374151', fontSize: 12 }} 
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#374151', fontSize: 13 }}
                  domain={['dataMin - 3', 'dataMax + 3']}
                />
                <YAxis 
                  yAxisId="hum"
                  orientation="right"
                  stroke="#0ea5e9" 
                  tick={{ fill: '#0ea5e9', fontSize: 12 }} 
                  label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight', fill: '#0ea5e9', fontSize: 13 }}
                  domain={[30, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    color: '#111827',
                    fontSize: '13px'
                  }} 
                  labelFormatter={(v) => `Day ${v}`}
                />
                <Legend 
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: '25px', fontSize: '13px', color: '#111827' }}
                />
                <Area isAnimationActive={false} yAxisId="temp" type="monotone" dataKey="target" stroke="#d11243" strokeWidth={2.5} fill="url(#gradTargetPrint)" name="Target Temp (°C)" connectNulls />
                <Line isAnimationActive={false} yAxisId="temp" type="monotone" dataKey="heating" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3 }} name="Heating Temp (°C)" connectNulls />
                <Line isAnimationActive={false} yAxisId="temp" type="monotone" dataKey="cooling" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3 }} name="Cooling Temp (°C)" connectNulls />
                <Line isAnimationActive={false} yAxisId="temp" type="monotone" dataKey="minAlarm" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Min Alarm (°C)" connectNulls />
                <Line isAnimationActive={false} yAxisId="temp" type="monotone" dataKey="maxAlarm" stroke="#f87171" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Max Alarm (°C)" connectNulls />
                <Area isAnimationActive={false} yAxisId="hum" type="monotone" dataKey="humidity" stroke="#0ea5e9" strokeWidth={2} fill="url(#gradHumidityPrint)" name="Humidity Set Point (%)" connectNulls />
              </AreaChart>
          </div>
        </div>
        {/* Stage Table */}
        <div className="space-y-4 page-break-before print-section">
          <h2 className="text-2xl font-bold border-b border-gray-400 pb-2">2. Stage Settings</h2>
          <table className="w-full border-collapse border border-gray-400 text-sm text-center">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400">
                <th className="border border-gray-400 p-2">Stages</th>
                <th className="border border-gray-400 p-2">Day</th>
                <th className="border border-gray-400 p-2">Target Temperature</th>
                <th className="border border-gray-400 p-2">Heating Temperature</th>
                <th className="border border-gray-400 p-2">Cooling Temperature</th>
                <th className="border border-gray-400 p-2">Temperature Min Alarm</th>
                <th className="border border-gray-400 p-2">Temperature Max Alarm</th>
                <th className="border border-gray-400 p-2">Ventilation Level Safe</th>
                <th className="border border-gray-400 p-2">Ventilation Level Min</th>
                <th className="border border-gray-400 p-2">Ventilation Level Max</th>
              </tr>
            </thead>
            <tbody>
              {recipeData.stages.map((stage, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="border border-gray-400 p-2 font-bold">STAGE {stage.stage}</td>
                  <td className="border border-gray-400 p-2">{stage.dayRange}</td>
                  <td className="border border-gray-400 p-2 font-bold text-emerald-800">{stage.targetTemp}</td>
                  <td className="border border-gray-400 p-2">{stage.heatingTemp}</td>
                  <td className="border border-gray-400 p-2 text-cyan-800">{stage.coolingTemp}</td>
                  <td className="border border-gray-400 p-2 text-red-700">{stage.minAlarm}</td>
                  <td className="border border-gray-400 p-2 text-red-700">{stage.maxAlarm}</td>
                  <td className="border border-gray-400 p-2 font-bold">{stage.ventSafe}</td>
                  <td className="border border-gray-400 p-2">{stage.ventMin}</td>
                  <td className="border border-gray-400 p-2">{stage.ventMax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ventilation Table */}
        <div className="space-y-4 page-break-before print-section">
          <h2 className="text-2xl font-bold border-b border-gray-400 pb-2">3. Ventilation Settings (Levels 1-16)</h2>
          <table className="w-full border-collapse border border-gray-400 text-xs text-center">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400">
                <th rowSpan={2} className="border border-gray-400 p-1">Ventilation Level</th>
                <th rowSpan={2} className="border border-gray-400 p-1">CFM</th>
                <th rowSpan={2} className="border border-gray-400 p-1">T-Delta</th>
                <th rowSpan={2} className="border border-gray-400 p-1">Fan On Time(s)</th>
                <th rowSpan={2} className="border border-gray-400 p-1">Fan Off Time(s)</th>
                <th rowSpan={2} className="border border-gray-400 p-1">FAN (%)</th>
                <th colSpan={fanCount} className="border border-gray-400 p-1 font-bold">
                  VENTILATION FAN SETTINGS
                </th>
              </tr>
              <tr className="bg-gray-55 border-b border-gray-400">
                {Array.from({ length: fanCount }).map((_, fIdx) => (
                  <th key={fIdx} className="border border-gray-400 p-1 font-bold">
                    {fIdx + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recipeData.ventilation.map((vent, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="border border-gray-400 p-1 font-bold">LEVEL {vent.level}</td>
                  <td className="border border-gray-400 p-1">{vent.cfm}</td>
                  <td className="border border-gray-400 p-1">{vent.tDelta}</td>
                  <td className="border border-gray-400 p-1">{vent.fanOn}</td>
                  <td className="border border-gray-400 p-1">{vent.fanOff}</td>
                  <td className="border border-gray-400 p-1 font-bold">{vent.fanPct}</td>
                  {vent.fans && vent.fans.map((fanStatus, fIdx) => {
                    let printLabel = "-";
                    if (fanStatus === "ON") printLabel = "ON";
                    else if (fanStatus === "TIMER") printLabel = "TIMER";
                    else if (fanStatus === "CYCLE") printLabel = "CYCLE";
                    else if (fanStatus === "ON/OFF") printLabel = "ON/OFF";

                    return (
                      <td key={fIdx} className="border border-gray-400 p-1 text-[9px] font-semibold">
                        {printLabel}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cooling Table */}
        <div className="space-y-4 page-break-before print-section">
          <h2 className="text-2xl font-bold border-b border-gray-400 pb-2">4. Cooling Pad & Fogger Settings</h2>
          <table className="w-full border-collapse border border-gray-400 text-xs text-center">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400">
                <th rowSpan={2} className="border border-gray-400 p-1">Day</th>
                <th rowSpan={2} className="border border-gray-400 p-1">Start</th>
                <th rowSpan={2} className="border border-gray-400 p-1">Stop</th>
                <th colSpan={5} className="border border-gray-400 p-1 font-bold">COOLING PAD SETTINGS</th>
                <th colSpan={5} className="border border-gray-400 p-1 font-bold">FOGGER SETTINGS</th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-400">
                <th className="border border-gray-400 p-1">On(s)</th>
                <th className="border border-gray-400 p-1">Min Off(s)</th>
                <th className="border border-gray-400 p-1">Max Off(s)</th>
                <th className="border border-gray-400 p-1">Off RH(%)</th>
                <th className="border border-gray-400 p-1">T-Diff(°C)</th>
                <th className="border border-gray-400 p-1">On(s)</th>
                <th className="border border-gray-400 p-1">Min Off(s)</th>
                <th className="border border-gray-400 p-1">Max Off(s)</th>
                <th className="border border-gray-400 p-1">Off RH(%)</th>
                <th className="border border-gray-400 p-1">T-Diff(°C)</th>
              </tr>
            </thead>
            <tbody>
              {recipeData.cooling.map((cool, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="border border-gray-400 p-1 font-bold">{cool.day}</td>
                  <td className="border border-gray-400 p-1">{cool.startTime}</td>
                  <td className="border border-gray-400 p-1">{cool.stopTime}</td>
                  <td className="border border-gray-400 p-1">{cool.onTime}</td>
                  <td className="border border-gray-400 p-1">{cool.minOff}</td>
                  <td className="border border-gray-400 p-1">{cool.maxOff}</td>
                  <td className="border border-gray-400 p-1">{cool.offRH}</td>
                  <td className="border border-gray-400 p-1">{cool.tDiff}</td>
                  <td className="border border-gray-400 p-1 text-gray-400">{cool.foggerOn}</td>
                  <td className="border border-gray-400 p-1 text-gray-400">{cool.foggerMinOff}</td>
                  <td className="border border-gray-400 p-1 text-gray-400">{cool.foggerMaxOff}</td>
                  <td className="border border-gray-400 p-1 text-gray-400">{cool.foggerOffRH}</td>
                  <td className="border border-gray-400 p-1 text-gray-400">{cool.foggerTDiff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Humidity Treatment Table */}
        {recipeData.humidity && (
          <div className="space-y-4 print-section">
            <h2 className="text-2xl font-bold border-b border-gray-400 pb-2">5. Humidity Treatment Settings</h2>
            <table className="w-full border-collapse border border-gray-400 text-sm text-center">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-400">
                  <th className="border border-gray-400 p-2">Day</th>
                  <th className="border border-gray-400 p-2">Humidity (%)</th>
                  <th className="border border-gray-400 p-2">Delay (Sec)</th>
                  <th className="border border-gray-400 p-2">Duration (Sec)</th>
                </tr>
              </thead>
              <tbody>
                {recipeData.humidity.map((hum, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="border border-gray-400 p-2 font-bold">{hum.day}</td>
                    <td className="border border-gray-400 p-2">{hum.humidity}</td>
                    <td className="border border-gray-400 p-2">{hum.delay}</td>
                    <td className="border border-gray-400 p-2">{hum.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Lighting Table */}
        <div className="space-y-4 page-break-before print-section">
          <h2 className="text-2xl font-bold border-b border-gray-400 pb-2">6. Lighting Settings</h2>
          <table className="w-full border-collapse border border-gray-400 text-sm text-center">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400">
                <th className="border border-gray-400 p-2">Day</th>
                <th className="border border-gray-400 p-2">Start Time</th>
                <th className="border border-gray-400 p-2">Stop Time</th>
                <th className="border border-gray-400 p-2">On min</th>
                <th className="border border-gray-400 p-2">Off min</th>
                <th className="border border-gray-400 p-2">Intensity(%)</th>
              </tr>
            </thead>
            <tbody>
              {recipeData.lighting.map((light, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="border border-gray-400 p-2 font-bold">{light.day}</td>
                  <td className="border border-gray-400 p-2">{light.startTime}</td>
                  <td className="border border-gray-400 p-2">{light.stopTime}</td>
                  <td className="border border-gray-400 p-2">{light.onMin}</td>
                  <td className="border border-gray-400 p-2">{light.offMin}</td>
                  <td className="border border-gray-400 p-2">{light.intensity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feeding Table */}
        <div className="space-y-4 page-break-before print-section">
          <h2 className="text-2xl font-bold border-b border-gray-400 pb-2">7. Feeding Settings</h2>
          <table className="w-full border-collapse border border-gray-400 text-sm text-center">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400">
                <th className="border border-gray-400 p-2">Day</th>
                <th className="border border-gray-400 p-2">Start Time</th>
                <th className="border border-gray-400 p-2">Stop Time</th>
              </tr>
            </thead>
            <tbody>
              {recipeData.feeding.map((feed, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="border border-gray-400 p-2 font-bold">{feed.day}</td>
                  <td className="border border-gray-400 p-2">{feed.startTime}</td>
                  <td className="border border-gray-400 p-2">{feed.stopTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneratedSettings;