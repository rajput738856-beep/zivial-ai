/**
 * Logic: Recipe Generator
 * 
 * Assembles the final controller settings packet.
 */
export const buildRecipe = (mode, level, fanCombination, heatingRes, coolingRes, humidityRes, lightingRes) => {
  return {
    controllerMode: mode,
    targetVentilationLevel: level,
    activeFans: {
      continuousCount: fanCombination.continuousFans,
      timerCount: fanCombination.timerFans,
      rotationalCount: fanCombination.rotationalFans,
      vfdSpeed: fanCombination.vfdSpeed,
      timerCycle: fanCombination.fanRuntime
    },
    relays: {
      heaters: heatingRes.heatingStatus,
      coolingPumps: coolingRes.coolingStatus
    },
    alerts: {
      humidityAlert: humidityRes.humidityTreatmentActive === "Yes" ? "HIGH_HUMIDITY" : "NORMAL"
    },
    lighting: lightingRes.scheduleDescription
  };
};
