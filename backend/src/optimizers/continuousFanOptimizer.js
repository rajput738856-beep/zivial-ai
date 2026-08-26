/**
 * Optimizer: Continuous Fan Selector
 * 
 * Selects highest-efficiency exhaust fans to run continuously.
 */
export const selectContinuousFans = (requiredCFM, totalFans, singleFanCfm) => {
  const numFans = parseInt(totalFans) || 1;
  const fanCfm = parseFloat(singleFanCfm) || 20000;
  
  // Calculate continuous count
  const count = Math.min(numFans, Math.floor(requiredCFM / fanCfm));
  
  return {
    continuousFans: count,
    continuousCFM: count * fanCfm
  };
};
