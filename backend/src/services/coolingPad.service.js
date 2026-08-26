import { COOLING_PROFILE } from "../config/coolingProfile.js";
import { STAGE_RULES } from "../config/stageRules.js";
import { calculateCoolingPad } from "../calculations/coolingPadCalculator.js";

/**
 * Service: Cooling Pad Orchestration
 * 
 * Coordinates:
 * 1. Age computation from placement date.
 * 2. Stage lookup for target cooling temperatures.
 * 3. Cooling calculator execution.
 */

export const getCoolingPadSettings = (farmConfig, placementDate, breed, weather, currentHouseTemp, ventLevel) => {
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

  // Resolve target cooling setpoint
  const activeStage = STAGE_RULES.find(s => birdAge <= s.maxAge) || STAGE_RULES[STAGE_RULES.length - 1];
  
  const targetTemp = activeStage.target;
  const coolingTemp = activeStage.cool;
  const currentStage = activeStage.stageNum;

  const birdData = {
    age: birdAge,
    currentStage
  };

  const weatherData = {
    ambientTemp: weather.ambientTemp || 28,
    ambientRH: weather.ambientHumidity || 65,
    targetTemp,
    coolingTemp,
    currentHouseTemp: currentHouseTemp || (coolingTemp + 1.5), // triggers cooling by default
    ventLevel: ventLevel || 10
  };

  return calculateCoolingPad(farmConfig, birdData, weatherData, COOLING_PROFILE);
};
