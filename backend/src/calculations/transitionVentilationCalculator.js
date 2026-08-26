/**
 * Calculator Engine: Transition Ventilation Engineering
 * 
 * Formulas:
 * 1. Temp Difference (ΔT) = Current House Temp - Target Temp
 * 2. Required Heat Removal (kW) = Total Flock Heat (Watts * count / 1000) * (1 + ΔT / 10.0)
 * 3. Required CFM = cfmMin + scaling * (0.6 * Total Installed CFM - cfmMin)
 *    where scaling = Clamp(ΔT / 2.0, 0, 1)
 * 4. Required Air Exchange (seconds) = (Farm Volume * 60) / Required CFM
 * 5. Continuous Fans = Floor(Required CFM / Single Fan CFM)
 * 6. Remaining CFM = Required CFM - (Continuous Fans * Single Fan CFM)
 * 7. Timer Fans = Ceil(Remaining CFM / Single Fan CFM)
 * 8. Timer Duty Cycle: ON = Round(300 * (Remaining CFM / (Timer Fans * Single Fan CFM))), OFF = 300 - ON
 * 9. Rotational Fans = Total Fans - Continuous Fans
 * 10. VFD Speed (%) = Clamp(50 + (Level - 1) * 10, 50, 100)
 * 11. Cooling Decision: Triggered only if ΔT >= 3.0°C and cooling pad enabled
 * 12. Power (kW) = (Continuous Fans + Timer Fans * (ON / 300)) * Fan HP * 0.7457
 */

export const calculateTransitionVentilation = (farmConfig, weather, birdData, houseConditions, fanDb) => {
  const length = parseFloat(farmConfig.length) || 200;
  const width = parseFloat(farmConfig.width) || 60;
  const height = parseFloat(farmConfig.height) || 20;
  const fanCount = parseInt(farmConfig.fanCount) || 10;
  const fanSize = farmConfig.fanSize || "48 Inch";
  const coolingPadEnabled = farmConfig.coolingPad || "Yes";

  const age = parseInt(birdData.age) || 1;
  const count = parseInt(birdData.birdCount) || 0;
  const weight = parseFloat(birdData.weight) || 0.042;
  const heatPerBird = parseFloat(birdData.heat) || 0.8;

  const targetT = parseFloat(houseConditions.targetTemp) || 30.0;
  const houseT = parseFloat(houseConditions.currentHouseTemp) || 31.2;
  const currentStage = parseInt(houseConditions.currentStage) || 1;

  const matchedFan = fanDb[fanSize] || fanDb["48 Inch"];
  const singleFanCfm = matchedFan.cfm;
  const fanHp = matchedFan.hp;

  const farmVolume = length * width * height;
  const totalInstalledCFM = fanCount * singleFanCfm;

  // 1. Temperature Difference (ΔT)
  const tempDifference = parseFloat((houseT - targetT).toFixed(2));

  // 2. Required Heat Removal (kW)
  const baseFlockHeatKw = (count * heatPerBird) / 1000;
  const requiredHeatRemoval = tempDifference > 0 
    ? parseFloat((baseFlockHeatKw * (1 + tempDifference / 10.0)).toFixed(2))
    : 0;

  // 3. Target CFM Calculation
  const cfmMin = Math.round((count * weight) * 0.4);
  let requiredCFM = cfmMin;
  if (tempDifference > 0) {
    const scaleFactor = Math.min(1, Math.max(0, tempDifference / 2.0)); // 2.0°C transition band
    requiredCFM = Math.round(cfmMin + scaleFactor * (0.6 * totalInstalledCFM - cfmMin));
  }

  // 4. Required Air Speed & draft safety verify
  const crossSection = width * height;
  let airSpeed = crossSection > 0 ? Math.round(requiredCFM / crossSection) : 0;
  let maxSpeedLimit = 600;
  if (age < 7) maxSpeedLimit = 100;
  else if (age < 14) maxSpeedLimit = 200;
  else if (age < 21) maxSpeedLimit = 350;

  if (airSpeed > maxSpeedLimit) {
    airSpeed = maxSpeedLimit;
    requiredCFM = maxSpeedLimit * crossSection;
  }

  // 5. Required Air Exchange seconds
  const requiredAirExchange = requiredCFM > 0 ? Math.round((farmVolume * 60) / requiredCFM) : 300;

  // 6. Continuous vs Timer Fan 전략
  const continuousFans = Math.min(fanCount, Math.floor(requiredCFM / singleFanCfm));
  const remainingCFM = Math.max(0, requiredCFM - (continuousFans * singleFanCfm));
  const timerFans = remainingCFM > 0 ? Math.min(fanCount - continuousFans, Math.ceil(remainingCFM / singleFanCfm)) : 0;

  let fanOnTime = 0;
  let fanOffTime = 0;
  if (timerFans > 0) {
    const cycleFraction = remainingCFM / (timerFans * singleFanCfm);
    fanOnTime = Math.max(15, Math.round(300 * cycleFraction));
    fanOffTime = 300 - fanOnTime;
  }

  const rotationalFans = timerFans > 0 ? Math.max(1, fanCount - continuousFans) : 0;

  // 7. Map level (1 to 16)
  let selectedVentilationLevel = 1;
  let minDifference = Infinity;
  for (let l = 1; l <= 16; l++) {
    const levelCFM = cfmMin + ((l - 1) / 15) * (totalInstalledCFM - cfmMin);
    const diff = Math.abs(levelCFM - requiredCFM);
    if (diff < minDifference) {
      minDifference = diff;
      selectedVentilationLevel = l;
    }
  }

  const vfdSpeed = Math.min(100, 50 + (selectedVentilationLevel - 1) * 10);

  // 8. Cooling trigger check
  const coolingRequired = (coolingPadEnabled === "Yes" && tempDifference >= 3.0) ? "Yes" : "No";

  // 9. Power draw draw
  const equivalentFans = continuousFans + timerFans * (fanOnTime / 300);
  const powerKw = parseFloat((equivalentFans * fanHp * 0.7457).toFixed(2));

  return {
    birdAge: age,
    currentStage,
    targetTemperature: `${targetT}°C`,
    currentHouseTemperature: `${houseT}°C`,
    temperatureDifference: `${tempDifference}°C`,
    requiredHeatRemoval: `${requiredHeatRemoval} kW`,
    requiredAirflow: `${airSpeed} ft/min`,
    requiredAirExchange: `${requiredAirExchange} seconds`,
    requiredCFM,
    installedCFM: totalInstalledCFM,
    selectedVentilationLevel,
    continuousFans,
    timerFans,
    rotationalFans,
    fanOnTime,
    fanOffTime,
    vfdSpeed: `${vfdSpeed}%`,
    coolingRequired,
    estimatedPowerConsumption: `${powerKw} kW`
  };
};
