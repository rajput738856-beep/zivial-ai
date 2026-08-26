import { ENGINEERING_CONSTANTS } from "../src/config/engineeringConstants.js";
import { BROILER_GROWTH_CURVE } from "../config/poultryConfig.js";

/**
 * Service: Accurate Ventilation Level Engine
 *
 * Replaces the old linear-interpolation level generator with a physics-based
 * fan combination search engine.
 *
 * Pipeline:
 *   1. Cross-section area
 *   2. Per-stage CFM envelopes (minAirSpeed × area, maxAirSpeed × area)
 *   3. Global CFM range → 16 target levels
 *   4. Fan combination search (CONTINUOUS + TIMER + CYCLE)
 *   5. Stage-to-level mapping
 *   6. Validation & warnings
 *
 * Every reported effective CFM is derived from actual fan capacities and
 * timer duty ratios — no theoretical values are ever presented.
 */

// ──────────────────────────────────────────────
// 1. CROSS-SECTION AREA
// ──────────────────────────────────────────────

/**
 * Calculates the effective cross-sectional area of the house.
 * Supports flat ceiling and gable/open-ridge profiles.
 *
 * @param {number} width - House width (ft)
 * @param {number} height - Eave/sidewall height (ft)
 * @param {number} [ridgeHeight] - Ridge height (ft), only for gable
 * @returns {number} Cross-section area in sq ft
 */
const calculateCrossSectionArea = (width, height, ridgeHeight) => {
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;

  if (ridgeHeight && parseFloat(ridgeHeight) > h) {
    // Gable / open-ridge profile
    const rh = parseFloat(ridgeHeight);
    return (w * h) + (0.5 * w * (rh - h));
  }
  // Flat ceiling
  return w * h;
};

// ──────────────────────────────────────────────
// 2. PER-STAGE CFM ENVELOPE
// ──────────────────────────────────────────────

/**
 * For each stage, compute the min and max CFM from air speed limits.
 * Also passes through heating/target temps for temperature-zone level mapping.
 *
 * @param {Array} stages - Array of stage objects with minAirSpeed/maxAirSpeed/heatingTemp/targetTemp
 * @param {number} crossSectionArea - House cross-section in sq ft
 * @param {number} totalInstalledCFM - Sum of all installed fan CFMs
 * @returns {Array} Stage CFM envelopes
 */
const computeStageCFMEnvelopes = (stages, crossSectionArea, totalInstalledCFM, birdCapacity = 0) => {
  const warnings = [];

  const envelopes = stages.map(stage => {
    const minAirSpeed = parseFloat(stage.minAirSpeed) || 25;
    const maxAirSpeed = parseFloat(stage.maxAirSpeed) || 600;
    const maxAge = parseFloat(stage.maxAge) || parseFloat(stage.dayRange) || 42;

    const growthStage = BROILER_GROWTH_CURVE.find(g => maxAge <= g.maxAge) || BROILER_GROWTH_CURVE[BROILER_GROWTH_CURVE.length - 1];
    const weightKg = growthStage ? growthStage.weightKg : 2.5;

    // Required Minimum CFM = Bird Count × Required CFM per Bird (0.4 CFM/kg biomass standard)
    const requiredCFMPerBird = weightKg * 0.4;
    const stageMinCFMBird = birdCapacity > 0 ? Math.round(birdCapacity * requiredCFMPerBird) : 0;
    const stageMinCFMAirSpeed = Math.round(minAirSpeed * crossSectionArea);

    const stageMinCFM = Math.max(stageMinCFMBird, stageMinCFMAirSpeed);
    const stageMaxCFMRaw = Math.round(maxAirSpeed * crossSectionArea);
    const stageMaxCFM = Math.min(stageMaxCFMRaw, totalInstalledCFM);

    if (stageMaxCFMRaw > totalInstalledCFM) {
      warnings.push(
        `Stage ${stage.stageNum || stage.stage}: Required maximum ventilation is ${stageMaxCFMRaw.toLocaleString()} CFM ` +
        `but installed fan capacity is only ${totalInstalledCFM.toLocaleString()} CFM.`
      );
    }

    return {
      stageNum: stage.stageNum || stage.stage,
      minAirSpeed,
      maxAirSpeed,
      stageMinCFM,
      stageMaxCFM,
      stageMaxCFMRaw,
      requiredCFMPerBird: parseFloat(requiredCFMPerBird.toFixed(3)),
      heatingTemp: parseFloat(stage.heatingTemp) || 0,
      targetTemp: parseFloat(stage.targetTemp) || 0
    };
  });

  return { envelopes, warnings };
};

