/**
 * Logic: Humidity Boost Allocation
 * 
 * Determines if ventilation levels should be offset due to humidity spikes.
 */
export const checkHumidityOffset = (currentRH, targetRH, maxOffset) => {
  const rh = parseFloat(currentRH) || 60;
  const target = parseFloat(targetRH) || 60;
  const limit = parseInt(maxOffset) || 2;

  let offset = 0;
  if (rh > target) {
    offset = Math.min(limit, Math.ceil((rh - target) / 5.0));
  }

  return {
    humidityTreatmentActive: offset > 0 ? "Yes" : "No",
    requestedOffset: offset
  };
};
