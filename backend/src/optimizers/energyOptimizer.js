import { ENGINEERING_CONSTANTS } from "../config/engineeringConstants.js";

/**
 * Optimizer: Energy Optimizer
 * 
 * Estimates energy consumption based on motor HP and duty cycle.
 */
export const calculateEnergyConsumption = (continuousFans, timerFans, fanOnTime, fanHP) => {
  const hpVal = parseFloat(fanHP) || 1.5;
  const onTime = parseInt(fanOnTime) || 0;
  
  const equivalentFans = continuousFans + timerFans * (onTime / ENGINEERING_CONSTANTS.TIMER_CYCLE_DURATION);
  const powerKw = parseFloat((equivalentFans * hpVal * ENGINEERING_CONSTANTS.HP_TO_KW_COEFF).toFixed(2));
  
  return powerKw;
};
