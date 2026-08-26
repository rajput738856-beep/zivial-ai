/**
 * Calculator Engine: Cooling Pad Engineering
 * 
 * Formulas:
 * 1. Temp Difference (ΔT) = House Temp - Cooling Temp Target
 * 2. Pump OFF Time (seconds) = Max OFF - Clamp((ΔT / 4.0), 0, 1) * (Max OFF - Min OFF)
 * 3. Cooling Efficiency (%) = 85 - Clamp((Ambient RH - 30) * 0.5, 0, 35)
 * 4. Evaporation Rate (L/min/sq.ft) = Clamp((Ambient Temp - 20) * 0.005 + (1 - Ambient RH/100) * 0.01, 0, 0.05)
 * 5. Water Consumption (L/min) = (Pump ON / (Pump ON + Pump OFF)) * Pad Area * Evaporation Rate
 * 
 * Purpose:
 * Computes cycle duration for evaporative cooling pad pumps to mitigate high sensible temperatures, 
 * factoring in ambient relative humidity locks to avoid high latent heat indices.
 * 
 * Inputs:
 * - farmConfig (Object): length, width, height, padLength, padHeight, fanCount
 * - birdData (Object): age, currentStage
 * - weather (Object): ambientTemp, ambientRH, targetTemp, coolingTemp, currentHouseTemp, ventLevel
 * - coolingProfile (Array): Matched row entries containing timings and limits
 * 
 * Outputs:
 * - coolingPadDetails (Object): Settings array mapped to pump durations and efficiencies.
 */

export const calculateCoolingPad = (farmConfig, birdData, weather, coolingProfile) => {
  const age = parseInt(birdData.age) || 1;
  const stage = parseInt(birdData.currentStage) || 1;

  const padLength = parseFloat(farmConfig.padLength) || 60;
  const padHeight = parseFloat(farmConfig.padHeight) || 6;
  const ventLevel = parseInt(weather.ventLevel) || 1;

  const houseT = parseFloat(weather.currentHouseTemp) || 31.2;
  const targetT = parseFloat(weather.targetTemp) || 30.0;
  const coolT = parseFloat(weather.coolingTemp) || 33.0;
  const ambientT = parseFloat(weather.ambientTemp) || 28;
  const ambientRH = parseFloat(weather.ambientRH) || 65;

  const padArea = padLength * padHeight;

  // Resolve matching profile row based on age
  const row = coolingProfile.find(p => age >= p.minAge && age <= p.maxAge) || coolingProfile[coolingProfile.length - 1];

  const coolingAllowed = row.enabled && age >= row.startDay;
  const tempDiff = parseFloat((houseT - coolT).toFixed(2));

  // Determine if cooling is enabled (must exceed cooling temp AND ventilation level >= 7)
  const ventilationCoord = ventLevel >= 7;
  const humidityLock = ambientRH >= row.offRH;
  
  const coolingEnabled = (coolingAllowed && tempDiff > row.tDiff && ventilationCoord && !humidityLock);

  // Calculate dynamic pump OFF time based on how high the temperature is above setpoint
  let pumpOffTime = row.maxOffSec;
  if (coolingEnabled && tempDiff > 0) {
    const scale = Math.min(1, Math.max(0, tempDiff / 4.0)); // scales over 4.0°C span
    pumpOffTime = Math.round(row.maxOffSec - scale * (row.maxOffSec - row.minOffSec));
  }

  // Calculate efficiency based on wet-bulb depression capability (lower RH = higher efficiency)
  const estimatedCoolingEfficiency = Math.max(50, Math.min(85, Math.round(85 - (ambientRH - 30) * 0.5)));

  // Calculate water consumption (evaporated L/min)
  const evapRate = Math.max(0.001, (ambientT - 20) * 0.002 + (1 - ambientRH / 100) * 0.005); // L/min/sq.ft
  const cycleFraction = row.pumpOnSec / (row.pumpOnSec + pumpOffTime);
  const estimatedWaterConsumption = coolingEnabled 
    ? parseFloat((padArea * evapRate * cycleFraction).toFixed(2))
    : 0;

  return {
    birdAge: age,
    currentStage: stage,
    coolingEnabled: coolingEnabled ? "Yes" : "No",
    coolingStartDay: row.startDay,
    currentCoolingRow: coolingProfile.indexOf(row) + 1,
    pumpOnTime: row.pumpOnSec,
    pumpOffTime,
    minimumOffTime: row.minOffSec,
    maximumOffTime: row.maxOffSec,
    offHumidity: `${row.offRH}%`,
    temperatureDifference: `${tempDiff}°C`,
    estimatedCoolingEfficiency: `${estimatedCoolingEfficiency}%`,
    estimatedWaterConsumption: `${estimatedWaterConsumption} L/min`,
    currentVentilationLevel: ventLevel
  };
};
