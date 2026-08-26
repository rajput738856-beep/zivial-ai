import { FAN_DATABASE } from "../config/fanDatabase.js";
import { generateVentilationLevels } from "../calculations/ventilationOptimizer.js";

/**
 * Service: Ventilation Optimizer wrapper
 */
export const optimizeVentilation = (farmConfig, birdData, weather, ventReqs) => {
  return generateVentilationLevels(farmConfig, birdData, weather, ventReqs, FAN_DATABASE);
};
