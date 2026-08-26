import { checkHeating } from "../logic/heatingLogic.js";
import { checkVentilationMode } from "../logic/ventilationLogic.js";
import { checkCooling } from "../logic/coolingLogic.js";
import { checkHumidityOffset } from "../logic/humidityLogic.js";
import { checkLightingSchedule } from "../logic/lightingLogic.js";

/**
 * Controller: State Machine Evaluator
 * 
 * Determines active climate modes based on priority:
 * Heating -> Humidity -> Minimum -> Transition -> Tunnel -> Cooling
 */
export const runStateMachine = (inputs) => {
  const { houseT, targetT, heatT, coolT, houseRH, targetRH, ventLevel, age } = inputs;

  const heatingRes = checkHeating(houseT, heatT);
  const ventMode = checkVentilationMode(houseT, targetT, heatT, coolT);
  const humidityRes = checkHumidityOffset(houseRH, targetRH, 3);
  const coolingRes = checkCooling(houseT, coolT, houseRH, 80, ventLevel);
  const lightingRes = checkLightingSchedule(age);

  let finalMode = ventMode;
  if (heatingRes.heatingStatus === "ON") {
    finalMode = "Heating Mode";
  } else if (coolingRes.coolingStatus === "ON") {
    finalMode = "Cooling Mode";
  }

  return {
    heatingRes,
    coolingRes,
    humidityRes,
    lightingRes,
    ventMode,
    finalMode
  };
};
