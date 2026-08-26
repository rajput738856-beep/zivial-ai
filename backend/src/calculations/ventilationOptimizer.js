import { buildLevels } from "../optimizers/levelGenerator.js";

/**
 * Service: Ventilation Optimizer (Module 05)
 * 
 * Computes farm geometry, parses age-based limits, and delegates step generation to build 16 levels.
 */
export const generateVentilationLevels = (farmConfig, birdData, weather, ventReqs, fanDb) => {
  const length = parseFloat(farmConfig.length) || 200;
  const width = parseFloat(farmConfig.width) || 60;
  const height = parseFloat(farmConfig.height) || 20;
  const fanCount = parseInt(farmConfig.fanCount) || 10;
  const fanSize = farmConfig.fanSize || "48 Inch";

  const matchedFan = fanDb[fanSize] || fanDb["48 Inch"];
  const singleFanCfm = matchedFan.cfm;
  const fanHp = matchedFan.hp;

  const farmVolume = length * width * height;
  const crossSection = width * height;
  const floorArea = length * width;

  const installedCFM = fanCount * singleFanCfm;

  // Read targets from other engines or inputs
  const cfmMin = parseFloat(ventReqs.cfmMinLimit) || 10000;
  const targetCFM = parseFloat(ventReqs.requiredCFM) || cfmMin;

  const requiredAirflow = crossSection > 0 ? `${Math.round(targetCFM / crossSection)} ft/min` : "0 ft/min";

  // Build the levels 1-16
  const levels = buildLevels(cfmMin, installedCFM, fanCount, singleFanCfm, fanHp);

  return {
    farmGeometry: {
      floorArea: `${floorArea.toLocaleString()} sq ft`,
      volume: `${farmVolume.toLocaleString()} cu ft`,
      crossSectionalArea: `${crossSection} sq ft`
    },
    requiredAirflow,
    requiredAirSpeed: requiredAirflow,
    requiredCFM: targetCFM,
    installedCFM,
    levels
  };
};
