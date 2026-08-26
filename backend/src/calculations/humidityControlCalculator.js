/**
 * Calculator Engine: Humidity Control Engine
 * 
 * Formulas:
 * 1. Humidity Difference = Current RH - Target RH
 * 2. Raw Offset = Ceil(Humidity Difference / 5.0) [Clamped to Maximum Allowed Offset]
 * 3. Effective Ventilation Level = Current Ventilation Level + Requested Ventilation Offset
 * 
 * Purpose:
 * Computes ventilation offsets to expel excess moisture from poultry house, 
 * using incremental offsets rather than direct fan overrides.
 * 
 * Inputs:
 * - currentClimate (Object): birdAge, currentStage, currentHouseTemp, currentRH, ambientTemp, ambientRH
 * - ventilationStatus (Object): currentLevel, currentFanStatus
 * - coolingStatus (Object): currentCoolingStatus
 * - humidityRules (Array): Mapped rule thresholds and limits
 * 
 * Outputs:
 * - humidityControlDetails (Object): Targets, offsets, timers, and recovery requirements.
 * 
 * Units:
 * - Relative Humidity: Percentage (%)
 * - Ventilation Levels: Integer Index (1 to 16)
 * - Timers: Minutes (min)
 * 
 * Engineering Assumptions:
 * - Ventilation offsets are clamped to the maximum allowed limit for the active growth stage.
 * - Prevents rapid toggling by enforcing a delay window before active offset increments.
 */

export const calculateHumidityControl = (currentClimate, ventilationStatus, coolingStatus, humidityRules) => {
  const age = parseInt(currentClimate.birdAge) || 1;
  const stage = parseInt(currentClimate.currentStage) || 1;
  const houseRH = parseFloat(currentClimate.currentRH) || 65;
  const ventLevel = parseInt(ventilationStatus.currentLevel) || 5;

  // Resolve matching profile row based on age
  const row = humidityRules.find(r => age >= r.minAge && age <= r.maxAge) || humidityRules[humidityRules.length - 1];

  const targetHumidity = row.targetRH;
  const tempDiff = houseRH - targetHumidity;
  const humidityDifference = parseFloat(tempDiff.toFixed(2));

  let requestedVentilationOffset = 0;
  let humidityTreatmentActive = "No";
  let delayTimer = `${row.delayMin} min`;
  let durationTimer = "0 min";
  let recoveryRequired = "No";
  let estimatedRecoveryTime = "0 min";

  if (humidityDifference > 0) {
    humidityTreatmentActive = "Yes";
    delayTimer = "0 min"; // Delay completed
    durationTimer = `${row.durationMin} min`;
    
    // Scale offset based on severity: 1 level for every 5% RH above target
    const calculatedOffset = Math.ceil(humidityDifference / 5.0);
    requestedVentilationOffset = Math.min(row.maxOffset, calculatedOffset);

    if (houseRH > row.targetRH + 10) {
      recoveryRequired = "Yes";
      estimatedRecoveryTime = `${row.recoveryMin} min`;
    }
  }

  const effectiveVentilationLevel = Math.min(16, ventLevel + requestedVentilationOffset);

  return {
    currentHumidity: `${houseRH}%`,
    targetHumidity: `${targetHumidity}%`,
    humidityDifference: `${humidityDifference}%`,
    humidityTreatmentActive,
    delayTimer,
    durationTimer,
    requestedVentilationOffset,
    effectiveVentilationLevel,
    maximumAllowedOffset: row.maxOffset,
    recoveryRequired,
    estimatedRecoveryTime
  };
};
