import { FAN_DATABASE } from "../config/fanDatabase.js";
import { generateFanCombination } from "../calculations/fanSelectionEngine.js";

/**
 * Service: Fan Selection Orchestrator
 */
export const getOptimalFanCombination = (farmConfig, birdData, weather, ventReq) => {
  return generateFanCombination(farmConfig, birdData, weather, ventReq, FAN_DATABASE);
};
