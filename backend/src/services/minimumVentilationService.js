import { BIRD_WEIGHT_TABLE } from "../config/birdWeightTable.js";
import { BIRD_HEAT_TABLE } from "../config/birdHeatTable.js";
import { BIRD_MOISTURE_TABLE } from "../config/birdMoistureTable.js";
import { FAN_DATABASE } from "../config/fanDatabase.js";
import { calculateMinimumVentilation } from "../calculations/minimumVentilationCalculator.js";

/**
 * Service: Minimum Ventilation Orchestration
 * 
 * Coordinates:
 * 1. Chronological Age resolution from placement date.
 * 2. Breed weight lookup (Cobb 500, Ross 308, etc.).
 * 3. Breed metabolic heat output lookup.
 * 4. Breed latent moisture emission lookup.
 * 5. Calculation engine invocation.
 */

export const getMinimumVentilationSettings = (farmConfig, placementDate, breedName, weather) => {
  const breed = breedName || "Cobb 500";
  
  // Calculate Bird Age
  let birdAge = 1;
  if (placementDate) {
    const today = new Date();
    const placement = new Date(placementDate);
    const diff = today.getTime() - placement.getTime();
    const calculated = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (!isNaN(calculated) && calculated >= 0) {
      birdAge = calculated;
    }
  }

  // Resolve Weight lookup record
  const weightProfile = BIRD_WEIGHT_TABLE[breed] || BIRD_WEIGHT_TABLE["Cobb 500"];
  const weightRecord = weightProfile.find(r => birdAge <= r.maxAge) || weightProfile[weightProfile.length - 1];
  const birdWeight = weightRecord.weightKg;

  // Resolve Heat lookup record
  const heatProfile = BIRD_HEAT_TABLE[breed] || BIRD_HEAT_TABLE["Cobb 500"];
  const heatRecord = heatProfile.find(r => birdAge <= r.maxAge) || heatProfile[heatProfile.length - 1];
  const heatProduction = heatRecord.heatWatts;

  // Resolve Moisture lookup record
  const moistureProfile = BIRD_MOISTURE_TABLE[breed] || BIRD_MOISTURE_TABLE["Cobb 500"];
  const moistureRecord = moistureProfile.find(r => birdAge <= r.maxAge) || moistureProfile[moistureProfile.length - 1];
  const moistureProduction = moistureRecord.moistureGHr;

  // Bundle parameters
  const birdData = {
    age: birdAge,
    birdCount: farmConfig.birdCount || 25000,
    weight: birdWeight,
    heat: heatProduction,
    moisture: moistureProduction
  };

  return calculateMinimumVentilation(farmConfig, birdData, weather, FAN_DATABASE);
};
