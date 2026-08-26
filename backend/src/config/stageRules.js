/**
 * Lookup Table: Climate Stage Rules
 * 
 * Maps growth days to biological temperature targets and alarm thresholds.
 */

export const STAGE_RULES = [
  { maxAge: 2, stageNum: 1, target: 34.4, heat: 33.9, cool: 36, alarmMin: 30, alarmMax: 38 },
  { maxAge: 6, stageNum: 2, target: 32.0, heat: 31.5, cool: 34, alarmMin: 29, alarmMax: 36 },
  { maxAge: 9, stageNum: 3, target: 29.0, heat: 28.5, cool: 33, alarmMin: 28, alarmMax: 35 },
  { maxAge: 13, stageNum: 4, target: 28.0, heat: 27.5, cool: 31, alarmMin: 27, alarmMax: 32 },
  { maxAge: 20, stageNum: 5, target: 27.2, heat: 26.5, cool: 29, alarmMin: 25, alarmMax: 31 },
  { maxAge: 27, stageNum: 6, target: 26.6, heat: 23.0, cool: 28, alarmMin: 22, alarmMax: 30 },
  { maxAge: 34, stageNum: 7, target: 25.0, heat: 22.0, cool: 27, alarmMin: 21, alarmMax: 29 },
  { maxAge: 41, stageNum: 8, target: 23.9, heat: 21.0, cool: 26, alarmMin: 21, alarmMax: 29 },
  { maxAge: 44, stageNum: 9, target: 22.2, heat: 20.0, cool: 26, alarmMin: 18, alarmMax: 29 },
  { maxAge: Infinity, stageNum: 10, target: 21.0, heat: 19.0, cool: 26, alarmMin: 18, alarmMax: 28 }
];
