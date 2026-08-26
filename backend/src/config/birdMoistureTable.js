/**
 * Lookup Table: Bird Moisture Production
 * 
 * Maps growth days to moisture output (grams per hour per bird) for different breeds.
 */

export const BIRD_MOISTURE_TABLE = {
  "Cobb 500": [
    { maxAge: 2, moistureGHr: 0.15 },
    { maxAge: 6, moistureGHr: 0.60 },
    { maxAge: 9, moistureGHr: 1.50 },
    { maxAge: 13, moistureGHr: 2.80 },
    { maxAge: 20, moistureGHr: 4.50 },
    { maxAge: 27, moistureGHr: 6.20 },
    { maxAge: 34, moistureGHr: 7.80 },
    { maxAge: 41, moistureGHr: 8.50 },
    { maxAge: Infinity, moistureGHr: 9.00 }
  ],
  "Ross 308": [
    { maxAge: 2, moistureGHr: 0.14 },
    { maxAge: 6, moistureGHr: 0.55 },
    { maxAge: 9, moistureGHr: 1.40 },
    { maxAge: 13, moistureGHr: 2.60 },
    { maxAge: 20, moistureGHr: 4.20 },
    { maxAge: 27, moistureGHr: 5.80 },
    { maxAge: 34, moistureGHr: 7.40 },
    { maxAge: 41, moistureGHr: 8.20 },
    { maxAge: Infinity, moistureGHr: 8.80 }
  ],
  "Arbor Acres": [
    { maxAge: 2, moistureGHr: 0.15 },
    { maxAge: 6, moistureGHr: 0.58 },
    { maxAge: 9, moistureGHr: 1.45 },
    { maxAge: 13, moistureGHr: 2.70 },
    { maxAge: 20, moistureGHr: 4.40 },
    { maxAge: 27, moistureGHr: 6.00 },
    { maxAge: 34, moistureGHr: 7.60 },
    { maxAge: 41, moistureGHr: 8.40 },
    { maxAge: Infinity, moistureGHr: 8.90 }
  ],
  "Indian River": [
    { maxAge: 2, moistureGHr: 0.16 },
    { maxAge: 6, moistureGHr: 0.62 },
    { maxAge: 9, moistureGHr: 1.55 },
    { maxAge: 13, moistureGHr: 2.90 },
    { maxAge: 20, moistureGHr: 4.60 },
    { maxAge: 27, moistureGHr: 6.40 },
    { maxAge: 34, moistureGHr: 8.00 },
    { maxAge: 41, moistureGHr: 8.60 },
    { maxAge: Infinity, moistureGHr: 9.20 }
  ]
};
