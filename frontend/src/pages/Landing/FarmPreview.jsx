import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, MapPin, Gauge, Users, Fan as FanIcon, Droplet, Clock, Ruler, 
  ArrowLeft, Sparkles, User, ThermometerSun, Droplets, Edit2, Save, X, Info, AlertTriangle,
  CheckCircle2, Sun, Snowflake, Box, Cpu
} from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from "../../components/layout/Navbar";
import PageStepper from "../../components/common/PageStepper";
import Footer from "../../components/layout/Footer";

// Digital Twin Video Import
import FarmVideo from "../../assets/Zivial Farm tune.mp4";

const DEFAULT_STAGES = [
  { stageNum: 1, maxAge: 1, target: 34.4, heat: 32.6, cool: 34.6, alarmMin: 30, alarmMax: 38, ventSafe: 1, ventMin: 1, ventMax: 5, dayRange: "1" },
  { stageNum: 2, maxAge: 3, target: 32.0, heat: 30.4, cool: 32.2, alarmMin: 29, alarmMax: 36, ventSafe: 5, ventMin: 6, ventMax: 11, dayRange: "3" },
  { stageNum: 3, maxAge: 7, target: 29.0, heat: 27.5, cool: 29.0, alarmMin: 28, alarmMax: 35, ventSafe: 8, ventMin: 8, ventMax: 13, dayRange: "7" },
  { stageNum: 4, maxAge: 10, target: 28.0, heat: 26.5, cool: 28.0, alarmMin: 27, alarmMax: 32, ventSafe: 10, ventMin: 10, ventMax: 13, dayRange: "14" },
  { stageNum: 5, maxAge: 15, target: 27.2, heat: 25.3, cool: 27.2, alarmMin: 25, alarmMax: 31, ventSafe: 11, ventMin: 11, ventMax: 14, dayRange: "21" },
  { stageNum: 6, maxAge: 20, target: 26.6, heat: 24.0, cool: 26.6, alarmMin: 22, alarmMax: 30, ventSafe: 11, ventMin: 11, ventMax: 14, dayRange: "28" },
  { stageNum: 7, maxAge: 25, target: 25.0, heat: 22.5, cool: 25.0, alarmMin: 21, alarmMax: 29, ventSafe: 11, ventMin: 11, ventMax: 14, dayRange: "35" },
  { stageNum: 8, maxAge: 30, target: 23.9, heat: 21.5, cool: 24.0, alarmMin: 21, alarmMax: 29, ventSafe: 11, ventMin: 13, ventMax: 16, dayRange: "42" },
  { stageNum: 9, maxAge: 35, target: 22.2, heat: 20.5, cool: 22.2, alarmMin: 18, alarmMax: 29, ventSafe: 11, ventMin: 13, ventMax: 16, dayRange: "45" },
  { stageNum: 10, maxAge: Infinity, target: 21.0, heat: 19.5, cool: 21.0, alarmMin: 18, alarmMax: 28, ventSafe: 13, ventMin: 14, ventMax: 16, dayRange: "46" }
];

const FarmPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const farmData = location.state || {};
  const {
    farmName = "Untitled Farm",
    ownerName = "",
    location: farmLocation = "Delhi, India",
    controllerModel = "Z1000",
    length = 200,
    width = 60,
    height = 20,
    birdCapacity = 25000,
    placementDate = "",
    fanCount = 8,
    fanSize = "48 Inch",
    coolingPadLength = 60,
    padHeight = 6,
    description = "Modern poultry farm optimized for high-density broiler production with advanced ZSE climate control.",
    fanInputType = "size",
    fanCFM = ""
  } = farmData;

  const airVolume = Math.round(length * width * height);
  const coolingPadArea = Math.round(coolingPadLength * (padHeight || 6));
  const requiredCFM = Math.round(airVolume * 2.7);

  // Weather State
  const [weather, setWeather] = useState({
    temperature: 28,
    humidity: 65,
    condition: "Loading weather...",
    isLoading: true
  });

  // CFM lookup by fan size
  const CFM_BY_SIZE = {
    '24 Inch': 6000, '36 Inch': 11000, '48 Inch': 20000,
    '50 Inch': 22000, '54 Inch': 25000, '60 Inch': 30000
  };

  // Editable sensor inputs
  const [sensorInputs, setSensorInputs] = useState({
    temp1: 26.8,
    temp2: 27.5,
    temp3: 25.9,
    insideHumidity: 62,
    activeFans: parseFloat(fanCount) || 8,
    birdAge: 21
  });

  const handleSensorChange = (field, val) => {
    setSensorInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  // ── Effective Temperature Calculations ────────────────────────────────────
  // 1. Temperature-Humidity Index (THI) — poultry standard
  //    THI = T - (0.31 - 0.31 × RH/100) × (T - 14.4)
  const calcTHI = (T, RH) => {
    const thi = T - (0.31 - 0.31 * (RH / 100)) * (T - 14.4);
    return Math.round(thi * 10) / 10;
  };

  // 2. Air velocity from fans (m/s)
  //    Total airflow (CFM) → m³/s ÷ cross-section area (m²)
  const fanCFMValue = fanInputType === 'cfm'
    ? parseFloat(fanCFM) || 0
    : (CFM_BY_SIZE[fanSize] || 10500);
  const totalActiveCFM = sensorInputs.activeFans * fanCFMValue;
  const crossSectionM2 = width * height * 0.0929;            // ft² → m²
  const airVelocityMs = crossSectionM2 > 0
    ? (totalActiveCFM * 0.000471947) / crossSectionM2        // m/s
    : 0;

  // 3. Ventilation cooling effect (broiler standard: 1.5 °C per m/s, max 6 °C)
  const coolingEffect = Math.min(airVelocityMs * 1.5, 6);

  // 4. Effective Temperature = THI − cooling from ventilation
  const calcET = (T, RH) => Math.round((calcTHI(T, RH) - coolingEffect) * 10) / 10;

  // 5. Age-appropriate target temperature (Week 1 → 35°C, -3°C per week)
  const targetTemp = Math.max(20, 35 - Math.floor(sensorInputs.birdAge / 7) * 3);

  // 6. Derived per-point effective temps
  const et1 = calcET(sensorInputs.temp1, sensorInputs.insideHumidity);
  const et2 = calcET(sensorInputs.temp2, sensorInputs.insideHumidity);
  const et3 = calcET(sensorInputs.temp3, sensorInputs.insideHumidity);

  // 7. Average effective temperature across all 3 points
  const avgET = Math.round(((et1 + et2 + et3) / 3) * 10) / 10;

  // 8. Heat stress status
  const getStressLevel = (et) => {
    if (et < targetTemp - 3) return { label: 'Cold Stress', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
    if (et <= targetTemp + 1) return { label: 'Comfortable', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (et <= targetTemp + 3) return { label: 'Mild Stress', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Heat Stress', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const stress1 = getStressLevel(et1);
  const stress2 = getStressLevel(et2);
  const stress3 = getStressLevel(et3);
  const avgStress = getStressLevel(avgET);
  // ──────────────────────────────────────────────────────────────────────────

  // Stage settings states
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [editStages, setEditStages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Real Weather API Call
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let searchQuery = farmLocation;
        
        // If it's an Indian pincode, resolve to city/state name first using Postal API
        if (/^\d{6}$/.test(farmLocation.trim())) {
          try {
            const postalRes = await fetch(`https://api.postalpincode.in/pincode/${farmLocation.trim()}`);
            const postalData = await postalRes.json();
            if (postalData && postalData[0] && postalData[0].Status === "Success" && postalData[0].PostOffice && postalData[0].PostOffice.length > 0) {
              const po = postalData[0].PostOffice[0];
              searchQuery = `${po.District || po.Block}, ${po.State}, India`;
            }
          } catch (postalErr) {
            console.error("Error looking up pincode:", postalErr);
          }
        }

        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1`);
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`
          );
          const data = await weatherRes.json();
          
          setWeather({
            temperature: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            condition: "Updated",
            isLoading: false
          });
        }
      } catch (error) {
        setWeather({
          temperature: 27.5,
          humidity: 68,
          condition: "Partly Cloudy",
          isLoading: false
        });
      }
    };

    fetchWeather();
  }, [farmLocation]);

  // Fetch Default Stage Settings from Backend on mount
  useEffect(() => {
    const fetchDefaultStages = async () => {
      try {
        const res = await fetch("/api/generate/stages");
        const data = await res.json();
        if (data.success && data.stages && data.stages.length > 0) {
          // Normalise Infinity if returned as string "Infinity"
          const parsed = data.stages.map(s => ({
            ...s,
            maxAge: s.maxAge === "Infinity" || s.maxAge === Infinity ? Infinity : parseFloat(s.maxAge)
          }));
          setStages(parsed);
        }
      } catch (err) {
        console.error("Error fetching default stages:", err);
      }
    };

    fetchDefaultStages();
  }, []);

  const handleEditFarm = () => navigate('/farm-infrastructure', { state: farmData });
  
  const handleGenerateRecipe = () => {
    navigate('/processing', { 
      state: { 
        farmData: { 
          ...farmData, 
          airVolume, 
          coolingPadArea, 
          requiredCFM,
          ambientTemp: weather.temperature,
          ambientHumidity: weather.humidity,
          customStages: stages
        } 
      } 
    });
  };

  // Edit Handlers
  const handleStartEdit = () => {
    setEditStages(stages.map(s => ({
      ...s,
      maxAge: s.maxAge === Infinity || s.maxAge === "Infinity" ? "Infinity" : String(s.maxAge),
      target: String(s.target),
      heat: String(s.heat),
      cool: String(s.cool),
      alarmMin: String(s.alarmMin),
      alarmMax: String(s.alarmMax)
    })));
    setValidationErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleInputChange = (idx, field, value) => {
    setEditStages(prev => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        [field]: value
      };
      return updated;
    });
    
    // Clear validation error when editing the field
    const errKey = `${editStages[idx].stageNum}-${field}`;
    if (validationErrors[errKey]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[errKey];
        return copy;
      });
    }
  };

  const handleSave = () => {
    const newErrors = {};
    let isValid = true;

    // First pass: parsing & standard number check
    const parsed = editStages.map(s => {
      return {
        ...s,
        stageNum: parseInt(s.stageNum),
        maxAge: s.maxAge === "Infinity" || s.maxAge === Infinity ? Infinity : parseFloat(s.maxAge),
        target: parseFloat(s.target),
        heat: parseFloat(s.heat),
        cool: parseFloat(s.cool),
        alarmMin: parseFloat(s.alarmMin),
        alarmMax: parseFloat(s.alarmMax)
      };
    });

    for (let i = 0; i < parsed.length; i++) {
      const s = parsed[i];
      const stageNum = s.stageNum;

      // Age validations for non-final stages
      if (stageNum < 10) {
        if (isNaN(s.maxAge) || s.maxAge <= 0) {
          newErrors[`${stageNum}-maxAge`] = "Must be > 0";
          isValid = false;
        }
        if (i > 0) {
          const prev = parsed[i - 1];
          if (!isNaN(s.maxAge) && !isNaN(prev.maxAge) && s.maxAge <= prev.maxAge) {
            newErrors[`${stageNum}-maxAge`] = `Must be > Stage ${stageNum - 1} age (${prev.maxAge})`;
            isValid = false;
          }
        }
      }

      // Check for empty/invalid fields
      if (isNaN(s.target)) { newErrors[`${stageNum}-target`] = "Required"; isValid = false; }
      if (isNaN(s.heat)) { newErrors[`${stageNum}-heat`] = "Required"; isValid = false; }
      if (isNaN(s.cool)) { newErrors[`${stageNum}-cool`] = "Required"; isValid = false; }
      if (isNaN(s.alarmMin)) { newErrors[`${stageNum}-alarmMin`] = "Required"; isValid = false; }
      if (isNaN(s.alarmMax)) { newErrors[`${stageNum}-alarmMax`] = "Required"; isValid = false; }

      // Physical boundaries logic rules
      if (!isNaN(s.heat) && !isNaN(s.target) && s.heat >= s.target) {
        newErrors[`${stageNum}-heat`] = "Must be < Target";
        isValid = false;
      }
      if (!isNaN(s.cool) && !isNaN(s.target) && s.cool <= s.target) {
        newErrors[`${stageNum}-cool`] = "Must be > Target";
        isValid = false;
      }
      if (!isNaN(s.alarmMin) && !isNaN(s.heat) && s.alarmMin >= s.heat) {
        newErrors[`${stageNum}-alarmMin`] = "Must be < Heat";
        isValid = false;
      }
      if (!isNaN(s.alarmMax) && !isNaN(s.cool) && s.alarmMax <= s.cool) {
        newErrors[`${stageNum}-alarmMax`] = "Must be > Cool";
        isValid = false;
      }
    }

    if (!isValid) {
      setValidationErrors(newErrors);
      toast.error("Please correct the highlighted validation errors.");
      return;
    }

    // Dynamic generation of dayRange field if needed based on updated maxAge
    const finalSaved = parsed.map((s, idx) => {
      let dayRange = s.dayRange;
      if (idx === 0) {
        dayRange = String(s.maxAge);
      } else if (idx === parsed.length - 1) {
        dayRange = String(parsed[idx - 1].maxAge + 1);
      } else {
        dayRange = String(s.maxAge);
      }
      return {
        ...s,
        dayRange
      };
    });

    setValidationErrors({});
    setStages(finalSaved);
    setIsEditing(false);
    toast.success("Settings saved successfully.");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Stepper */}
        <PageStepper currentStep={2} />

        {/* Header 3-column Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Column 1: Title */}
          <div className="flex-1 flex flex-col justify-center mb-4 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Farm Intelligence</h1>
            <p className="text-sm text-zinc-400 mb-4">AI Powered Poultry Farm Analysis & Controller Recipe</p>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-bold tracking-wide">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                SYSTEM READY
              </span>
            </div>
          </div>

          {/* Column 2: Farm Info */}
          <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-5 flex-[1.5] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 13a4.5 4.5 0 0 1-4.5-4.5C3 5.5 5 4 7 4c2 0 4 1.5 4 4.5 0 .8-.2 1.6-.6 2.3"></path><path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M11 9c1.5 1 2.5 2.8 2.5 4.8 0 3-2.5 5.2-5 5.2S3.5 16.8 3.5 13.8"></path><path d="M3.5 13.8c0-1.8.8-3.4 2-4.5"></path><path d="M15 15h.01"></path><path d="M19 15h.01"></path><path d="M21 9v4"></path><path d="M19 6h-2"></path><path d="M19 13v6"></path><path d="M17 19v-6"></path><path d="M15 13v6"></path><path d="M15 6h4"></path></svg>
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide uppercase">{farmName}</div>
                <div className="text-xs text-zinc-400">Poultry Broiler Farm • {farmLocation}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-xs text-zinc-300 relative z-10">
              <div className="flex items-center gap-1.5"><Users size={14} className="text-zinc-500"/> {Number(birdCapacity).toLocaleString()} Birds</div>
              <div className="flex items-center gap-1.5"><Box size={14} className="text-zinc-500"/> {length} × {width} × {height} ft</div>
              <div className="flex items-center gap-1.5"><Cpu size={14} className="text-zinc-500"/> {controllerModel} Controller</div>
              <div className="flex items-center gap-1.5"><FanIcon size={14} className="text-zinc-500"/> {fanCount} Fans</div>
            </div>
          </div>

          {/* Column 3: Weather */}
          <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col justify-center gap-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full"></div>
             <div className="flex items-center gap-4 relative z-10">
               <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <Sun size={28} />
               </div>
               <div>
                 <div className="text-xs font-medium mb-0.5 text-zinc-400">{farmLocation}</div>
                 <div className="text-2xl font-bold tracking-tight mb-0.5">{weather.temperature}°C <span className="text-sm font-normal text-zinc-400 border-l border-white/10 pl-2 ml-1">{weather.humidity}% RH</span></div>
                 <div className="text-[10px] text-red-400 font-medium">Heat Index: {Math.round(calcTHI(weather.temperature, weather.humidity)*10)/10}°C</div>
                 <div className="text-[9px] text-zinc-500 mt-1">Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
               </div>
             </div>
          </div>
        </motion.div>

        {/* Sensor Data Cards Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-10"
        >
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* T1 */}
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-3 flex flex-col justify-between group focus-within:border-brand/30 transition-colors">
              <div className="text-[11px] font-semibold text-zinc-400 mb-2">T1 − Front</div>
              <div>
                <div className="flex items-baseline mb-2">
                  <input type="number" step="0.1" value={sensorInputs.temp1} onChange={e => handleSensorChange('temp1', e.target.value)}
                    className="bg-transparent text-2xl font-bold w-16 outline-none p-0 focus:ring-0 text-white appearance-none" />
                  <span className="text-sm font-bold ml-1 text-zinc-400">°C</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${stress1.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${stress1.bg.split(' ')[0]}`}></div> {stress1.label.toUpperCase()}
                </div>
              </div>
            </div>
            {/* T2 */}
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-3 flex flex-col justify-between group focus-within:border-brand/30 transition-colors">
              <div className="text-[11px] font-semibold text-zinc-400 mb-2">T2 − Center</div>
              <div>
                <div className="flex items-baseline mb-2">
                  <input type="number" step="0.1" value={sensorInputs.temp2} onChange={e => handleSensorChange('temp2', e.target.value)}
                    className="bg-transparent text-2xl font-bold w-16 outline-none p-0 focus:ring-0 text-white appearance-none" />
                  <span className="text-sm font-bold ml-1 text-zinc-400">°C</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${stress2.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${stress2.bg.split(' ')[0]}`}></div> {stress2.label.toUpperCase()}
                </div>
              </div>
            </div>
            {/* T3 */}
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-3 flex flex-col justify-between group focus-within:border-brand/30 transition-colors">
              <div className="text-[11px] font-semibold text-zinc-400 mb-2">T3 − Rear</div>
              <div>
                <div className="flex items-baseline mb-2">
                  <input type="number" step="0.1" value={sensorInputs.temp3} onChange={e => handleSensorChange('temp3', e.target.value)}
                    className="bg-transparent text-2xl font-bold w-16 outline-none p-0 focus:ring-0 text-white appearance-none" />
                  <span className="text-sm font-bold ml-1 text-zinc-400">°C</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${stress3.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${stress3.bg.split(' ')[0]}`}></div> {stress3.label.toUpperCase()}
                </div>
              </div>
            </div>
            {/* Inside RH */}
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-3 flex flex-col justify-between group focus-within:border-cyan-500/30 transition-colors">
              <div className="text-[11px] font-semibold text-zinc-400 mb-2">Inside RH</div>
              <div>
                <div className="flex items-baseline mb-2">
                  <input type="number" step="1" value={sensorInputs.insideHumidity} onChange={e => handleSensorChange('insideHumidity', e.target.value)}
                    className="bg-transparent text-2xl font-bold w-14 outline-none p-0 focus:ring-0 text-white appearance-none" />
                  <span className="text-sm font-bold ml-1 text-zinc-400">%</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> NORMAL
                </div>
              </div>
            </div>
            {/* Active Fans */}
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-3 flex flex-col justify-between group focus-within:border-emerald-500/30 transition-colors">
              <div className="text-[11px] font-semibold text-zinc-400 mb-2">Active Fans</div>
              <div>
                <div className="flex items-baseline mb-2">
                  <input type="number" step="1" value={sensorInputs.activeFans} onChange={e => handleSensorChange('activeFans', e.target.value)}
                    className="bg-transparent text-2xl font-bold w-12 outline-none p-0 focus:ring-0 text-white appearance-none" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> RUNNING
                </div>
              </div>
            </div>
            {/* Bird Age */}
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-3 flex flex-col justify-between group focus-within:border-amber-500/30 transition-colors">
              <div className="text-[11px] font-semibold text-zinc-400 mb-2">Bird Age</div>
              <div>
                <div className="flex items-baseline mb-2">
                  <input type="number" step="1" value={sensorInputs.birdAge} onChange={e => handleSensorChange('birdAge', e.target.value)}
                    className="bg-transparent text-2xl font-bold w-12 outline-none p-0 focus:ring-0 text-white appearance-none" />
                  <span className="text-sm font-bold ml-1 text-zinc-400">Days</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Alert Card dynamically changing based on avgStress */}
          {avgStress.label === 'Comfortable' ? (
            <div className="lg:w-[320px] bg-gradient-to-br from-emerald-950/40 to-transparent border border-emerald-500/30 rounded-2xl p-4 flex relative overflow-hidden shadow-lg shadow-emerald-900/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
               <div className="mr-3 mt-1 relative z-10">
                  <CheckCircle2 size={28} className="text-emerald-400" />
               </div>
               <div className="flex-1 relative z-10">
                  <div className="text-sm font-bold text-emerald-400 tracking-wide mb-2 uppercase">CONDITIONS OPTIMAL</div>
                  <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                     <div className="text-zinc-400">Effective Temp:</div>
                     <div className="font-bold text-white">{avgET}°C</div>
                     <div className="text-zinc-400">Target Temp:</div>
                     <div className="font-bold text-white">{targetTemp}°C</div>
                     <div className="text-zinc-400">Deviation:</div>
                     <div className="font-bold text-white">{(avgET - targetTemp).toFixed(1)}°C</div>
                  </div>
               </div>
               <div className="flex flex-col justify-end items-end relative z-10">
                  <div className="text-[9px] text-zinc-500 mb-1">Status</div>
                  <div className="px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 text-[10px] font-bold bg-emerald-500/10">GOOD</div>
               </div>
            </div>
          ) : (
            <div className={`lg:w-[320px] bg-gradient-to-br ${avgStress.label === 'Cold Stress' ? 'from-pink-950/40' : 'from-rose-950/40'} to-transparent border ${avgStress.label === 'Cold Stress' ? 'border-pink-500/30' : 'border-rose-500/30'} rounded-2xl p-4 flex relative overflow-hidden shadow-lg ${avgStress.label === 'Cold Stress' ? 'shadow-pink-900/20' : 'shadow-rose-900/20'}`}>
               <div className={`absolute top-0 right-0 w-32 h-32 ${avgStress.label === 'Cold Stress' ? 'bg-pink-500/10' : 'bg-rose-500/10'} blur-3xl rounded-full`}></div>
               <div className="mr-3 mt-1 relative z-10">
                  {avgStress.label === 'Cold Stress' ? (
                    <Snowflake size={28} className="text-cyan-400" />
                  ) : (
                    <ThermometerSun size={28} className="text-rose-400" />
                  )}
               </div>
               <div className="flex-1 relative z-10">
                  <div className={`text-sm font-bold ${avgStress.label === 'Cold Stress' ? 'text-pink-500' : 'text-rose-500'} tracking-wide mb-2 uppercase`}>{avgStress.label.toUpperCase()} DETECTED</div>
                  <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                     <div className="text-zinc-400">Effective Temp:</div>
                     <div className="font-bold text-white">{avgET}°C</div>
                     <div className="text-zinc-400">Target Temp:</div>
                     <div className="font-bold text-white">{targetTemp}°C</div>
                     <div className="text-zinc-400">Deviation:</div>
                     <div className="font-bold text-white">{(avgET - targetTemp > 0 ? "+" : "")}{(avgET - targetTemp).toFixed(1)}°C</div>
                  </div>
               </div>
               <div className="flex flex-col justify-end items-end relative z-10">
                  <div className="text-[9px] text-zinc-500 mb-1">Risk Level</div>
                  <div className={`px-2 py-0.5 rounded border ${avgStress.label === 'Heat Stress' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-pink-500/30 text-pink-400 bg-pink-500/10'} text-[10px] font-bold`}>HIGH</div>
               </div>
            </div>
          )}
        </motion.div>
        
        {/* Farm Digital Twin Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative w-full flex flex-col mb-10"
        >
          {/* Container holding Video + Overlays */}
          <div className="relative rounded-[2rem] border border-white/10 bg-[#0a0a0f] w-full overflow-hidden aspect-video shadow-2xl">
            <video
              src={FarmVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-90"
            />
            
            {/* Transparent Overlay for telemetry labels */}
            <div className="absolute inset-0 pointer-events-none select-none">
              
              {/* Top-Left: Title and Sensors List */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-col gap-4">
                {/* Title */}
                <div className="flex items-center gap-3">
                  <div className="text-pink-500">
                    <Home size={32} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase drop-shadow-md">FARM DIGITAL TWIN</h3>
                </div>

                {/* Sensor Points List */}
                <div className="flex flex-col gap-2 mt-2 pointer-events-auto">
                  {/* T1 */}
                  <div className="flex items-center gap-3 bg-zinc-950/70 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-2xl w-fit shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 w-4">T1</span>
                      <span className="font-bold text-sm text-white">{sensorInputs.temp1}°C</span>
                    </div>
                  </div>
                  
                  {/* T2 */}
                  <div className="flex items-center gap-3 bg-zinc-950/70 backdrop-blur-xl border border-pink-500/30 px-3 py-2 rounded-2xl w-fit shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 w-4">T2</span>
                      <span className="font-bold text-sm text-pink-400">{sensorInputs.temp2}°C</span>
                      <span className="text-[10px] font-bold text-cyan-400 ml-1">RH {sensorInputs.insideHumidity}%</span>
                    </div>
                  </div>
                  
                  {/* T3 */}
                  <div className="flex items-center gap-3 bg-zinc-950/70 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-2xl w-fit shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 w-4">T3</span>
                      <span className="font-bold text-sm text-white">{sensorInputs.temp3}°C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top-Right: LIVE + Outside Weather */}
              <div className="absolute top-6 right-6 md:top-8 md:right-8 flex flex-col items-end gap-3">
                {/* LIVE Badge */}
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 px-3 py-1 rounded-lg text-red-400 font-bold text-[10px] md:text-xs tracking-widest shadow-lg pointer-events-auto backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  LIVE
                </div>

                {/* Outside Weather */}
                <div className="bg-zinc-950/70 backdrop-blur-xl border border-emerald-500/40 px-4 py-2.5 rounded-2xl flex items-center gap-3 text-white shadow-lg pointer-events-auto">
                  <Sun size={24} className="text-yellow-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] font-bold text-zinc-300 tracking-wider">OUTSIDE</span>
                    <div className="font-bold text-xs md:text-sm tracking-wide text-white">
                      {weather.temperature}°C <span className="text-zinc-500 font-normal mx-1">|</span> {weather.humidity}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Engineering Calculations & Specs — Below Video */}
        <div className="mt-8 flex flex-col gap-5">
          
          {/* Engineering Summary Container */}
          <div className="bg-[#0a0a0f] border border-white/10 rounded-[2rem] p-6 lg:p-8 w-full shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-pink-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white tracking-wide uppercase drop-shadow-md">ENGINEERING SUMMARY</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Shed Volume */}
              <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between items-center text-center">
                <div className="flex items-center gap-2 mb-3 text-pink-500">
                  <Box size={18} />
                  <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">SHED VOLUME</span>
                </div>
                <div className="font-bold text-2xl text-white mb-1 tracking-tight">
                  {airVolume > 1000000 ? `${(airVolume / 1000000).toFixed(2)}M` : airVolume.toLocaleString()} cu.ft
                </div>
                <div className="text-xs font-semibold text-zinc-400">
                  Floor: {(length * width).toLocaleString()} sq.ft
                </div>
              </div>

              {/* Card 2: Ventilation */}
              <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between items-center text-center">
                <div className="flex items-center gap-2 mb-3 text-pink-500">
                  <FanIcon size={18} />
                  <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">VENTILATION</span>
                </div>
                <div className="font-bold text-2xl text-white mb-1 tracking-tight">
                  {requiredCFM.toLocaleString()} CFM
                </div>
                <div className="text-xs font-semibold text-zinc-400">
                  {fanCount} × {fanInputType === 'cfm' ? `${parseFloat(fanCFM || 0).toLocaleString()}K CFM` : fanSize}
                </div>
              </div>

              {/* Card 3: Cooling Pad */}
              <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between items-center text-center">
                <div className="flex items-center gap-2 mb-3 text-pink-500">
                  <Droplets size={18} />
                  <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">COOLING PAD</span>
                </div>
                <div className="font-bold text-2xl text-white mb-1 tracking-tight">
                  {coolingPadArea.toLocaleString()} sq.ft
                </div>
                <div className="text-xs font-semibold text-zinc-400">
                  {coolingPadLength} × {padHeight || 6} ft
                </div>
              </div>

              {/* Card 4: Air Exchange */}
              <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col justify-between items-center text-center">
                <div className="flex items-center gap-2 mb-3 text-pink-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
                  <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">AIR EXCHANGE</span>
                </div>
                <div className="font-bold text-2xl text-white mb-1 tracking-tight">
                  {requiredCFM > 0 ? (airVolume / requiredCFM).toFixed(1) : 0} min / ex
                </div>
                <div className="text-xs font-semibold text-zinc-400">
                  Velocity: {airVelocityMs.toFixed(2)} m/s
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Stage Settings Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Stage Settings</h2>
              <p className="text-zinc-400 mt-1 text-sm">Review recommended stage parameters and customize limits as needed.</p>
            </div>
            <div>
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartEdit}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl font-semibold flex items-center gap-2 hover:bg-white/15 transition-all text-sm cursor-pointer"
                >
                  <Edit2 size={16} className="text-brand" /> Edit Settings
                </motion.button>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelEdit}
                    className="px-5 py-3 bg-zinc-900 border border-white/10 rounded-2xl font-semibold flex items-center gap-2 hover:bg-zinc-800 transition-all text-sm cursor-pointer text-zinc-400 hover:text-white"
                  >
                    <X size={16} /> Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="px-6 py-3 bg-brand rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all text-sm cursor-pointer"
                  >
                    <Save size={16} /> Save Settings
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Optional notification / Information notice */}
          <div className="bg-brand/10 border border-brand/20 rounded-2xl p-6 mb-8 flex gap-4 items-start">
            <Info className="w-6 h-6 text-brand shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Continue with these recommended settings</h4>
              <p className="text-zinc-400 mt-1 text-sm leading-relaxed">
                These values are automatically generated based on your farm information. 
                If you want to customize them, click the <strong className="text-brand font-semibold">Edit Settings</strong> button before generating the final controller settings. Editing is completely optional.
              </p>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950/40">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-zinc-400 text-sm font-semibold">
                  <th className="py-4 px-6">Stage</th>
                  <th className="py-4 px-6 text-center">Age (Max Days)</th>
                  <th className="py-4 px-6 text-center">Target Temp (°C)</th>
                  <th className="py-4 px-6 text-center">Heat Temp (°C)</th>
                  <th className="py-4 px-6 text-center">Cooling Temp (°C)</th>
                  <th className="py-4 px-6 text-center">Minimum Alarm (°C)</th>
                  <th className="py-4 px-6 text-center">Maximum Alarm (°C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300 text-sm">
                {(isEditing ? editStages : stages).map((s, idx) => (
                  <motion.tr 
                    key={s.stageNum}
                    initial={isEditing ? { backgroundColor: "rgba(255, 255, 255, 0)" } : false}
                    animate={isEditing ? { backgroundColor: "rgba(209, 18, 67, 0.02)" } : { backgroundColor: "rgba(255, 255, 255, 0)" }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* Stage (Read-only always) */}
                    <td className="py-4 px-6 font-semibold text-white">
                      Stage {s.stageNum}
                    </td>

                    {/* Age (Max Days) */}
                    <td className="py-4 px-6 text-center w-40">
                      {isEditing ? (
                        s.stageNum === 10 ? (
                          <div className="text-center font-semibold text-zinc-500 py-2 bg-zinc-900/40 rounded-xl border border-white/5">
                            Infinity
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <input
                              type="number"
                              value={s.maxAge === Infinity || s.maxAge === "Infinity" ? "" : s.maxAge}
                              onChange={(e) => handleInputChange(idx, 'maxAge', e.target.value)}
                              className={`text-center bg-zinc-950/80 text-white rounded-xl px-3 py-2 w-full border ${validationErrors[`${s.stageNum}-maxAge`] ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-brand'} focus:outline-none transition-all`}
                            />
                            {validationErrors[`${s.stageNum}-maxAge`] && (
                              <p className="text-[10px] text-red-500 mt-1 font-semibold">{validationErrors[`${s.stageNum}-maxAge`]}</p>
                            )}
                          </div>
                        )
                      ) : (
                        <span>{s.maxAge === Infinity || s.maxAge === "Infinity" ? "Infinity" : `${s.maxAge} days`}</span>
                      )}
                    </td>

                    {/* Target Temp */}
                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            step="0.1"
                            value={s.target}
                            onChange={(e) => handleInputChange(idx, 'target', e.target.value)}
                            className={`text-center bg-zinc-950/80 text-white rounded-xl px-3 py-2 w-28 border ${validationErrors[`${s.stageNum}-target`] ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-brand'} focus:outline-none transition-all`}
                          />
                          {validationErrors[`${s.stageNum}-target`] && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold">{validationErrors[`${s.stageNum}-target`]}</p>
                          )}
                        </div>
                      ) : (
                        <span className="font-semibold text-white">{s.target}°C</span>
                      )}
                    </td>

                    {/* Heat Temp */}
                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            step="0.1"
                            value={s.heat}
                            onChange={(e) => handleInputChange(idx, 'heat', e.target.value)}
                            className={`text-center bg-zinc-950/80 text-white rounded-xl px-3 py-2 w-28 border ${validationErrors[`${s.stageNum}-heat`] ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-brand'} focus:outline-none transition-all`}
                          />
                          {validationErrors[`${s.stageNum}-heat`] && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold">{validationErrors[`${s.stageNum}-heat`]}</p>
                          )}
                        </div>
                      ) : (
                        <span>{s.heat}°C</span>
                      )}
                    </td>

                    {/* Cooling Temp */}
                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            step="0.1"
                            value={s.cool}
                            onChange={(e) => handleInputChange(idx, 'cool', e.target.value)}
                            className={`text-center bg-zinc-950/80 text-white rounded-xl px-3 py-2 w-28 border ${validationErrors[`${s.stageNum}-cool`] ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-brand'} focus:outline-none transition-all`}
                          />
                          {validationErrors[`${s.stageNum}-cool`] && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold">{validationErrors[`${s.stageNum}-cool`]}</p>
                          )}
                        </div>
                      ) : (
                        <span>{s.cool}°C</span>
                      )}
                    </td>

                    {/* Minimum Alarm */}
                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            step="0.1"
                            value={s.alarmMin}
                            onChange={(e) => handleInputChange(idx, 'alarmMin', e.target.value)}
                            className={`text-center bg-zinc-950/80 text-white rounded-xl px-3 py-2 w-28 border ${validationErrors[`${s.stageNum}-alarmMin`] ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-brand'} focus:outline-none transition-all`}
                          />
                          {validationErrors[`${s.stageNum}-alarmMin`] && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold">{validationErrors[`${s.stageNum}-alarmMin`]}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-blue-400 font-medium">{s.alarmMin}°C</span>
                      )}
                    </td>

                    {/* Maximum Alarm */}
                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            step="0.1"
                            value={s.alarmMax}
                            onChange={(e) => handleInputChange(idx, 'alarmMax', e.target.value)}
                            className={`text-center bg-zinc-950/80 text-white rounded-xl px-3 py-2 w-28 border ${validationErrors[`${s.stageNum}-alarmMax`] ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-brand'} focus:outline-none transition-all`}
                          />
                          {validationErrors[`${s.stageNum}-alarmMax`] && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold">{validationErrors[`${s.stageNum}-alarmMax`]}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-400 font-medium">{s.alarmMax}°C</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Primary Page Action Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleEditFarm} 
            disabled={isEditing}
            className={`flex-1 py-6 rounded-3xl border border-white/20 hover:bg-white/5 text-lg font-semibold flex items-center justify-center gap-3 cursor-pointer ${isEditing ? 'opacity-40 cursor-not-allowed animate-none' : ''}`}
          >
            <ArrowLeft /> EDIT CONFIGURATION
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGenerateRecipe} 
            disabled={isEditing}
            className={`flex-1 py-6 bg-gradient-to-r from-brand to-brand-dark rounded-3xl text-xl font-bold flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-brand/20 hover:shadow-brand/40 ${isEditing ? 'opacity-40 cursor-not-allowed animate-none' : ''}`}
          >
            GENERATE SETTINGS <Sparkles />
          </motion.button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FarmPreview;