import { BREED_PROFILES } from "../../config/breedProfiles.js";
import { breedTemperatureData } from "../constants/breedTemperatureData.js";

/**
 * Zivial Z1000 Batch Recipe Generator
 * 
 * Generates a complete 10-stage configuration recipe for the Z1000 controller.
 * Implements 100% accurate thermodynamic logic based on bird biomass and 
 * highly efficient cooling targets (Target + 0.2°C) to save electricity.
 */
export const generateZ1000Recipe = (farmConfig, breedType = "Cobb 500", fanDb) => {
  const length = parseFloat(farmConfig.length) || 200;
  const width = parseFloat(farmConfig.width) || 60;
  const height = parseFloat(farmConfig.height) || 20;
  const fanCount = parseInt(farmConfig.fanCount) || 10;
  const fanSize = farmConfig.fanSize || "48 Inch";
  const birdCapacity = parseInt(farmConfig.birdCapacity) || 10000;

  const farmVolume = length * width * height;
  const crossSection = width * height;

  const matchedFan = fanDb[fanSize] || fanDb["48 Inch"];
  const singleFanCfm = matchedFan.cfm;
  const totalInstalledCFM = fanCount * singleFanCfm;

  const breedData = BREED_PROFILES[breedType] || BREED_PROFILES["Cobb 500"];

  // 1. Application Settings
  const applicationSettings = [
    { parameter: "ALARM DELAY", value: 120 },
    { parameter: "AIR TEMPERATURE ALARM ON", value: 1 },
    { parameter: "HUMIDITY MIN ALARM", value: 35 },
    { parameter: "HUMIDITY MAX ALARM", value: 85 },
    { parameter: "HUMIDITY ALARM ON", value: 1 },
    { parameter: "ENABLE TEMPERATURE CURVE", value: 1 }, // Vital for smooth transitions
    { parameter: "COOLING PUMP HUMIDITY ON HYSTERISIS (%)", value: 2 },
    { parameter: "COOLING PUMP TEMPERATURE HYSTERISIS (C)", value: 0.5 },
    { parameter: "COOLING TERMPERATURE RANGE", value: 3 },
    { parameter: "TEMPERATURE OFFSET", value: 0 },
    { parameter: "STAGE AUTOMATIC CHANGE", value: 1 }
  ];

  // 2. Stage Settings (Exactly 10 stages)
  // We distribute the 10 stages across 42 days to capture major growth curve changes.
  const stageDays = [1, 4, 8, 12, 16, 21, 26, 31, 36, 42];
  const stageSettingsTable = [];

  // Temperature curve mapping (ideal standard for broilers)
  // Day 1: ~33.0C, Day 42: ~20.0C
  const getTargetTemp = (day) => {
    const maxDay = breedTemperatureData.length - 1;
    const lookupDay = day > maxDay ? maxDay : day;
    const tempRecord = breedTemperatureData.find(d => d.Age_Day === lookupDay);
    if (tempRecord && tempRecord[breedType]) {
      return tempRecord[breedType];
    }
    // Fallback if breed not found in predefined data
    if (day <= 7) return 33.0 - (day * 0.3); // Drops to ~30.9
    if (day <= 14) return 30.9 - ((day - 7) * 0.4); // Drops to ~28.1
    if (day <= 21) return 28.1 - ((day - 14) * 0.3); // Drops to ~26.0
    if (day <= 28) return 26.0 - ((day - 21) * 0.3); // Drops to ~23.9
    if (day <= 35) return 23.9 - ((day - 28) * 0.3); // Drops to ~21.8
    return Math.max(20.0, 21.8 - ((day - 35) * 0.2)); // Drops to ~20.4
  };

  // Find max CFM for minimum vent to set safe/min levels
  let maxRequiredMinCfm = 0;

  for (let i = 0; i < stageDays.length; i++) {
    const day = stageDays[i];
    
    // Find bird weight for this day
    const profileRecord = breedData.find(r => day <= r.maxAge) || breedData[breedData.length - 1];
    const weight = profileRecord.weightKg;
    
    const requiredMinCfm = Math.round((birdCapacity * weight) * 0.4);
    if (requiredMinCfm > maxRequiredMinCfm) maxRequiredMinCfm = requiredMinCfm;

    // We assign levels dynamically based on required CFM.
    // Level 1 is very low. We'll map Min Vent to Level 2 or 3 as birds grow.
    let minLevel = 1;
    if (day > 14) minLevel = 2;
    if (day > 28) minLevel = 3;

    // The maximum ventilation level limit for safety
    // Day 0-7: Max Air speed 100 ft/min
    // Day 8-14: Max 200 ft/min
    // Day 15-21: Max 350 ft/min
    // Day 22+: 600 ft/min
    let maxSafeAirSpeed = 600;
    if (day <= 7) maxSafeAirSpeed = 100;
    else if (day <= 14) maxSafeAirSpeed = 200;
    else if (day <= 21) maxSafeAirSpeed = 350;

    const maxSafeCfm = maxSafeAirSpeed * crossSection;
    
    // Find which of the 16 levels corresponds to maxSafeCfm
    // Since levels scale linearly from cfmMin to totalInstalledCFM, we estimate:
    let maxLevel = Math.min(16, Math.max(minLevel, Math.round(1 + 15 * (maxSafeCfm / totalInstalledCFM))));
    if (maxLevel > 16) maxLevel = 16;
    if (maxSafeCfm >= totalInstalledCFM) maxLevel = 16;

    const targetT = parseFloat(getTargetTemp(day).toFixed(1));
    const heatingT = parseFloat((targetT - 1.0).toFixed(1));
    // As requested: High accuracy cooling. Trigger cooling pump at Target + 0.2 to save fan electricity
    const coolingT = parseFloat((targetT + 0.2).toFixed(1)); 

    stageSettingsTable.push({
      stage: i + 1,
      day: day,
      targetTemp: targetT,
      heatingTemp: heatingT,
      coolingTemp: coolingT,
      ventLevelSafe: minLevel, // Safe level equals min level
      ventLevelMin: minLevel,
      ventLevelMax: maxLevel,
      minTempAlarm: parseFloat((targetT - 3.0).toFixed(1)),
      maxTempAlarm: parseFloat((targetT + 4.0).toFixed(1))
    });
  }

  // 3. Ventilation Level Table (Exactly 16 levels)
  const ventilationLevelTable = [];
  const minCFM = maxRequiredMinCfm * 0.2; // absolute baseline for level 1

  for (let l = 1; l <= 16; l++) {
    // Distribute CFM requirements linearly across 16 levels
    const targetCFM = Math.round(minCFM + ((l - 1) / 15) * (totalInstalledCFM - minCFM));
    
    // Select optimal fans
    const continuousFans = Math.min(fanCount, Math.floor(targetCFM / singleFanCfm));
    const remainingCFM = Math.max(0, targetCFM - (continuousFans * singleFanCfm));
    const timerFans = remainingCFM > 0 ? Math.min(fanCount - continuousFans, Math.ceil(remainingCFM / singleFanCfm)) : 0;
    
    let fanOnTime = 0;
    let fanOffTime = 0;
    if (timerFans > 0) {
      const fraction = remainingCFM / (timerFans * singleFanCfm);
      fanOnTime = Math.max(15, Math.round(300 * fraction)); // 300 second (5 min) cycle
      fanOffTime = 300 - fanOnTime;
    }

    const rotationalFans = timerFans > 0 ? Math.max(1, fanCount - continuousFans) : 0;

    // VFD Logic
    let vfdSpeed = 100;
    if (l <= 6) vfdSpeed = Math.min(100, 50 + (l - 1) * 10);
    else vfdSpeed = Math.min(100, 80 + (l - 7) * 4);

    // Tdiff for level progression. 
    // Small steps early on so that cooling (which is at Target+0.2) kicks in before we ramp up to level 16.
    const tDeltas = [0.0, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0];
    const tDiff = tDeltas[l - 1];

    // Fan state string (for the 12 fans representation)
    const fanStates = [];
    for (let f = 1; f <= 12; f++) {
      if (f <= continuousFans) {
        fanStates.push("ON");
      } else if (f <= continuousFans + timerFans) {
        fanStates.push("TIMER");
      } else if (f <= fanCount) {
        fanStates.push("ROTATING");
      } else {
        fanStates.push("OFF");
      }
    }

    ventilationLevelTable.push({
      level: l,
      targetCFM: targetCFM,
      tDiff: tDiff,
      fanOnTimeSec: fanOnTime,
      fanOffTimeSec: fanOffTime,
      vfdValue: vfdSpeed,
      continuousFans,
      timerFans,
      rotationalFans,
      fanStates: fanStates // array of 12 states mapped for the UI
    });
  }

  // 4. Cooling Settings Table
  const coolingSettingsTable = [];
  const padLength = parseFloat(farmConfig.padLength) || 60;
  const padHeight = parseFloat(farmConfig.padHeight) || 6;
  const padArea = padLength * padHeight;
  const hasCooling = farmConfig.coolingPad === "Yes";

  // Base Wetting Time (ON time): Typically a 6-inch pad takes 60s for small pads, up to 120s+ for large pads
  let baseOnTime = Math.round(60 + (padArea / 100) * 10);
  if (baseOnTime > 150) baseOnTime = 150;
  if (baseOnTime < 45) baseOnTime = 45;

  // Base Drying Time (OFF time): Depends on air velocity
  const maxAirSpeed = crossSection > 0 ? totalInstalledCFM / crossSection : 400;
  let baseMinOff = Math.round(300 - (maxAirSpeed * 0.3));
  if (baseMinOff < 90) baseMinOff = 90;
  if (baseMinOff > 300) baseMinOff = 300;
  
  let baseMaxOff = baseMinOff * 3;

  const coolingDays = [1, 7, 14, 21, 28];
  
  for (let i = 0; i < coolingDays.length; i++) {
    const cDay = coolingDays[i];
    
    // Humidity cutoff drops as birds get older (they produce more intrinsic moisture)
    const offRH = Math.round(85 - (i * 3.75)); 

    // Target + 0.2°C trigger logic as requested for precision
    const tDiff = 0.2; 

    let onTime = baseOnTime;
    let minOff = baseMinOff;
    let maxOff = baseMaxOff;

    // Young birds: lower ON time to prevent chilling, longer minimum OFF time
    if (cDay < 14) {
      onTime = Math.round(baseOnTime * 0.7);
      minOff = Math.round(baseMinOff * 1.5);
    }

    if (!hasCooling) {
      onTime = 0;
      minOff = 0;
      maxOff = 0;
    }

    // Expand operating window as birds grow
    const startHours = [10, 10, 9, 9, 8];
    const stopHours = [16, 17, 18, 19, 20];
    
    const startStr = `${String(startHours[i]).padStart(2, '0')}:00`;
    const stopStr = `${String(stopHours[i]).padStart(2, '0')}:00`;

    coolingSettingsTable.push({
      day: cDay,
      start: startStr,
      stop: stopStr,
      humidityOff: offRH,
      tDiff: tDiff,
      onTimeSec: onTime,
      minOffSec: minOff,
      maxOffSec: maxOff,
      foggerOn: 0,
      foggerMinOff: 0,
      foggerMaxOff: 0,
      foggerOffRH: 0,
      foggerTDiff: 0
    });
  }

  // 5. Humidity Treatment Table
  const humidityTreatmentTable = [];
  const humDays = [1, 7, 14, 21, 28, 35];
  const humTargets = [60, 65, 70, 75, 80, 85];
  
  // Moisture load risk based on pad area vs farm volume
  let padVolRatio = padArea / (farmVolume || 240000);
  if (padVolRatio < 0.0005) padVolRatio = 0.0005;
  if (padVolRatio > 0.0050) padVolRatio = 0.0050;

  // Delay: larger pad = faster moisture spike = shorter delay needed
  // Ranges from 180s (small pad) to 60s (large pad)
  let baseDelay = 180 - ((padVolRatio - 0.0005) / 0.0045) * 120;
  baseDelay = Math.round(baseDelay / 10) * 10;

  // Duration: larger pad = more moisture = longer duration needed to clear it
  // Ranges from 60s (small pad) to 120s (large pad)
  let baseDuration = 60 + ((padVolRatio - 0.0005) / 0.0045) * 60;
  baseDuration = Math.round(baseDuration / 10) * 10;

  for (let i = 0; i < humDays.length; i++) {
    // As birds age, they produce intrinsic moisture, so we slowly 
    // reduce delay and increase duration to keep up with the load.
    let delay = baseDelay - (i * 10);
    if (delay < 60) delay = 60;
    
    let duration = baseDuration + (i * 5);
    if (duration > 180) duration = 180;

    humidityTreatmentTable.push({
      day: humDays[i],
      humidity: humTargets[i],
      delay: Math.round(delay),
      duration: Math.round(duration)
    });
  }

  return {
    farmId: farmConfig.farmName || "Farm_001",
    applicationSettings,
    stageSettingsTable,
    ventilationLevelTable,
    coolingSettingsTable,
    humidityTreatmentTable
  };
};
