/**
 * Calculator Engine: Minimum Ventilation Engineering
 * 
 * Formulas:
 * 1. Required Fresh Air (CFM) = Bird Count * Bird Weight (kg) * 0.4 CFM/kg
 * 2. Required CFM = Required Fresh Air
 * 3. Required Air Exchange (seconds) = (Farm Volume * 60) / Required CFM
 * 4. Installed CFM = Total Fans * Rated Fan CFM
 * 5. Continuous Fans = Floor(Required CFM / Rated Fan CFM)
 * 6. Remaining CFM = Required CFM - (Continuous Fans * Rated Fan CFM)
 * 7. Timer Fans = Ceil(Remaining CFM / Rated Fan CFM)
 * 8. Timer Duty Cycle: ON = Round(300 * (Remaining CFM / (Timer Fans * Rated Fan CFM))), OFF = 300 - ON
 * 9. Rotational Fans = Total Fans - Continuous Fans
 * 10. Power (kW) = (Continuous Fans + Timer Fans * (ON / 300)) * Fan HP * 0.7457
 */

export const calculateMinimumVentilation = (farmConfig, birdData, weather, fanDb) => {
  const length = parseFloat(farmConfig.length) || 200;
  const width = parseFloat(farmConfig.width) || 60;
  const height = parseFloat(farmConfig.height) || 20;
  const fanCount = parseInt(farmConfig.fanCount) || 10;
  const fanSize = farmConfig.fanSize || "48 Inch";

  const age = parseInt(birdData.age) || 1;
  const count = parseInt(birdData.birdCount) || 0;
  const weight = parseFloat(birdData.weight) || 0.042;
  const heat = parseFloat(birdData.heat) || 0.8;
  const moisture = parseFloat(birdData.moisture) || 0.15;

  const matchedFan = fanDb[fanSize] || fanDb["48 Inch"];
  const singleFanCfm = matchedFan.cfm;
  const fanHp = matchedFan.hp;

  const farmVolume = length * width * height;

  // 1. Calculate Required Fresh Air (0.4 CFM per kg biomass)
  const totalFlockWeight = count * weight;
  const requiredFreshAir = Math.round(totalFlockWeight * 0.4);

  // 2. Airflow target
  const requiredCFM = requiredFreshAir;

  // 3. Air exchange seconds
  const requiredAirExchange = requiredCFM > 0 ? Math.round((farmVolume * 60) / requiredCFM) : 300;

  // 4. Installed capacity
  const installedCFM = fanCount * singleFanCfm;

  // 5. continuous and timer fans
  const continuousFans = Math.min(fanCount, Math.floor(requiredCFM / singleFanCfm));
  const remainingCFM = Math.max(0, requiredCFM - (continuousFans * singleFanCfm));
  const timerFans = remainingCFM > 0 ? Math.min(fanCount - continuousFans, Math.ceil(remainingCFM / singleFanCfm)) : 0;

  // 6. ON/OFF Duty Cycle (300-second cycle)
  let fanOnTime = 0;
  let fanOffTime = 0;
  if (timerFans > 0) {
    const cycleFraction = remainingCFM / (timerFans * singleFanCfm);
    fanOnTime = Math.max(15, Math.round(300 * cycleFraction)); // Minimum safe motor start duration
    fanOffTime = 300 - fanOnTime;
  }

  // 7. Rotational allocations
  const rotationalFans = timerFans > 0 ? Math.max(1, fanCount - continuousFans) : 0;

  // 8. Power Draw
  const equivalentFans = continuousFans + timerFans * (fanOnTime / 300);
  const powerKw = parseFloat((equivalentFans * fanHp * 0.7457).toFixed(2));

  return {
    birdAge: age,
    birdWeight: `${weight} kg`,
    heatProduction: `${heat} W/bird`,
    moistureProduction: `${moisture} g/hr/bird`,
    requiredFreshAir: `${requiredFreshAir.toLocaleString()} CFM`,
    requiredAirExchange: `${requiredAirExchange} seconds`,
    requiredCFM,
    installedCFM,
    continuousFans,
    timerFans,
    rotationalFans,
    fanOnTime,
    fanOffTime,
    estimatedPowerConsumption: `${powerKw} kW`
  };
};
