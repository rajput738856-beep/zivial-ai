/**
 * Service: Lighting photoperiod setup
 * 
 * Purpose:
 * Computes light intensities and daily ON/OFF intervals.
 * Returns the default 10-row Lighting Settings.
 */

export const getLightingSettings = (age) => {
  return [
    { day: 1, startTime: "00:01", stopTime: "23:59", onMin: 55, offMin: 5, intensity: 100 },
    { day: 4, startTime: "00:01", stopTime: "23:59", onMin: 50, offMin: 10, intensity: 90 },
    { day: 7, startTime: "00:01", stopTime: "23:59", onMin: 40, offMin: 20, intensity: 80 },
    { day: 14, startTime: "00:01", stopTime: "23:59", onMin: 30, offMin: 30, intensity: 60 },
    { day: 21, startTime: "00:01", stopTime: "23:59", onMin: 25, offMin: 35, intensity: 50 },
    { day: 28, startTime: "00:01", stopTime: "23:59", onMin: 20, offMin: 40, intensity: 40 },
    { day: 35, startTime: "00:01", stopTime: "23:59", onMin: 18, offMin: 42, intensity: 20 },
    { day: 0, startTime: "00:00", stopTime: "00:00", onMin: 0, offMin: 0, intensity: 0 },
    { day: 0, startTime: "00:00", stopTime: "00:00", onMin: 0, offMin: 0, intensity: 0 },
    { day: 0, startTime: "00:00", stopTime: "00:00", onMin: 0, offMin: 0, intensity: 0 }
  ];
};
