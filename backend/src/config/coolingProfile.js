/**
 * Lookup Table: Cooling Profiles
 * 
 * Maps growth days to target pump parameters and humidity locks.
 */

export const COOLING_PROFILE = [
  { minAge: 0, maxAge: 6, enabled: false, startDay: 7, pumpOnSec: 20, minOffSec: 600, maxOffSec: 600, offRH: 60, tDiff: 0.5 },
  { minAge: 7, maxAge: 13, enabled: true, startDay: 7, pumpOnSec: 45, minOffSec: 600, maxOffSec: 600, offRH: 65, tDiff: 0.6 },
  { minAge: 14, maxAge: 20, enabled: true, startDay: 7, pumpOnSec: 90, minOffSec: 450, maxOffSec: 450, offRH: 70, tDiff: 0.6 },
  { minAge: 21, maxAge: 34, enabled: true, startDay: 7, pumpOnSec: 60, minOffSec: 30, maxOffSec: 120, offRH: 80, tDiff: 0.5 },
  { minAge: 35, maxAge: Infinity, enabled: true, startDay: 7, pumpOnSec: 90, minOffSec: 120, maxOffSec: 350, offRH: 80, tDiff: 0.5 }
];
