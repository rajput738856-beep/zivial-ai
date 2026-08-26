/**
 * Service: Bird Age Calculator (Module 1)
 * 
 * Formula:
 * Age (days) = (Current Date - Placement Date) in milliseconds / milliseconds per day
 * 
 * Purpose:
 * Computes chronological bird age in days. Bird age is the core variable driving 
 * biological stage configurations, feed intakes, flock weight estimation, and minimum ventilation limits.
 * 
 * Inputs:
 * - placementDate (String / Date): Placement date when day-old chicks arrived at the farm.
 * 
 * Outputs:
 * - birdAge (Number): Age of the flock in days. Minimum return value is 1.
 * 
 * Units:
 * - Date inputs: UTC or Local date strings.
 * - Return value: Days (Integer).
 * 
 * Engineering Assumptions:
 * - If placementDate is not supplied or falls in the future, defaults to day 1 (flock placement day).
 * - Partial days are truncated (floored) to represent completed growth days.
 */

export const calculateBirdAge = (placementDate) => {
  if (!placementDate) {
    return 1;
  }
  
  const today = new Date();
  const placement = new Date(placementDate);
  const diffTime = today.getTime() - placement.getTime();
  const calculatedAge = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (isNaN(calculatedAge) || calculatedAge < 0) {
    return 1;
  }
  
  return calculatedAge;
};