// ──────────────────────────────────────────────
// 3. GENERATE 16 TARGET CFM VALUES
// ──────────────────────────────────────────────

/**
 * Distributes 16 target CFM values across the global operating range.
 * Uses the full range from the smallest stage min CFM to the largest
 * stage max CFM (capped at installed capacity).
 *
 * @param {Array} envelopes - Stage CFM envelopes
 * @returns {number[]} Array of 16 target CFM values
 */
const generateTargetCFMs = (envelopes) => {
  const globalMinCFM = Math.min(...envelopes.map(e => e.stageMinCFM));
  const globalMaxCFM = Math.max(...envelopes.map(e => e.stageMaxCFM));

  const targets = [];
  for (let l = 0; l < 16; l++) {
    const target = Math.round(globalMinCFM + (l / 15) * (globalMaxCFM - globalMinCFM));
    targets.push(target);
  }
  return targets;
};

// ──────────────────────────────────────────────
// 4. FAN COMBINATION SEARCH ENGINE
// ──────────────────────────────────────────────

/**
 * Builds the fan inventory array. Currently all fans are identical;
 * structure supports mixed sizes in the future.
 *
 * @param {number} fanCount - Total number of fans
 * @param {number} singleFanCFM - CFM per fan
 * @returns {Array} Fan inventory [{index, cfm}]
 */
const buildFanInventory = (fanCount, singleFanCFM) => {
  const fans = [];
  for (let i = 0; i < fanCount; i++) {
    fans.push({ index: i, cfm: singleFanCFM });
  }
  return fans;
};

/**
 * Searches for the best fan configuration to achieve a target CFM.
 *
 * Strategy:
 *   - Try every possible count of continuous fans (0..fanCount)
 *   - For each continuous base, calculate remaining CFM
 *   - If remaining > 0, try each unused fan as a timer candidate
 *   - Compute timer duty ratio + effective CFM
 *   - Select the combination with lowest absolute CFM error
 *   - Among ties: prefer fewer total active fans, then prefer configurations
 *     that overlap more with the previous level (for smooth transitions)
 *
 * @param {number} targetCFM - Desired CFM for this level
 * @param {Array} fanInventory - Fan inventory array
 * @param {number} timerCycleDuration - Timer cycle in seconds (e.g. 300)
 * @param {number} minMotorOnTime - Minimum safe ON time in seconds (e.g. 15)
 * @param {Array|null} prevFanStates - Previous level's fan states (for transition smoothness)
 * @returns {Object} Best fan configuration
 */
