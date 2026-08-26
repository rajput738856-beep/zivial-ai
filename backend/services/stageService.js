import { STAGE_LOOKUP } from "../config/poultryConfig.js";

/**
 * Service: Stage Rule Engine (Module 2)
 * 
 * Formula:
 * Lookup matched stage s where: age <= s.maxAge
 * 
 * Purpose:
 * Maps biological climate thresholds according to age, strictly adhering to established poultry manuals.
 * 
 * Inputs:
 * - age (Number): Bird age in days.
 * 
 * Outputs:
 * - stageSettings (Object): Configuration matching target temp, heating limits, and safety ventilation indexes.
 * 
 * Units:
 * - Age: Days
 * - Temperatures: Celsius (°C)
 * - Ventilation Levels: Integer Indexes (1 to 16)
 * 
 * Engineering Assumptions:
 * - Lookup tables contain biological temperature curves which must not be mathematically interpolated 
 *   to avoid controller setpoint mismatch.
 */

export const getStageSettings = (age, stageMappings = null) => {
  const activeStage = STAGE_LOOKUP.find(s => age <= s.maxAge) || STAGE_LOOKUP[STAGE_LOOKUP.length - 1];
  const mapping = stageMappings ? stageMappings.find(m => m.stageNum === activeStage.stageNum) : null;
  
  return {
    stage: activeStage.stageNum,
    dayRange: activeStage.dayRange,
    targetTemp: `${activeStage.target}°C`,
    heatingTemp: `${activeStage.heat}°C`,
    coolingTemp: `${activeStage.cool}°C`,
    minAlarm: `${activeStage.alarmMin}°C`,
    maxAlarm: `${activeStage.alarmMax}°C`,
    ventSafe: mapping ? String(mapping.ventSafe) : "1",
    ventMin: mapping ? String(mapping.ventMin) : "1",
    ventMax: mapping ? String(mapping.ventMax) : "1",
    rawValues: activeStage
  };
};

export const getAllStagesForRecipe = (stageMappings = null) => {
  return STAGE_LOOKUP.map(s => {
    const mapping = stageMappings ? stageMappings.find(m => m.stageNum === s.stageNum) : null;
    return {
      stage: s.stageNum,
      dayRange: String(s.dayRange),
      targetTemp: `${s.target}°C`,
      heatingTemp: `${s.heat}°C`,
      coolingTemp: `${s.cool}°C`,
      minAlarm: `${s.alarmMin}°C`,
      maxAlarm: `${s.alarmMax}°C`,
      ventSafe: mapping ? String(mapping.ventSafe) : "1",
      ventMin: mapping ? String(mapping.ventMin) : "1",
      ventMax: mapping ? String(mapping.ventMax) : "1"
    };
  });
};
