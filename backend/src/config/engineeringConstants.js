/**
 * Zivial Engineering Calculation Engine (ZECE) - Engineering Constants
 * 
 * Central constants for air density, moisture ratios, and ventilation duty cycle scales.
 */

export const ENGINEERING_CONSTANTS = {
  STANDARD_AIR_DENSITY: 1.204, // kg/m^3 at sea level
  BIOMASS_CFM_COEFF: 0.4,       // CFM per kg flock weight (minimum ventilation)
  TIMER_CYCLE_DURATION: 300,   // standard 5-minute cycle (seconds)
  MIN_MOTOR_ON_TIME: 15,       // safe minimum run duration (seconds)
  HP_TO_KW_COEFF: 0.7457       // kW per horsepower
};