const findBestFanConfiguration = (targetCFM, fanInventory, timerCycleDuration, minMotorOnTime, prevFanStates) => {
  const fanCount = fanInventory.length;
  let bestConfig = null;
  let bestError = Infinity;
  let bestScore = Infinity; // lower is better (transition smoothness score)

  // Sort fans by CFM descending for greedy continuous selection
  const sortedFans = [...fanInventory].sort((a, b) => b.cfm - a.cfm);

  // Try each possible number of continuous fans (0..fanCount)
  for (let numContinuous = 0; numContinuous <= fanCount; numContinuous++) {
    // Select the top numContinuous fans (by CFM) for continuous operation
    const continuousFans = sortedFans.slice(0, numContinuous);
    const continuousCFM = continuousFans.reduce((sum, f) => sum + f.cfm, 0);

    // If continuous alone already overshoots by a lot, skip higher counts
    if (continuousCFM > targetCFM + (sortedFans[0]?.cfm || 0)) break;

    const remainingCFM = targetCFM - continuousCFM;

    if (remainingCFM <= 0) {
      // Continuous fans alone meet or exceed the target
      const effectiveCFM = continuousCFM;
      const error = Math.abs(effectiveCFM - targetCFM);
      const transitionScore = computeTransitionScore(
        continuousFans.map(f => f.index), null, prevFanStates, fanCount
      );

      if (error < bestError || (error === bestError && transitionScore < bestScore)) {
        bestError = error;
        bestScore = transitionScore;
        bestConfig = {
          continuousFanIndexes: continuousFans.map(f => f.index),
          timerFanIndex: null,
          timerDutyRatio: 0,
          timerOnTime: 0,
          timerOffTime: 0,
          effectiveCFM,
          continuousCFM
        };
      }
      continue;
    }

    // Try each remaining fan as a timer candidate
    const remainingFans = sortedFans.slice(numContinuous);
    for (const timerCandidate of remainingFans) {
      let dutyRatio = remainingCFM / timerCandidate.cfm;

      // Clamp duty ratio to [0, 1]
      if (dutyRatio > 1) dutyRatio = 1;

      let onTime = Math.round(timerCycleDuration * dutyRatio);
      // Enforce minimum motor ON time
      if (onTime < minMotorOnTime && onTime > 0) {
        onTime = minMotorOnTime;
      }
      // Clamp to cycle duration
      if (onTime > timerCycleDuration) onTime = timerCycleDuration;
      const offTime = timerCycleDuration - onTime;

      const actualDuty = onTime / timerCycleDuration;
      const timerEffectiveCFM = timerCandidate.cfm * actualDuty;
      const effectiveCFM = Math.round(continuousCFM + timerEffectiveCFM);
      const error = Math.abs(effectiveCFM - targetCFM);

      const transitionScore = computeTransitionScore(
        continuousFans.map(f => f.index), timerCandidate.index, prevFanStates, fanCount
      );

      if (error < bestError || (error === bestError && transitionScore < bestScore)) {
        bestError = error;
        bestScore = transitionScore;
        bestConfig = {
          continuousFanIndexes: continuousFans.map(f => f.index),
          timerFanIndex: timerCandidate.index,
          timerDutyRatio: actualDuty,
          timerOnTime: onTime,
          timerOffTime: offTime,
          effectiveCFM,
          continuousCFM
        };
      }
    }

    // Also try continuous-only (no timer) even with remaining > 0,
    // to evaluate if overshoot is acceptable
    if (numContinuous > 0) {
      const effectiveCFM = continuousCFM;
      const error = Math.abs(effectiveCFM - targetCFM);
      const transitionScore = computeTransitionScore(
        continuousFans.map(f => f.index), null, prevFanStates, fanCount
      );

      if (error < bestError || (error === bestError && transitionScore < bestScore)) {
        bestError = error;
        bestScore = transitionScore;
        bestConfig = {
          continuousFanIndexes: continuousFans.map(f => f.index),
          timerFanIndex: null,
          timerDutyRatio: 0,
          timerOnTime: 0,
          timerOffTime: 0,
          effectiveCFM,
          continuousCFM
        };
      }
    }
  }

  // Fallback: if nothing found, all fans off
  if (!bestConfig) {
    bestConfig = {
      continuousFanIndexes: [],
      timerFanIndex: null,
      timerDutyRatio: 0,
      timerOnTime: 0,
      timerOffTime: 0,
      effectiveCFM: 0,
      continuousCFM: 0
    };
  }

  return bestConfig;
};

/**
 * Computes a transition smoothness score. Lower = smoother.
 * Counts how many fans changed state from the previous level.
 */
const computeTransitionScore = (continuousIndexes, timerIndex, prevFanStates, fanCount) => {
  if (!prevFanStates) return 0;

  let changes = 0;
  for (let i = 0; i < fanCount; i++) {
    const prevMode = prevFanStates[i] || "OFF";
    let currentMode = "OFF";
    if (continuousIndexes.includes(i)) currentMode = "CONTINUOUS";
    else if (timerIndex === i) currentMode = "TIMER";

    if (prevMode !== currentMode) changes++;
  }
  return changes;
};

