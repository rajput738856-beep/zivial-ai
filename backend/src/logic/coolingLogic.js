/**
 * Logic: Cooling Pad Activation Check
 * 
 * Verifies cooling locks based on ventilation and humidity thresholds.
 */
export const checkCooling = (houseTemp, coolingTemp, ambientRH, offRH, ventLevel) => {
  const houseT = parseFloat(houseTemp) || 30.0;
  const coolT = parseFloat(coolingTemp) || 32.0;
  const rh = parseFloat(ambientRH) || 60;
  const rhLimit = parseFloat(offRH) || 80;
  const level = parseInt(ventLevel) || 1;

  const allowed = (houseT >= coolT) && (rh < rhLimit) && (level >= 7);

  return {
    coolingStatus: allowed ? "ON" : "OFF",
    coolingPadActive: allowed,
    lockReason: rh >= rhLimit ? "Humidity Lockout" : (level < 7 ? "Ventilation level too low" : "None")
  };
};
