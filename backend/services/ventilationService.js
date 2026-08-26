import { BROILER_GROWTH_CURVE, CONSTANTS } from "../config/poultryConfig.js";

/**
 * Service: Ventilation Engineering Engine (Module 5)
 * 
 * Formulas:
 * 1. Estimated Flock Weight (kg) = Current Bird Count * Estimated Bird Weight (kg, from Growth Curve)
 * 2. CFM Min Limit (Cold/Min Vent) = Total Flock Weight (kg) * CFM_MULTIPLIER_MIN_VENT (0.4 CFM/kg)
 * 3. CFM Max Limit (Hot/Max Vent) = Total Flock Weight (kg) * CFM_MULTIPLIER_MAX_VENT (4.0 CFM/kg)
 * 4. Required CFM = CFM Min Limit + Scaling Factor * (CFM Max Limit - CFM Min Limit)
 *    where Scaling Factor = Clamp((Ambient Temp F - 70) / 20, 0, 1)
 * 5. Required Air Speed (ft/min) = Required CFM / Cross-Sectional Area (Width * Height)
 * 6. Air Exchange Cycle (seconds) = (Building Volume * 60) / Required CFM
 * 
 * Purpose:
 * Evaluates the required volume flow rate (CFM) to remove bird heat, CO2, moisture, and ammonia 
 * based on bird size, count, and local weather temperatures.
 * 
 * Inputs:
 * - age (Number): Bird age in days.
 * - birdCount (Number): Current bird count.
 * - ambientTemp (Number): Ambient external temperature in °C.
 * - ambientRH (Number): Ambient external Relative Humidity in %.
 * - width (Number): Shed width in feet.
 * - height (Number): Shed height in feet.
 * - volume (Number): Shed volume in cubic feet.
 * 
 * Outputs:
 * - ventilationParameters (Object): Min/Max CFM, required CFM, speed, and exchange cycle metrics.
 * 
 * Units:
 * - Temperatures: Celsius (°C) and Fahrenheit (°F)
 * - Required Air Speed: Feet per minute (ft/min)
 * - Air Exchange: Seconds (s)
 * 
 * Engineering Assumptions:
 * - Normal minimum ventilation requires 0.4 CFM per kg of bird biomass to satisfy respiratory requirements.
 * - Maximum ventilation requires up to 4.0 CFM per kg of biomass under heat-stress conditions.
 * - Ambient scaling assumes setpoint transitions begin at 70°F (21.1°C) and reach max capacity at 90°F (32.2°C).
 */

export const calculateVentilationRequirements = (age, birdCount, ambientTemp, ambientRH, width, height, volume) => {
  const birds = parseInt(birdCount) || 0;
  const tempC = parseFloat(ambientTemp) || 25;
  const widthVal = parseFloat(width) || 0;
  const heightVal = parseFloat(height) || 0;
  const volumeVal = parseFloat(volume) || 0;

  // Resolve estimated bird weight
  const growthStage = BROILER_GROWTH_CURVE.find(g => age <= g.maxAge) || BROILER_GROWTH_CURVE[BROILER_GROWTH_CURVE.length - 1];
  const estimatedWeightKg = growthStage.weightKg;
  const totalFlockWeightKg = birds * estimatedWeightKg;

  // Calculate limits
  const cfmMinLimit = Math.round(totalFlockWeightKg * CONSTANTS.CFM_MULTIPLIER_MIN_VENT);
  const cfmMaxLimit = Math.round(totalFlockWeightKg * CONSTANTS.CFM_MULTIPLIER_MAX_VENT);

  // Convert ambient temperature to Fahrenheit for setpoint calculations
  const ambientTempF = (tempC * 1.8) + 32;
  const tempScalingFactor = Math.max(0, Math.min(1, (ambientTempF - 70) / 20));
  
  // Calculate dynamic CFM targets
  const requiredCFM = Math.round(cfmMinLimit + tempScalingFactor * (cfmMaxLimit - cfmMinLimit));

  // Determine air speed in tunnel cross section
  const crossSectionArea = widthVal * heightVal;
  const requiredAirSpeed = crossSectionArea > 0 ? Math.round(requiredCFM / crossSectionArea) : 0;

  // Calculate volume air exchange seconds
  const airExchangeSeconds = requiredCFM > 0 ? Math.round((volumeVal * 60) / requiredCFM) : 300;

  return {
    estimatedWeightKg,
    totalFlockWeightKg,
    cfmMinLimit,
    cfmMaxLimit,
    requiredCFM,
    requiredAirSpeed,
    airExchangeSeconds
  };
};
