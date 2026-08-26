/**
 * Zivial Engineering Calculation Engine (ZECE) - Breed Profiles
 * 
 * Maps growth curves and stage heat production ratings for different broiler breeds.
 */

export const BREED_PROFILES = {
  "Cobb 500": [
    { maxAge: 2, weightKg: 0.042, heatWatts: 0.8 },
    { maxAge: 6, weightKg: 0.180, heatWatts: 2.2 },
    { maxAge: 9, weightKg: 0.350, heatWatts: 3.8 },
    { maxAge: 13, weightKg: 0.480, heatWatts: 4.8 },
    { maxAge: 20, weightKg: 0.980, heatWatts: 8.5 },
    { maxAge: 27, weightKg: 1.650, heatWatts: 12.8 },
    { maxAge: 34, weightKg: 2.200, heatWatts: 15.5 },
    { maxAge: 41, weightKg: 2.850, heatWatts: 18.5 },
    { maxAge: Infinity, weightKg: 3.100, heatWatts: 20.0 }
  ],
  "Ross 308": [
    { maxAge: 2, weightKg: 0.040, heatWatts: 0.75 },
    { maxAge: 6, weightKg: 0.175, heatWatts: 2.0 },
    { maxAge: 9, weightKg: 0.340, heatWatts: 3.5 },
    { maxAge: 13, weightKg: 0.470, heatWatts: 4.5 },
    { maxAge: 20, weightKg: 0.960, heatWatts: 8.0 },
    { maxAge: 27, weightKg: 1.600, heatWatts: 12.0 },
    { maxAge: 34, weightKg: 2.150, heatWatts: 15.0 },
    { maxAge: 41, weightKg: 2.800, heatWatts: 18.0 },
    { maxAge: Infinity, weightKg: 3.050, heatWatts: 19.5 }
  ],
  "Arbor Acres": [
    { maxAge: 2, weightKg: 0.041, heatWatts: 0.78 },
    { maxAge: 6, weightKg: 0.178, heatWatts: 2.1 },
    { maxAge: 9, weightKg: 0.345, heatWatts: 3.7 },
    { maxAge: 13, weightKg: 0.475, heatWatts: 4.7 },
    { maxAge: 20, weightKg: 0.970, heatWatts: 8.3 },
    { maxAge: 27, weightKg: 1.620, heatWatts: 12.4 },
    { maxAge: 34, weightKg: 2.180, heatWatts: 15.2 },
    { maxAge: 41, weightKg: 2.820, heatWatts: 18.2 },
    { maxAge: Infinity, weightKg: 3.080, heatWatts: 19.8 }
  ],
  "Indian River": [
    { maxAge: 2, weightKg: 0.043, heatWatts: 0.82 },
    { maxAge: 6, weightKg: 0.182, heatWatts: 2.3 },
    { maxAge: 9, weightKg: 0.355, heatWatts: 3.9 },
    { maxAge: 13, weightKg: 0.485, heatWatts: 4.9 },
    { maxAge: 20, weightKg: 0.990, heatWatts: 8.7 },
    { maxAge: 27, weightKg: 1.680, heatWatts: 13.0 },
    { maxAge: 34, weightKg: 2.220, heatWatts: 15.8 },
    { maxAge: 41, weightKg: 2.880, heatWatts: 18.8 },
    { maxAge: Infinity, weightKg: 3.120, heatWatts: 20.2 }
  ]
};
