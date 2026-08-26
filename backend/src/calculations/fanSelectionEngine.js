import { selectContinuousFans } from "../optimizers/continuousFanOptimizer.js";
import { selectTimerFans } from "../optimizers/timerFanOptimizer.js";
import { selectRotationalFans } from "../optimizers/rotationOptimizer.js";
import { calculateEnergyConsumption } from "../optimizers/energyOptimizer.js";

/**
 * Calculator Engine: Fan Selection Optimizer
 * 
 * Purpose:
 * Determines the absolute optimal fan combination to meet the required CFM target.
 * 
 * Inputs:
 * - farmConfig (Object): length, width, height, fanCount, fanSize
 * - birdData (Object): age, count, breed
 * - weather (Object): ambientTemp, ambientHumidity
 * - ventReq (Object): requiredCFM
 * - fanDb (Object): Rated specifications of exhaust fans
 * 
 * Outputs:
 * - fanCombinationDetails (Object): Selected arrays, rotational queues, air speeds, and power footprint.
 */
export const generateFanCombination = (farmConfig, birdData, weather, ventReq, fanDb) => {
  const length = parseFloat(farmConfig.length) || 200;
  const width = parseFloat(farmConfig.width) || 60;
  const height = parseFloat(farmConfig.height) || 20;
  const fanCount = parseInt(farmConfig.fanCount) || 10;
  const fanSize = farmConfig.fanSize || "48 Inch";
  const requiredCFM = parseFloat(ventReq.requiredCFM) || 20000;

  const crossSection = width * height;
  const matchedFan = fanDb[fanSize] || fanDb["48 Inch"];
  const singleFanCfm = matchedFan.cfm;
  const fanHp = matchedFan.hp;

  const totalInstalledCFM = fanCount * singleFanCfm;

  // 1. Resolve continuous fans count
  const continuousRes = selectContinuousFans(requiredCFM, fanCount, singleFanCfm);
  const continuousFans = continuousRes.continuousFans;

  // 2. Resolve timer fans count
  const remainingCFM = Math.max(0, requiredCFM - continuousRes.continuousCFM);
  const timerRes = selectTimerFans(remainingCFM, continuousFans, fanCount, singleFanCfm);
  const timerFans = timerRes.timerFans;

  // 3. Resolve rotational idle queue
  const rotationRes = selectRotationalFans(continuousFans, fanCount);

  // 4. VFD modulation speed
  let vfdSpeed = 100;
  if (timerFans > 0) {
    vfdSpeed = Math.round((timerRes.fanOnTime / 300) * 100);
    vfdSpeed = Math.max(50, Math.min(100, vfdSpeed)); // clamp between 50% and 100%
  }

  // 5. Operating CFM & Air Speed
  const cycleFraction = timerFans > 0 ? (timerRes.fanOnTime / 300) : 0;
  const operatingCFM = Math.round((continuousFans + timerFans * cycleFraction) * singleFanCfm);
  const estimatedAirSpeed = crossSection > 0 ? Math.round(operatingCFM / crossSection) : 0;

  // 6. Energy footprint
  const power = calculateEnergyConsumption(continuousFans, timerFans, timerRes.fanOnTime, fanHp);

  const selectedCombination = `${continuousFans} Continuous, ${timerFans} Timer`;
  const fanRuntime = `ON: ${timerRes.fanOnTime}s, OFF: ${timerRes.fanOffTime}s`;

  return {
    requiredCFM,
    installedCFM: totalInstalledCFM,
    selectedCombination,
    continuousFans,
    timerFans,
    rotationalFans: rotationRes.rotationalFans,
    fanRuntime,
    fanRotationOrder: rotationRes.fanRotationOrder,
    vfdFan: "VFD-1",
    vfdSpeed: `${vfdSpeed}%`,
    operatingCFM,
    estimatedAirSpeed: `${estimatedAirSpeed} ft/min`,
    estimatedPowerConsumption: `${power} kW`
  };
};
