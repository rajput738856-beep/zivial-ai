/**
 * Logic: Lighting Schedules
 * 
 * Maps growth days to target lux and dark hour requirements.
 */
export const checkLightingSchedule = (birdAge) => {
  const age = parseInt(birdAge) || 1;

  let photoperiodHours = 23;
  let luxIntensity = 20;

  if (age > 7 && age <= 21) {
    photoperiodHours = 18;
    luxIntensity = 10;
  } else if (age > 21) {
    photoperiodHours = 20;
    luxIntensity = 5;
  }

  const darkHours = 24 - photoperiodHours;

  return {
    photoperiodHours,
    darkHours,
    luxIntensity,
    scheduleDescription: `${photoperiodHours}H Light, ${darkHours}H Dark at ${luxIntensity} Lux`
  };
};
