/**
 * Zivial Engineering Calculation Engine (ZECE) - Controller Models
 * 
 * Defines hardware limitations and features for target controller units.
 */

export const CONTROLLER_MODELS = {
  "Z800": { maxRelays: 8, supportsVFD: false, maxAnalogOut: 0 },
  "Z1000": { maxRelays: 12, supportsVFD: true, maxAnalogOut: 2 },
  "Z1000 Pro": { maxRelays: 16, supportsVFD: true, maxAnalogOut: 4 }
};
