import { getOptimalFanCombination } from "../services/fanSelection.service.js";
import { buildRecipe } from "../logic/recipeGenerator.js";

/**
 * Controller: Recipe Coordinator
 * 
 * Invokes fan selection optimization and builds the complete controller settings payload.
 */
export const assembleControllerRecipe = (farmConfig, birdData, weather, stateOutput, requiredCFM) => {
  const { heatingRes, coolingRes, humidityRes, lightingRes, finalMode } = stateOutput;

  // Resolve active ventilation level offset shifts
  const originalLevel = 5;
  const effectiveLevel = Math.min(16, originalLevel + humidityRes.requestedOffset);

  // Invoke fan optimization selection
  const fanSelection = getOptimalFanCombination(
    farmConfig,
    birdData,
    weather,
    { requiredCFM }
  );

  const recipe = buildRecipe(
    finalMode,
    effectiveLevel,
    fanSelection,
    heatingRes,
    coolingRes,
    humidityRes,
    lightingRes
  );

  return {
    selectedCombination: fanSelection.selectedCombination,
    fanRuntime: fanSelection.fanRuntime,
    fanRotationOrder: fanSelection.fanRotationOrder,
    vfdSpeed: fanSelection.vfdSpeed,
    operatingCFM: fanSelection.operatingCFM,
    estimatedAirSpeed: fanSelection.estimatedAirSpeed,
    estimatedPowerConsumption: fanSelection.estimatedPowerConsumption,
    controllerRecipe: recipe
  };
};
