import { LEVEL_SCHEDULING_DEFAULTS } from "../config/poultryConfig.js";

/**
 * Service: Ventilation Level Generator
 * 
 * Formulas & Logic:
 * 1. Level CFM = CFM Min Limit + ((Level - 1) / 15) * (Total Installed CFM - CFM Min Limit)
 * 2. Fan combination arrays: Mapped symmetrically. Symmetrical side-fans middle-out for levels 1-6.
 *    Symmetrical tunnel-fans outer-in for levels 7-16.
 * 3. Fan ON/OFF times: Mapped from configured timer schedule intervals.
 * 
 * Purpose:
 * Computes 16 discrete levels of ventilation for the climate controller.
 * 
 * Inputs:
 * - cfmMinLimit (Number): CFM target for min ventilation.
 * - totalInstalledCFM (Number): Sum of all exhaust fan capacities.
 * - fanCount (Number): Total number of fans.
 * 
 * Outputs:
 * - levels (Array): 16 levels containing ON/OFF status matrices, timers, and VFD settings.
 * 
 * Units:
 * - CFM: Cubic feet per minute
 * - Timers: Seconds (s)
 * - VFD speed: Percentage (%)
 * 
 * Engineering Assumptions:
 * -Symmetrical fan placement maps to middle indexes first to ensure center-line uniform air displacement.
 * -Tunnel levels use outer-in sequences to maintain optimal pressure profiles across the pad intake.
 */

const getFanStatusesForLevel = (level, fanCount) => {
  const statuses = Array(fanCount).fill("OFF");
  
  if (fanCount === 10) {
    const map = {
      1: [5], // ON/OFF
      2: [5], // ON
      3: [4, 6], // ON
      4: [4, 5, 6], // ON
      5: [4, 5, 6, 7], // ON
      6: [4, 5, 6, 7, 8], // ON
      7: [0, 1, 2, 6, 7, 8, 9], // ON
      8: [0, 1, 2, 4, 5, 6, 8, 9], // ON
      9: { on: [0, 2, 3, 4, 5, 7, 9], cycle: [1, 8] },
      10: [0, 1, 2, 3, 4, 5, 7, 8, 9],
      11: [0, 2, 3, 4, 5, 6, 7, 9],
      12: [0, 2, 3, 4, 5, 6, 7, 8, 9],
      13: [0, 1, 2, 3, 4, 5, 6, 7, 9],
      14: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      15: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      16: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    };
    
    if (level === 9) {
      map[9].on.forEach(idx => { statuses[idx] = "ON"; });
      map[9].cycle.forEach(idx => { statuses[idx] = "ON/OFF"; });
    } else {
      const activeIdxs = map[level] || [];
      const state = (level === 1) ? "ON/OFF" : "ON";
      activeIdxs.forEach(idx => { statuses[idx] = state; });
    }
    return statuses;
  }

  // Dynamic Symmetrical Activation Fallback
  let activeON = 0;
  let activeCycle = 0;
  
  if (level === 1) {
    activeCycle = 1;
  } else if (level <= 6) {
    activeON = level - 1;
  } else {
    activeON = Math.min(fanCount, Math.round(level * (fanCount / 16)));
  }

  // Symmetrical indexes helper
  const order = [];
  const mid = Math.floor(fanCount / 2);
  let left = mid - 1;
  let right = mid;
  while (left >= 0 || right < fanCount) {
    if (right < fanCount) { order.push(right); right++; }
    if (left >= 0) { order.push(left); left--; }
  }

  for (let i = 0; i < activeON; i++) {
    if (i < order.length) statuses[order[i]] = "ON";
  }
  for (let i = activeON; i < activeON + activeCycle; i++) {
    if (i < order.length) statuses[order[i]] = "ON/OFF";
  }

  return statuses;
};

export const generateVentilationLevels = (cfmMinLimit, totalInstalledCFM, fanCount) => {
  const levels = [];
  
  for (let l = 1; l <= 16; l++) {
    const levelCFM = Math.round(cfmMinLimit + ((l - 1) / 15) * (totalInstalledCFM - cfmMinLimit));
    const tDelta = LEVEL_SCHEDULING_DEFAULTS.tDeltas[l - 1];
    const fanOn = LEVEL_SCHEDULING_DEFAULTS.onTimes[l - 1];
    const fanOff = LEVEL_SCHEDULING_DEFAULTS.offTimes[l - 1];
    const fanPct = LEVEL_SCHEDULING_DEFAULTS.percentages[l - 1];
    const fans = getFanStatusesForLevel(l, fanCount);

    levels.push({
      level: l,
      cfm: levelCFM.toLocaleString(),
      tDelta: `${tDelta}°C`,
      fanOn: String(fanOn),
      fanOff: String(fanOff),
      fanPct: `${fanPct}%`,
      fans
    });
  }

  return levels;
};
