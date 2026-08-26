/**
 * Zivial Setting Engine (ZSE) - Central Engineering Constants & Lookup Tables
 */

export const STAGE_LOOKUP = [
  { maxAge: 1, stageNum: 1, target: 34.4, heat: 32.6, cool: 34.6, alarmMin: 30, alarmMax: 38, dayRange: "1", minAirSpeed: 25, maxAirSpeed: 100 },
  { maxAge: 3, stageNum: 2, target: 32, heat: 30.4, cool: 32.2, alarmMin: 29, alarmMax: 36, dayRange: "3", minAirSpeed: 25, maxAirSpeed: 100 },
  { maxAge: 7, stageNum: 3, target: 29, heat: 27.5, cool: 29.2, alarmMin: 27, alarmMax: 35, dayRange: "7", minAirSpeed: 25, maxAirSpeed: 100 },
  { maxAge: 10, stageNum: 4, target: 28, heat: 26.5, cool: 28.2, alarmMin: 26, alarmMax: 32, dayRange: "14", minAirSpeed: 50, maxAirSpeed: 200 },
  { maxAge: 15, stageNum: 5, target: 27.2, heat: 25.3, cool: 27.4, alarmMin: 25, alarmMax: 31, dayRange: "21", minAirSpeed: 50, maxAirSpeed: 200 },
  { maxAge: 20, stageNum: 6, target: 26.6, heat: 24, cool: 26.8, alarmMin: 22, alarmMax: 30, dayRange: "28", minAirSpeed: 75, maxAirSpeed: 350 },
  { maxAge: 25, stageNum: 7, target: 25, heat: 22.5, cool: 25.2, alarmMin: 21, alarmMax: 29, dayRange: "35", minAirSpeed: 100, maxAirSpeed: 400 },
  { maxAge: 30, stageNum: 8, target: 23.9, heat: 21.5, cool: 24.1, alarmMin: 21, alarmMax: 29, dayRange: "42", minAirSpeed: 150, maxAirSpeed: 500 },
  { maxAge: 35, stageNum: 9, target: 22.2, heat: 20.5, cool: 22.4, alarmMin: 18, alarmMax: 29, dayRange: "45", minAirSpeed: 200, maxAirSpeed: 600 },
  { maxAge: 42, stageNum: 10, target: 21, heat: 19.5, cool: 21.2, alarmMin: 18, alarmMax: 28, dayRange: "46", minAirSpeed: 250, maxAirSpeed: 600 }
];

export const BROILER_GROWTH_CURVE = [
  { maxAge: 2, weightKg: 0.08 }, 
  { maxAge: 6, weightKg: 0.18 },
  { maxAge: 9, weightKg: 0.35 },
  { maxAge: 13, weightKg: 0.45 },
  { maxAge: 20, weightKg: 0.90 },
  { maxAge: 27, weightKg: 1.50 },
  { maxAge: 34, weightKg: 2.20 },
  { maxAge: 41, weightKg: 2.80 },
  { maxAge: Infinity, weightKg: 3.20 }
];

export const FAN_DATABASE = {
  "24 Inch": { size: 24, cfm: 6000, hp: 0.5, efficiencyCfmPerWatt: 12.5 },
  "36 Inch": { size: 36, cfm: 11000, hp: 0.75, efficiencyCfmPerWatt: 15.0 },
  "48 Inch": { size: 48, cfm: 20000, hp: 1.5, efficiencyCfmPerWatt: 18.5 },
  "50 Inch": { size: 50, cfm: 22000, hp: 1.5, efficiencyCfmPerWatt: 19.0 },
  "54 Inch": { size: 54, cfm: 25000, hp: 2.0, efficiencyCfmPerWatt: 20.0 },
  "60 Inch": { size: 60, cfm: 30000, hp: 2.5, efficiencyCfmPerWatt: 21.0 }
};

export const LEVEL_SCHEDULING_DEFAULTS = {
  tDeltas: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
  onTimes: [60, 60, 60, 60, 60, 200, 300, 120, 150, 100, 100, 100, 100, 100, 100, 100],
  offTimes: [450, 450, 260, 260, 240, 200, 180, 160, 140, 140, 100, 100, 100, 100, 100, 100],
  percentages: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
};

export const COOLING_CYCLE_DEFAULTS = [
  { day: 1, startTime: "10:00", stopTime: "16:00", onTime: 60, minOff: 90, maxOff: 120, offRH: 80, tDiff: 0.1 },
  { day: 1, startTime: "16:00", stopTime: "20:00", onTime: 50, minOff: 150, maxOff: 240, offRH: 80, tDiff: 0.1 },
  { day: 1, startTime: "20:00", stopTime: "06:00", onTime: 40, minOff: 240, maxOff: 360, offRH: 80, tDiff: 0.1 },
  { day: 1, startTime: "06:00", stopTime: "10:00", onTime: 35, minOff: 180, maxOff: 300, offRH: 80, tDiff: 0.1 }
];

export const CONSTANTS = { 
  AIR_DENSITY_SEA_LEVEL: 1.204, // kg/m^3
  CFM_MULTIPLIER_MIN_VENT: 0.4, // cfm per kg flock weight (cold weather/min vent)
  CFM_MULTIPLIER_MAX_VENT: 4.0, // cfm per kg flock weight (hot weather/max vent)
  AIR_EXCHANGE_COEFF: 2.7
};
