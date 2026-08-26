/**
 * Lookup Table: Humidity Rules
 * 
 * Maps growth days to target humidity ranges, max offsets, and cycle delays.
 */

export const HUMIDITY_RULES = [
  { minAge: 0, maxAge: 14, targetRH: 60, delayMin: 10, durationMin: 3, maxOffset: 2, recoveryMin: 5 },
  { minAge: 15, maxAge: 35, targetRH: 58, delayMin: 10, durationMin: 3, maxOffset: 3, recoveryMin: 5 },
  { minAge: 36, maxAge: Infinity, targetRH: 55, delayMin: 10, durationMin: 3, maxOffset: 4, recoveryMin: 5 }
];
