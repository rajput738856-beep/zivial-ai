import { runStateMachine } from "./controllerStateMachine.js";
import { assembleControllerRecipe } from "./recipeCoordinator.js";

/**
 * Controller: Central Logic coordination brain
 * 
 * Exposes the main generateControllerRecipe() function to aggregate outputs.
 */
export const generateControllerRecipe = (farmConfig, weather, birdData, currentConditions) => {
  const age = parseInt(birdData.age) || 14;
  const targetT = parseFloat(currentConditions.targetTemp) || 30.0;
  const heatT = parseFloat(currentConditions.heatingTemp) || 28.0;
  const coolT = parseFloat(currentConditions.coolingTemp) || 33.0;

  const houseT = parseFloat(currentConditions.currentHouseTemp) || 31.2;
  const houseRH = parseFloat(currentConditions.currentHouseHumidity) || 65;
  const targetRH = 60; // target humidity constant

  const stateInputs = {
    houseT,
    targetT,
    heatT,
    coolT,
    houseRH,
    targetRH,
    ventLevel: 10,
    age
  };

  // 1. Run State Machine priorities
  const stateOutput = runStateMachine(stateInputs);

  // 2. Assemble Recipe parameters
  const weatherData = {
    ambientTemp: weather.ambientTemp || 28,
    ambientHumidity: weather.ambientHumidity || 65
  };

  const requiredCFM = 75000; // required CFM target

  const recipeDetails = assembleControllerRecipe(
    farmConfig,
    birdData,
    weatherData,
    stateOutput,
    requiredCFM
  );

  return {
    birdAge: age,
    currentStage: stateOutput.lightingRes.darkHours,
    weather: weatherData,
    stageSettings: {
      targetTemperature: `${targetT}°C`,
      heatingTemperature: `${heatT}°C`,
      coolingTemperature: `${coolT}°C`
    },
    heatingStatus: stateOutput.heatingRes.heatingStatus,
    ventilationMode: stateOutput.finalMode,
    ventilationLevels: recipeDetails.controllerRecipe.targetVentilationLevel,
    fanCombination: recipeDetails.selectedCombination,
    coolingSettings: {
      coolingStatus: stateOutput.coolingRes.coolingStatus,
      coolingLockReason: stateOutput.coolingRes.lockReason
    },
    humiditySettings: {
      humidityDifference: `${houseRH - targetRH}%`,
      humidityTreatmentActive: stateOutput.humidityRes.humidityTreatmentActive
    },
    lightingSettings: {
      schedule: stateOutput.lightingRes.scheduleDescription
    },
    controllerRecipe: recipeDetails.controllerRecipe
  };
};
