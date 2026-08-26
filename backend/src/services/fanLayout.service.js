import { FAN_DATABASE } from "../config/fanDatabase.js";
import { generateFanLayout } from "../calculations/fanLayoutGenerator.js";

/**
 * Service: Fan Layout Orchestrator
 */
export const getOptimalFanLayout = (farmConfig, controllerConfig) => {
  return generateFanLayout(farmConfig, controllerConfig, FAN_DATABASE);
};
