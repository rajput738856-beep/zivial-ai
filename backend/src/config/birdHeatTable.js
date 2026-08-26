/**
 * Lookup Table: Bird Heat Production
 * 
 * Maps growth days to heat output (Watts per bird) for different breeds.
 */

export const BIRD_HEAT_TABLE = {
  "Cobb 500": [
    { maxAge: 2, heatWatts: 0.8 },
    { maxAge: 6, heatWatts: 2.2 },
    { maxAge: 9, heatWatts: 3.8 },
    { maxAge: 13, heatWatts: 4.8 },
    { maxAge: 20, heatWatts: 8.5 },
    { maxAge: 27, heatWatts: 12.8 },
    { maxAge: 34, heatWatts: 15.5 },
    { maxAge: 41, heatWatts: 18.5 },
    { maxAge: Infinity, heatWatts: 20.0 }
  ],
  "Ross 308": [
    { maxAge: 2, heatWatts: 0.75 },
    { maxAge: 6, heatWatts: 2.0 },
    { maxAge: 9, heatWatts: 3.5 },
    { maxAge: 13, heatWatts: 4.5 },
    { maxAge: 20, heatWatts: 8.0 },
    { maxAge: 27, heatWatts: 12.0 },
    { maxAge: 34, heatWatts: 15.0 },
    { maxAge: 41, heatWatts: 18.0 },
    { maxAge: Infinity, heatWatts: 19.5 }
  ],
  "Arbor Acres": [
    { maxAge: 2, heatWatts: 0.78 },
    { maxAge: 6, heatWatts: 2.1 },
    { maxAge: 9, heatWatts: 3.7 },
    { maxAge: 13, heatWatts: 4.7 },
    { maxAge: 20, heatWatts: 8.3 },
    { maxAge: 27, heatWatts: 12.4 },
    { maxAge: 34, heatWatts: 15.2 },
    { maxAge: 41, heatWatts: 18.2 },
    { maxAge: Infinity, heatWatts: 19.8 }
  ],
  "Indian River": [
    { maxAge: 2, heatWatts: 0.82 },
    { maxAge: 6, heatWatts: 2.3 },
    { maxAge: 9, heatWatts: 3.9 },
    { maxAge: 13, heatWatts: 4.9 },
    { maxAge: 20, heatWatts: 8.7 },
    { maxAge: 27, heatWatts: 13.0 },
    { maxAge: 34, heatWatts: 15.8 },
    { maxAge: 41, heatWatts: 18.8 },
    { maxAge: Infinity, heatWatts: 20.2 }
  ]
};
