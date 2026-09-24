import { STAGE_LOOKUP } from "../config/poultryConfig.js";
import { breedTemperatureData } from "../src/constants/breedTemperatureData.js";

const getTargetTempForAge = (age, defaultTarget, breed) => {
  if (!breed) return defaultTarget;
  const maxDay = breedTemperatureData.length - 1;
  const lookupDay = age > maxDay ? maxDay : age;
  const tempRecord = breedTemperatureData.find(d => d.Age_Day === lookupDay);
  if (tempRecord && tempRecord[breed]) {
    return tempRecord[breed];
  }
  return defaultTarget;
};

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

export const getStageSettings = (age, stageMappings = null, breed = null) => {
  const activeStage = STAGE_LOOKUP.find(s => age <= s.maxAge) || STAGE_LOOKUP[STAGE_LOOKUP.length - 1];
  const mapping = stageMappings ? stageMappings.find(m => m.stageNum === activeStage.stageNum) : null;
  
  const target = getTargetTempForAge(age, activeStage.target, breed);
  const heat = target - 1.0;
  const cool = target + 0.2;
  const minAlarm = target - 3.0;
  const maxAlarm = target + 4.0;
  
  return {
    stage: activeStage.stageNum,
    dayRange: activeStage.dayRange,
    targetTemp: `${target}°C`,
    heatingTemp: `${heat}°C`,
    coolingTemp: `${cool}°C`,
    minAlarm: `${minAlarm}°C`,
    maxAlarm: `${maxAlarm}°C`,
    ventSafe: mapping ? String(mapping.ventSafe) : "1",
    ventMin: mapping ? String(mapping.ventMin) : "1",
    ventMax: mapping ? String(mapping.ventMax) : "1",
    rawValues: { ...activeStage, target, heat, cool, alarmMin: minAlarm, alarmMax: maxAlarm }
  };
};

export const getAllStagesForRecipe = (stageMappings = null, breed = null) => {
  return STAGE_LOOKUP.map(s => {
    const mapping = stageMappings ? stageMappings.find(m => m.stageNum === s.stageNum) : null;
    const target = getTargetTempForAge(s.maxAge === Infinity ? 42 : s.maxAge, s.target, breed);
    const heat = target - 1.0;
    const cool = target + 0.2;
    const minAlarm = target - 3.0;
    const maxAlarm = target + 4.0;
    return {
      stage: s.stageNum,
      dayRange: String(s.dayRange),
      targetTemp: `${target}°C`,
      heatingTemp: `${heat}°C`,
      coolingTemp: `${cool}°C`,
      minAlarm: `${minAlarm}°C`,
      maxAlarm: `${maxAlarm}°C`,
      ventSafe: mapping ? String(mapping.ventSafe) : "1",
      ventMin: mapping ? String(mapping.ventMin) : "1",
      ventMax: mapping ? String(mapping.ventMax) : "1"
    };
  });
};
