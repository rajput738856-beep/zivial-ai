import { ENGINEERING_CONSTANTS } from "../config/engineeringConstants.js";

/**
 * Optimizer: Timer Fan Selector
 * 
 * Computes remaining CFM, timer fans, and ON/OFF cycle timers.
 */
export const selectTimerFans = (remainingCFM, continuousFans, totalFans, singleFanCfm) => {
  const numFans = parseInt(totalFans) || 1;
  const fanCfm = parseFloat(singleFanCfm) || 20000;
  
  const timerFans = remainingCFM > 0 ? Math.min(numFans - continuousFans, Math.ceil(remainingCFM / fanCfm)) : 0;

  let fanOnTime = 0;
  let fanOffTime = 0;
  if (timerFans > 0) {
    const fraction = remainingCFM / (timerFans * fanCfm);
    fanOnTime = Math.max(ENGINEERING_CONSTANTS.MIN_MOTOR_ON_TIME, Math.round(ENGINEERING_CONSTANTS.TIMER_CYCLE_DURATION * fraction));
    fanOffTime = ENGINEERING_CONSTANTS.TIMER_CYCLE_DURATION - fanOnTime;
  }

  return {
    timerFans,
    fanOnTime,
    fanOffTime
  };
};
