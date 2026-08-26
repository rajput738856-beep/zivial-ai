import { HUMIDITY_RULES } from "../config/humidityRules.js";
import { STAGE_RULES } from "../config/stageRules.js";
import { calculateHumidityControl } from "../calculations/humidityControlCalculator.js";

/**
 * Service: Humidity Control Orchestration
 * 
 * Coordinates:
 * 1. Age computation from placement date.
 * 2. Stage lookup for climate metadata.
 * 3. Humidity calculator execution.
 */

export const getHumidityControlSettings = (farmConfig, placementDate, breed, weather, currentHouseTemp, ventLevel, coolingStatus) => {
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
  const currentStage = activeStage.stageNum;

  const currentClimate = {
    birdAge,
    currentStage,
    currentHouseTemp: currentHouseTemp || activeStage.target,
    currentRH: weather.ambientHumidity || 65,
    ambientTemp: weather.ambientTemp || 28,
    ambientRH: weather.ambientHumidity || 65
  };

  const ventilationStatus = {
    currentLevel: ventLevel || 5,
    currentFanStatus: "ON"
  };

  const coolStatus = {
    currentCoolingStatus: coolingStatus || "No"
  };

  return calculateHumidityControl(currentClimate, ventilationStatus, coolStatus, HUMIDITY_RULES);
};
