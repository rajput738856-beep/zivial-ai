import { ENGINEERING_CONSTANTS } from "../config/engineeringConstants.js";

/**
 * Optimizer: Fan Selection Optimizer
 * 
 * Determines continuous vs. timer fan numbers and cycle ON/OFF durations.
 */
export const selectOptimalFans = (targetCFM, totalFans, singleFanCfm) => {
  const numFans = parseInt(totalFans) || 1;
  const fanCfm = parseFloat(singleFanCfm) || 20000;
  const target = parseFloat(targetCFM) || 0;

  // Continuous fans
  const continuousFans = Math.min(numFans, Math.floor(target / fanCfm));
  
  // Timer fans
  const remainingCFM = Math.max(0, target - (continuousFans * fanCfm));
  const timerFans = remainingCFM > 0 ? Math.min(numFans - continuousFans, Math.ceil(remainingCFM / fanCfm)) : 0;

  // Timer cycle seconds (based on 300-second cycle)
  let fanOnTime = 0;
  let fanOffTime = 0;
  if (timerFans > 0) {
    const fraction = remainingCFM / (timerFans * fanCfm);
    fanOnTime = Math.max(ENGINEERING_CONSTANTS.MIN_MOTOR_ON_TIME, Math.round(ENGINEERING_CONSTANTS.TIMER_CYCLE_DURATION * fraction));
    fanOffTime = ENGINEERING_CONSTANTS.TIMER_CYCLE_DURATION - fanOnTime;
  }

  const rotationalFans = timerFans > 0 ? Math.max(1, numFans - continuousFans) : 0;

  return {
    continuousFans,
    timerFans,
    rotationalFans,
    fanOnTime,
    fanOffTime
  };
};