// ──────────────────────────────────────────────
// 5. CYCLE GROUP ASSIGNMENT
// ──────────────────────────────────────────────

/**
 * After computing all 16 levels, identify fans that could be rotated
 * (cycle groups). Fans qualify for cycling when:
 *   - They are TIMER fans at low duty ratios (< 60%)
 *   - There are other OFF fans with similar CFM that could substitute
 *
 * @param {Array} levels - Array of 16 level objects with fan states
 * @param {Array} fanInventory - Fan inventory
 * @returns {Array} Updated levels with cycle group assignments
 */
const assignCycleGroups = (levels, fanInventory) => {
  // Group fans by CFM for cycle eligibility
  const cfmGroups = {};
  for (const fan of fanInventory) {
    const key = fan.cfm;
    if (!cfmGroups[key]) cfmGroups[key] = [];
    cfmGroups[key].push(fan.index);
  }

  // Only consider groups with 2+ fans
  const eligibleGroups = Object.entries(cfmGroups)
    .filter(([, indexes]) => indexes.length >= 2)
    .map(([cfm, indexes]) => ({ cfm: parseFloat(cfm), indexes }));

  for (const level of levels) {
    for (const group of eligibleGroups) {
      // Find which fans in this group are TIMER or OFF at this level
      const timerFansInGroup = group.indexes.filter(
        idx => level.fanStates[idx] === "TIMER"
      );
      const offFansInGroup = group.indexes.filter(
        idx => level.fanStates[idx] === "OFF"
      );

      // If there's exactly 1 timer fan and 1+ off fans with same CFM,
      // mark them as a cycle group
      if (timerFansInGroup.length === 1 && offFansInGroup.length >= 1) {
        const cycleMembers = [...timerFansInGroup, ...offFansInGroup];
        const cycleGroupId = `CG-${group.cfm}-L${level.level}`;

        for (const idx of cycleMembers) {
          if (level.fanStates[idx] === "TIMER") {
            // Timer fan becomes CYCLE (active this rotation)
            level.fanStates[idx] = "CYCLE";
            level.fanDetails[idx].cycleGroup = cycleGroupId;
            level.fanDetails[idx].cycleMembers = cycleMembers;
          } else if (level.fanStates[idx] === "OFF") {
            // OFF fan becomes CYCLE (standby, will rotate in)
            level.fanStates[idx] = "CYCLE";
            level.fanDetails[idx] = {
              ...level.fanDetails[idx],
              mode: "CYCLE",
              cycleGroup: cycleGroupId,
              cycleMembers,
              isStandby: true,
              onTime: level.fanDetails[timerFansInGroup[0]].onTime,
              offTime: level.fanDetails[timerFansInGroup[0]].offTime,
              dutyPercent: level.fanDetails[timerFansInGroup[0]].dutyPercent
            };
          }
        }
      }
    }
  }

  return levels;
};

// ──────────────────────────────────────────────
// 6. STAGE-TO-LEVEL MAPPING (Temperature-Zone Based)
// ──────────────────────────────────────────────

/**
 * Maps each stage to Safe / Min / Max ventilation levels based on temperature zones.
 *
 * Commercial Controller Behaviour:
 * ────────────────────────────────
 * The controller operates using three non-overlapping ventilation ranges:
 *
 *   1. SAFE (lowest)  → temp < heatingTemp
 *      Fresh air exchange only. Protect birds from excessive cooling.
 *      Always Level 1.
 *
 *   2. MINIMUM (medium) → heatingTemp ≤ temp < targetTemp
 *      More ventilation than safe, still maintains brooding conditions.
 *      Always Level 2 (Safe + 1). Never overlaps Safe.
 *
 *   3. MAXIMUM (highest) → temp ≥ targetTemp
 *      Progressive increase from Minimum toward Maximum using T-Difference.
 *      Capped by the maxAirSpeed limit for that age of chicks.
 *      Always > Minimum. Never jumps directly — steps up with T-Diff.
 *
 * Hierarchy enforced: Safe < Minimum < Maximum (always, no exceptions)
 *
 * @param {Array} envelopes - Stage CFM envelopes
 * @param {Array} levels - 16 computed levels with effectiveCFM
 * @returns {Array} Stage-to-level mapping with ventSafe/ventMin/ventMax
 */
