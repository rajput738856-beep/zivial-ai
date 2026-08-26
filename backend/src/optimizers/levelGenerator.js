import { selectOptimalFans } from "./fanSelectionOptimizer.js";
import { calculateEnergyConsumption } from "./energyOptimizer.js";

/**
 * Optimizer: Level Generator
 * 
 * Generates Level 1 to Level 16 controller step targets deterministically.
 */
export const buildLevels = (cfmMin, totalInstalledCFM, fanCount, singleFanCfm, fanHP) => {
  const levels = [];
  const minCFM = parseFloat(cfmMin) || 10000;
  const maxCFM = parseFloat(totalInstalledCFM) || 150000;
  const numFans = parseInt(fanCount) || 10;
  const cfmPerFan = parseFloat(singleFanCfm) || 20000;
  const hp = parseFloat(fanHP) || 1.5;

  for (let l = 1; l <= 16; l++) {
    // 1. Calculate Required CFM for this step
    const targetCFM = Math.round(minCFM + ((l - 1) / 15) * (maxCFM - minCFM));

    // 2. Resolve fan combination targets
    const fanSelection = selectOptimalFans(targetCFM, numFans, cfmPerFan);

    // 3. VFD modulation speed
    let vfdSpeed = 100;
    if (l <= 6) {
      vfdSpeed = Math.min(100, 50 + (l - 1) * 10);
    } else {
      vfdSpeed = Math.min(100, 80 + (l - 7) * 4);
    }

    // 4. Calculate actual operating CFM
    const cycleFraction = fanSelection.timerFans > 0 ? (fanSelection.fanOnTime / 300) : 0;
    const operatingCFM = Math.round((fanSelection.continuousFans + fanSelection.timerFans * cycleFraction) * cfmPerFan);

    // 5. Estimated Air speed
    const crossSection = 60 * 20; // standard cross section area
    const estimatedAirSpeed = crossSection > 0 ? Math.round(operatingCFM / crossSection) : 0;

    // 6. Energy footprint
    const power = calculateEnergyConsumption(
      fanSelection.continuousFans,
      fanSelection.timerFans,
      fanSelection.fanOnTime,
      hp
    );

    // 7. Temperature delta mappings
    const tDeltas = [0.1, 0.3, 0.4, 0.5, 1.5, 2.5, 3.5, 5.5, 8.5, 9.3, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0];
    const temperatureDifference = tDeltas[l - 1];

    levels.push({
      level: l,
      requiredCFM: targetCFM,
      temperatureDifference: `${temperatureDifference}°C`,
      continuousFans: fanSelection.continuousFans,
      timerFans: fanSelection.timerFans,
      rotationalFans: fanSelection.rotationalFans,
      fanOnTime: fanSelection.fanOnTime,
      fanOffTime: fanSelection.fanOffTime,
      vfdSpeed: `${vfdSpeed}%`,
      operatingCFM,
      estimatedAirSpeed: `${estimatedAirSpeed} ft/min`,
      estimatedPower: `${power} kW`
    });
  }

  return levels;
};
