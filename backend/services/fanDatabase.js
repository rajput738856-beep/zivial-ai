import { FAN_DATABASE } from "../config/poultryConfig.js";

/**
 * Service: Fan Database Service (Module 4)
 * 
 * Lookup Logic:
 * Match fanSize key in FAN_DATABASE.
 * 
 * Purpose:
 * Evaluates performance metrics for specific industrial fan choices. This maps exact CFM output 
 * per fan size to calculate level thresholds.
 * 
 * Inputs:
 * - fanSize (String): Fan dimension selector (e.g. "48 Inch", "36 Inch", "24 Inch", "50 Inch", "54 Inch", "60 Inch").
 * 
 * Outputs:
 * - fanDetails (Object): CFM rating, horsepower, and mechanical efficiency parameter.
 * 
 * Units:
 * - Size: Inches
 * - ratedCfm: Cubic Feet per Minute (CFM)
 * - power: Horsepower (HP)
 * - efficiency: CFM per Watt (CFM/W)
 * 
 * Engineering Assumptions:
 * - If size is omitted, defaults to a standard 48 Inch exhaust fan parameters (20,000 CFM, 1.5 HP).
 * - Fan properties are static lookup properties calibrated at 0.10" static pressure.
 */

export const getFanPerformance = (fanSize) => {
  const normalizedKey = String(fanSize || "48 Inch").trim();
  const matched = FAN_DATABASE[normalizedKey] || FAN_DATABASE["48 Inch"];

  return {
    model: normalizedKey,
    sizeInches: matched.size,
    ratedCfm: matched.cfm,
    hp: matched.hp,
    efficiencyCfmPerWatt: matched.efficiencyCfmPerWatt
  };
};