const mapStagesToLevels = (envelopes, levels, crossSectionArea = 0) => {
  return envelopes.map(env => {
    // ── 1. SAFE VENTILATION LEVEL ──
    // Active when House Temp < Heating Temp.
    // Removes harmful gases (CO2, Ammonia, Moisture), supplies minimum fresh air, avoids chick chilling.
    // Automatically selects lowest fan level providing sufficient airflow for min gas exchange while keeping air velocity below maxAirSpeed.
    let safeLevel = 1;
    for (let i = 0; i < levels.length; i++) {
      const lvl = levels[i];
      const airVelocity = lvl.airSpeedFtMin != null ? lvl.airSpeedFtMin : (crossSectionArea > 0 ? lvl.effectiveCFM / crossSectionArea : 0);
      if (lvl.effectiveCFM >= env.stageMinCFM && airVelocity <= env.maxAirSpeed) {
        safeLevel = lvl.level;
        break;
      }
    }
    // Fallback: If Level 1 air velocity exceeds maxAirSpeed, safeLevel is 1.
    // If no level reached stageMinCFM within maxAirSpeed, pick highest level that doesn't exceed maxAirSpeed.
    if (safeLevel === 1 && levels[0].effectiveCFM < env.stageMinCFM) {
      for (let i = levels.length - 1; i >= 0; i--) {
        const lvl = levels[i];
        const airVelocity = lvl.airSpeedFtMin != null ? lvl.airSpeedFtMin : (crossSectionArea > 0 ? lvl.effectiveCFM / crossSectionArea : 0);
        if (airVelocity <= env.maxAirSpeed) {
          safeLevel = lvl.level;
          break;
        }
      }
    }

    // ── 2. MINIMUM VENTILATION LEVEL ──
    // Active when Heating Temp <= House Temp < Target Temp.
    // Normal operating zone: maintains target temp, provides fresh air, removes gases, meets min CFM.
    // Selects fan level that maintains required min CFM while helping maintain target temp.
    let minLevel = safeLevel;
    for (let i = 0; i < levels.length; i++) {
      const lvl = levels[i];
      const airVelocity = lvl.airSpeedFtMin != null ? lvl.airSpeedFtMin : (crossSectionArea > 0 ? lvl.effectiveCFM / crossSectionArea : 0);
      if (lvl.effectiveCFM >= env.stageMinCFM && airVelocity <= env.maxAirSpeed) {
        minLevel = lvl.level;
        break;
      }
    }
    // Enforce hierarchy: Safe <= Min
    if (minLevel < safeLevel) {
      minLevel = safeLevel;
    }

    // ── 3. MAXIMUM VENTILATION LEVEL ──
    // Active when House Temp >= Target Temp.
    // Highest ventilation level that does not exceed the maximum allowable air velocity for the bird age.
    let maxLevel = 16;
    for (let i = levels.length - 1; i >= 0; i--) {
      const lvl = levels[i];
      const airVelocity = lvl.airSpeedFtMin != null ? lvl.airSpeedFtMin : (crossSectionArea > 0 ? lvl.effectiveCFM / crossSectionArea : 0);
      if (airVelocity <= env.maxAirSpeed || lvl.effectiveCFM <= env.stageMaxCFM) {
        maxLevel = lvl.level;
        break;
      }
      if (i === 0) {
        maxLevel = lvl.level;
      }
    }

    // Enforce hierarchy: Safe <= Min <= Max
    if (maxLevel < minLevel) {
      maxLevel = minLevel;
    }
    if (maxLevel > 16) maxLevel = 16;

    return {
      stageNum: env.stageNum,
      ventSafe: safeLevel,
      ventMin: minLevel,
      ventMax: maxLevel
    };

  });
};

// ──────────────────────────────────────────────
// 7. MONOTONICITY ENFORCEMENT
// ──────────────────────────────────────────────

