import { allocatePositions } from "../generators/fanPositionGenerator.js";
import { allocateGroups } from "../generators/fanGroupGenerator.js";
import { allocateRelays } from "../generators/controllerMappingGenerator.js";
import { CONTROLLER_MODELS } from "../config/controllerModels.js";

/**
 * Calculator Engine: Fan Layout Generator
 * 
 * Purpose:
 * Generates physical mappings, prioritizations, and groupings for all exhaust fans.
 */
export const generateFanLayout = (farmConfig, controllerConfig, fanDb) => {
  const count = parseInt(farmConfig.fanCount) || 10;
  const size = farmConfig.fanSize || "48 Inch";
  const model = controllerConfig.model || "Z1000";

  const matchedFan = fanDb[size] || fanDb["48 Inch"];
  const cfm = matchedFan.cfm;
  const hp = matchedFan.hp;

  // Run independent generator pipelines
  const positions = allocatePositions(count);
  const groups = allocateGroups(count);
  const relays = allocateRelays(count, model, CONTROLLER_MODELS);

  const fanLayout = [];
  const continuousGroup = [];
  const timerGroup = [];
  const rotationalGroup = [];
  const reserveGroup = [];

  for (let i = 1; i <= count; i++) {
    const p = positions.find(item => item.index === i);
    const g = groups.find(item => item.index === i);
    const r = relays.find(item => item.index === i);

    const padIdx = String(i).padStart(2, "0");
    const fanId = `FAN-${padIdx}`;

    // Priority formula: Sidewall/Continuous first, then central rear tunnel
    let priority = 10 - i;
    if (i <= 2) priority = 10;

    const supportsVFD = (i === 1) && CONTROLLER_MODELS[model]?.supportsVFD;

    const fanDetail = {
      fanId,
      fanNumber: i,
      position: p.position,
      fanType: p.fanType,
      fanGroup: g.fanGroup,
      controllerOutput: r.controllerOutput,
      ratedCFM: cfm,
      fanSize: size,
      motorPower: `${hp} HP`,
      supportsVFD,
      priority
    };

    fanLayout.push(fanDetail);

    // Sort into return groups
    if (g.fanGroup === "Continuous Group") {
      continuousGroup.push(fanId);
    } else if (g.fanGroup === "Timer Group") {
      timerGroup.push(fanId);
      rotationalGroup.push(fanId); // Timer fans default to rotation group
    } else if (g.fanGroup === "Reserve Group") {
      reserveGroup.push(fanId);
    }
  }

  const vfdFan = count > 0 ? "FAN-01" : "None";

  return {
    fanLayout,
    continuousGroup,
    timerGroup,
    rotationalGroup,
    reserveGroup,
    vfdFan
  };
};
