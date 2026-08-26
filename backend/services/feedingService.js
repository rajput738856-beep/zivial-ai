/**
 * Service: Feeding Scheduler
 * 
 * Purpose:
 * Schedules feeder operation to optimize feed consumption.
 * Returns the default 10-row Feeding Settings.
 */

export const getFeedingSettings = (age) => {
  return [
    { day: 1, startTime: "00:00", stopTime: "23:59" },
    { day: 4, startTime: "00:00", stopTime: "23:59" },
    { day: 7, startTime: "04:30", stopTime: "23:00" },
    { day: 14, startTime: "05:00", stopTime: "22:30" },
    { day: 21, startTime: "05:00", stopTime: "22:00" },
    { day: 28, startTime: "05:30", stopTime: "21:30" },
    { day: 35, startTime: "06:00", stopTime: "21:00" },
    { day: 42, startTime: "06:00", stopTime: "20:30" },
    { day: 0, startTime: "00:00", stopTime: "00:00" },
    { day: 0, startTime: "00:00", stopTime: "00:00" }
  ];
};