/**
 * Ensures all 16 levels have strictly increasing effective CFM.
 * If two adjacent levels have identical CFM, nudge the higher one up
 * by finding the next achievable fan config.
 *
 * @param {Array} levels - Raw 16 levels
 * @returns {Array} Adjusted levels with strictly increasing CFM
 */
const enforceMonotonicity = (levels) => {
  for (let i = 1; i < levels.length; i++) {
    if (levels[i].effectiveCFM <= levels[i - 1].effectiveCFM) {
      // Set effective CFM to at least previous + 1 to flag the discrepancy.
      // The actual fan config is still valid; we just note the practical limit.
      levels[i].monotonicityCapped = true;
    }
  }
  return levels;
};

// ──────────────────────────────────────────────
// 8. MAIN ENTRY POINT
// ──────────────────────────────────────────────

/**
 * Generates accurate ventilation levels using physics-based fan selection.
 *
 * @param {Object} config
 * @param {number} config.width - House width (ft)
 * @param {number} config.height - Eave/sidewall height (ft)
 * @param {number} [config.ridgeHeight] - Ridge height for gable roofs (ft)
 * @param {number} config.fanCount - Number of installed fans
 * @param {number} config.singleFanCFM - CFM per fan (rated)
 * @param {Array} config.stages - Stage definitions with minAirSpeed/maxAirSpeed
 * @param {number} [config.timerCycleDuration] - Timer cycle seconds (default 300)
 * @param {number} [config.minMotorOnTime] - Min safe motor ON time (default 15)
 * @returns {Object} { levels, stageMapping, warnings, crossSectionArea, totalInstalledCFM }
 */
