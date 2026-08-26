import { STAGE_RULES } from "../config/stageRules.js";
import { FAN_DATABASE } from "../config/fanDatabase.js";
import { BIRD_HEAT_TABLE } from "../config/birdHeatTable.js";
import { BIRD_WEIGHT_TABLE } from "../config/birdWeightTable.js";
import { calculateTransitionVentilation } from "../calculations/transitionVentilationCalculator.js";

/**
 * Service: Transition Ventilation Orchestration
 * 
 * Coordinates:
 * 1. Age computation from placement date.
 * 2. Stage rules matching (cooling/heating thresholds).
 * 3. Breed biological properties lookup (weights, metabolic heat output).
 * 4. Transition calculator invocation.
 */

export const getTransitionVentilationSettings = (farmConfig, placementDate, breedName, weather, currentHouseTemp) => {
  const breed = breedName || "Cobb 500";

  // Calculate Bird Age
  let birdAge = 1;
  if (placementDate) {
    const today = new Date();
    const placement = new Date(placementDate);
    const diff = today.getTime() - placement.getTime();
    const calculated = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (!isNaN(calculated) && calculated >= 0) {
      birdAge = calculated;
    }
  }

  // Resolve Stage targets from lookup
  const activeStage = STAGE_RULES.find(s => birdAge <= s.maxAge) || STAGE_RULES[STAGE_RULES.length - 1];
  const targetTemp = activeStage.target;
  const currentStage = activeStage.stageNum;

  // Resolve Weight lookup record
  const weightProfile = BIRD_WEIGHT_TABLE[breed] || BIRD_WEIGHT_TABLE["Cobb 500"];
  const weightRecord = weightProfile.find(r => birdAge <= r.maxAge) || weightProfile[weightProfile.length - 1];
  const birdWeight = weightRecord.weightKg;

  // Resolve Heat lookup record
  const heatProfile = BIRD_HEAT_TABLE[breed] || BIRD_HEAT_TABLE["Cobb 500"];
  const heatRecord = heatProfile.find(r => birdAge <= r.maxAge) || heatProfile[heatProfile.length - 1];
  const heatProduction = heatRecord.heatWatts;

  const birdData = {
    age: birdAge,
    birdCount: farmConfig.birdCount || 25000,
    weight: birdWeight,
    heat: heatProduction
  };

  const houseConditions = {
    targetTemp,
    currentHouseTemp: currentHouseTemp || (targetTemp + 1.2), // Default to +1.2°C above target to trigger transition
    currentStage
  };

  return calculateTransitionVentilation(farmConfig, weather, birdData, houseConditions, FAN_DATABASE);
};
