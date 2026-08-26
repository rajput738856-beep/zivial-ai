/**
 * Logic: Heating Decisions
 * 
 * Determines heater relay status based on thresholds.
 */
export const checkHeating = (houseTemp, heatingTemp) => {
  const houseT = parseFloat(houseTemp) || 30.0;
  const heatT = parseFloat(heatingTemp) || 28.0;

  const heatingActive = houseT < heatT;

  return {
    heatingStatus: heatingActive ? "ON" : "OFF",
    heaterRelayCount: heatingActive ? 2 : 0
  };
};
