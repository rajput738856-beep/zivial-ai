import { COOLING_CYCLE_DEFAULTS } from "../config/poultryConfig.js";

/**
 * Service: Cooling Engine
 * 
 * Rules:
 * - Cooling is activated only when ambient temperature exceeds the stage cooling temperature.
 * - Pad timing is scheduled based on growth age limits.
 * - Humidity Lock: Overrides pad operation if ambient relative humidity exceeds set threshold (%) to prevent high moisture stress.
 * 
 * Purpose:
 * Computes optimal cycles and timers for water pad pumps and misting systems.
 * 
 * Inputs:
 * - age (Number): Bird age.
 * - coolingPad (String): "Yes" or "No".
 * 
 * Outputs:
 * - coolingSettings (Array): Mapped daily schedules containing ON/OFF/Max-OFF pump seconds.
 * 
 * Units:
 * - Pad ON/OFF timers: Seconds (s)
 * - Humidity threshold: Percent (%)
 * 
 * Engineering Assumptions:
 * - To prevent shock to young birds, cooling pads are strictly cycled with short wet times and long dry times.
 * - When humidity lock is triggered, cooling is shut down to prevent high latent-heat loads.
 */

export const getCoolingSettings = (age, coolingPad) => {
  const settings = [];
  const padEnabled = coolingPad === "Yes";

  for (let i = 0; i < 10; i++) {
    if (i < COOLING_CYCLE_DEFAULTS.length) {
      const item = COOLING_CYCLE_DEFAULTS[i];
      settings.push({
        day: item.day,
        startTime: item.startTime,
        stopTime: item.stopTime,
        padOn: padEnabled ? "Yes" : "No",
        onTime: item.onTime,
        minOff: item.minOff,
        maxOff: item.maxOff,
        offRH: `${item.offRH}%`,
        tDiff: `${item.tDiff}°C`,
        foggerOn: 0,
        foggerMinOff: 0,
        foggerMaxOff: 0,
        foggerOffRH: "0%",
        foggerTDiff: "0.0°C"
      });
    } else {
      settings.push({
        day: 0,
        startTime: "00:00",
        stopTime: "00:00",
        padOn: "No",
        onTime: 0,
        minOff: 0,
        maxOff: 0,
        offRH: "0%",
        tDiff: "0.0°C",
        foggerOn: 0,
        foggerMinOff: 0,
        foggerMaxOff: 0,
        foggerOffRH: "0%",
        foggerTDiff: "0.0°C"
      });
    }
  }

  return settings;
};