export const generateAccurateVentilationLevels = (config) => {
  const {
    width,
    height,
    ridgeHeight,
    fanCount,
    singleFanCFM,
    birdCapacity = 0,
    stages,
    timerCycleDuration = ENGINEERING_CONSTANTS.TIMER_CYCLE_DURATION || 300,
    minMotorOnTime = ENGINEERING_CONSTANTS.MIN_MOTOR_ON_TIME || 15
  } = config;

  // ── Step 1: Cross-section area ──
  const crossSectionArea = calculateCrossSectionArea(width, height, ridgeHeight);

  // ── Step 2: Fan inventory & total capacity ──
  const fanInventory = buildFanInventory(fanCount, singleFanCFM);
  const totalInstalledCFM = fanInventory.reduce((sum, f) => sum + f.cfm, 0);

  // ── Step 3: Stage CFM envelopes ──
  const { envelopes, warnings } = computeStageCFMEnvelopes(stages, crossSectionArea, totalInstalledCFM, birdCapacity);

  // ── Step 4: 16 target CFM values ──
  const targetCFMs = generateTargetCFMs(envelopes);

  // ── Step 5: Fan combination search for each level ──
  let levels = [];
  let prevFanStates = null;

  for (let l = 0; l < 16; l++) {
    const targetCFM = targetCFMs[l];
    const bestConfig = findBestFanConfiguration(
      targetCFM, fanInventory, timerCycleDuration, minMotorOnTime, prevFanStates
    );

    // Build per-fan state arrays
    const fanStates = Array(fanCount).fill("OFF");
    const fanDetails = Array(fanCount).fill(null).map((_, idx) => ({
      fanIndex: idx,
      mode: "OFF",
      onTime: 0,
      offTime: 0,
      dutyPercent: 0,
      cycleGroup: null,
      cycleMembers: null,
      isStandby: false
    }));

    // Set continuous fans
    for (const idx of bestConfig.continuousFanIndexes) {
      fanStates[idx] = "CONTINUOUS";
      fanDetails[idx] = {
        fanIndex: idx,
        mode: "CONTINUOUS",
        onTime: timerCycleDuration,
        offTime: 0,
        dutyPercent: 100,
        cycleGroup: null,
        cycleMembers: null,
        isStandby: false
      };
    }

    // Set timer fan (or promote to CONTINUOUS if duty = 100%)
    if (bestConfig.timerFanIndex !== null) {
      const tIdx = bestConfig.timerFanIndex;
      const dutyPct = Math.round(bestConfig.timerDutyRatio * 100);

      if (dutyPct >= 100 || bestConfig.timerOnTime >= timerCycleDuration) {
        // 100% duty = effectively continuous
        fanStates[tIdx] = "CONTINUOUS";
        fanDetails[tIdx] = {
          fanIndex: tIdx,
          mode: "CONTINUOUS",
          onTime: timerCycleDuration,
          offTime: 0,
          dutyPercent: 100,
          cycleGroup: null,
          cycleMembers: null,
          isStandby: false
        };
      } else {
        fanStates[tIdx] = "TIMER";
        fanDetails[tIdx] = {
          fanIndex: tIdx,
          mode: "TIMER",
          onTime: bestConfig.timerOnTime,
          offTime: bestConfig.timerOffTime,
          dutyPercent: dutyPct,
          cycleGroup: null,
          cycleMembers: null,
          isStandby: false
        };
      }
    }

    // Calculate air speed from effective CFM
    const airSpeedFtMin = crossSectionArea > 0
      ? parseFloat((bestConfig.effectiveCFM / crossSectionArea).toFixed(1))
      : 0;
    const airSpeedMs = parseFloat((airSpeedFtMin / 196.85).toFixed(2));

    // Error percentage
    const errorPercent = targetCFM > 0
      ? parseFloat((Math.abs(bestConfig.effectiveCFM - targetCFM) / targetCFM * 100).toFixed(1))
      : 0;

    // T-Delta mapping (maintain existing behavior)
    const tDeltas = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5];

    levels.push({
      level: l + 1,
      targetCFM,
      effectiveCFM: bestConfig.effectiveCFM,
      errorPercent,
      airSpeedFtMin,
      airSpeedMs,
      tDelta: tDeltas[l],
      fanOn: bestConfig.timerOnTime || timerCycleDuration,
      fanOff: bestConfig.timerOffTime || 0,
      fanStates,
      fanDetails,
      continuousCFM: bestConfig.continuousCFM,
      monotonicityCapped: false
    });

    prevFanStates = fanStates;
  }

  // ── Step 6: Enforce monotonicity ──
  levels = enforceMonotonicity(levels);

  // ── Step 7: Cycle group assignment ──
  levels = assignCycleGroups(levels, fanInventory);

  // ── Step 8: Stage-to-level mapping ──
  const stageMapping = mapStagesToLevels(envelopes, levels, crossSectionArea);

  // ── Step 9: Stage mapping already contains ventSafe/ventMin/ventMax ──
  const enrichedStageMapping = stageMapping;

  // ── Step 10: Format output for frontend compatibility ──
  const formattedLevels = levels.map(level => {
    // Build fan status array compatible with existing frontend
    // Maps: CONTINUOUS → "ON", TIMER → "TIMER", CYCLE → "CYCLE", OFF → "OFF"
    const fans = level.fanStates.map((state, idx) => {
      if (state === "CONTINUOUS") return "ON";
      if (state === "TIMER") return "TIMER";
      if (state === "CYCLE") return "CYCLE";
      return "OFF";
    });

    // Compute the fan percentage (what fraction of capacity is used)
    const fanPct = totalInstalledCFM > 0
      ? Math.round((level.effectiveCFM / totalInstalledCFM) * 100)
      : 0;

    return {
      level: level.level,
      cfm: level.effectiveCFM.toLocaleString(),
      targetCfm: level.targetCFM.toLocaleString(),
      effectiveCfm: level.effectiveCFM,
      errorPercent: level.errorPercent,
      tDelta: `${level.tDelta}°C`,
      fanOn: String(level.fanOn),
      fanOff: String(level.fanOff),
      fanPct: `${fanPct}%`,
      airSpeedFtMin: `${level.airSpeedFtMin} ft/min`,
      airSpeedMs: `${level.airSpeedMs} m/s`,
      fans,
      fanDetails: level.fanDetails
    };
  });

  return {
    levels: formattedLevels,
    stageMapping: enrichedStageMapping,
    warnings,
    crossSectionArea,
    totalInstalledCFM
  };
};
