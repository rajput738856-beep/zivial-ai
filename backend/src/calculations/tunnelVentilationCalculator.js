/**
 * Service: Tunnel Ventilation Engineering (Module 04)
 * 
 * Formulas:
 * 1. Temp Difference (ΔT) = Current House Temp - Target Temp
 * 2. Raw Air Velocity = Clamped velocity scaling from 200 to 600 ft/min based on ΔT
 * 3. Air Velocity Cap = Limit based on birdAge:
 *    - Day 0-7: 100 ft/min
 *    - Day 8-14: 200 ft/min
 *    - Day 15-21: 350 ft/min
 *    - Day 22+: 600 ft/min
 * 4. Required CFM = Required Air Velocity * (Width * Height)
 * 5. Continuous Fans = Floor(Required CFM / Single Fan CFM)
 * 6. Timer Fans = Ceil((Required CFM - Continuous CFM) / Single Fan CFM)
 * 7. Active Equivalent Fans = Continuous Fans + Timer Fans * (fanOnTime / 300)
 * 8. Estimated Power (kW) = Active Equivalent Fans * Fan Horsepower * 0.7457 (kW/HP)
 * 9. Cooling Pad Trigger = Enabled if coolingPad === "Yes" AND ΔT >= 3.0°C AND ambient RH < 80%
 * 
 * Purpose:
 * Computes maximum convective wind-chill cooling airflow strategies under high heat stress, 
 * integrating pad cooling and electrical power estimation.
 * 
 * Inputs:
 * - age (Number): Bird age.
 * - width (Number): Shed width (ft).
 * - height (Number): Shed height (ft).
 * - totalFans (Number): Number of fans installed.
 * - singleFanCfm (Number): CFM rating per fan.
 * - fanHp (Number): Horsepower per fan.
 * - coolingPadEnabled (String): "Yes" or "No".
 * - ambientRH (Number): Ambient relative humidity.
 * - targetTemp (Number): Stage target temperature.
 * - currentHouseTemp (Number): Current house temperature.
 * 
 * Outputs:
 * - tunnelVentilationDetails (Object): Air velocity, total CFM, fan requirements, cooling status, and estimated power.
 * 
 * Units:
 * - Air Speed: Feet per Minute (ft/min)
 * - CFM: Cubic Feet per Minute
 * - Power: Kilowatts (kW)
 * 
 * Engineering Assumptions:
 * - Converts horsepower to kilowatts using standard metric coefficient: 1 HP = 0.7457 kW.
 * - Prevents high latent moisture stress by locking cooling pads if ambient RH is >= 80%.
 */

export const calculateTunnelVentilation = (
  age,
  width,
  height,
  totalFans,
  singleFanCfm,
  fanHp,
  coolingPadEnabled,
  ambientRH,
  targetTemp,
  currentHouseTemp
) => {
  const ageVal = parseInt(age) || 1;
  const numFans = parseInt(totalFans) || 1;
  const fanCfm = parseFloat(singleFanCfm) || 20000;
  const hpVal = parseFloat(fanHp) || 1.5;
  const rhVal = parseFloat(ambientRH) || 60;
  const targetT = parseFloat(targetTemp) || 30.0;
  const houseT = parseFloat(currentHouseTemp) || 33.5;
  const wVal = parseFloat(width) || 60;
  const hVal = parseFloat(height) || 20;

  const tempDiff = parseFloat((houseT - targetT).toFixed(2));
  const totalInstalledCFM = numFans * fanCfm;

  // 1. Determine target convective air speed
  let targetVelocity = 0;
  if (tempDiff > 0) {
    if (tempDiff <= 2.0) {
      targetVelocity = 200 + (tempDiff / 2.0) * 200; // 200 to 400 ft/min
    } else {
      targetVelocity = 400 + Math.min(1, (tempDiff - 2.0) / 3.0) * 200; // 400 to 600 ft/min
    }
  }

  // 2. Air speed safety ceiling based on age
  let maxSpeedLimit = 600;
  if (ageVal < 7) maxSpeedLimit = 100;
  else if (ageVal < 14) maxSpeedLimit = 200;
  else if (ageVal < 21) maxSpeedLimit = 350;

  const requiredAirVelocity = Math.min(targetVelocity, maxSpeedLimit);

  // 3. Compute Required CFM
  const crossSection = wVal * hVal;
  const requiredCFM = Math.round(requiredAirVelocity * crossSection);

  // 4. Resolve continuous and timer fans
  const continuousFans = Math.min(numFans, Math.floor(requiredCFM / fanCfm));
  const remainingCFM = Math.max(0, requiredCFM - (continuousFans * fanCfm));
  const timerFans = remainingCFM > 0 ? Math.min(numFans - continuousFans, Math.ceil(remainingCFM / fanCfm)) : 0;

  let fanOnTime = 0;
  let fanOffTime = 0;
  if (timerFans > 0) {
    const cycleFraction = remainingCFM / (timerFans * fanCfm);
    fanOnTime = Math.max(15, Math.round(300 * cycleFraction));
    fanOffTime = 300 - fanOnTime;
  }

  const rotationalFans = timerFans > 0 ? Math.max(1, numFans - continuousFans) : 0;

  // 5. Select closest ventilation level
  let selectedTunnelLevel = 1;
  let minDifference = Infinity;
  // Level mapping bounds
  const cfmMinLimit = 0.4 * 10000 * 0.98; // Reference index for level mapping
  for (let l = 1; l <= 16; l++) {
    const levelCFM = cfmMinLimit + ((l - 1) / 15) * (totalInstalledCFM - cfmMinLimit);
    const diff = Math.abs(levelCFM - requiredCFM);
    if (diff < minDifference) {
      minDifference = diff;
      selectedTunnelLevel = l;
    }
  }

  const vfdSpeed = Math.min(100, Math.max(80, 80 + (selectedTunnelLevel - 7) * 4));

  // 6. Cooling pad logic
  const coolingEnabled = (coolingPadEnabled === "Yes" && tempDiff >= 3.0 && rhVal < 80);

  // 7. Estimated power consumption
  const activeEquivalentFans = continuousFans + timerFans * (fanOnTime / 300);
  const estimatedPowerKw = parseFloat((activeEquivalentFans * hpVal * 0.7457).toFixed(2));

  return {
    requiredAirVelocity: `${requiredAirVelocity} ft/min`,
    requiredCFM,
    installedCFM: totalInstalledCFM,
    requiredFans: continuousFans + timerFans,
    continuousFans,
    timerFans,
    rotationalFans,
    fanOnTime,
    fanOffTime,
    vfdSpeed: `${vfdSpeed}%`,
    selectedTunnelLevel,
    coolingEnabled: coolingEnabled ? "Yes" : "No",
    estimatedPowerConsumption: `${estimatedPowerKw} kW`
  };
};
