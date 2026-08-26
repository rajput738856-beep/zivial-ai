/**
 * Lookup Table: Broiler Weight Curves
 * 
 * Maps growth days to target weights (kg) for different poultry breeds.
 */

export const BIRD_WEIGHT_TABLE = {
  "Cobb 500": [
    { maxAge: 2, weightKg: 0.042 },
    { maxAge: 6, weightKg: 0.180 },
    { maxAge: 9, weightKg: 0.350 },
    { maxAge: 13, weightKg: 0.480 },
    { maxAge: 20, weightKg: 0.980 },
    { maxAge: 27, weightKg: 1.650 },
    { maxAge: 34, weightKg: 2.200 },
    { maxAge: 41, weightKg: 2.850 },
    { maxAge: Infinity, weightKg: 3.100 }
  ],
  "Ross 308": [
    { maxAge: 2, weightKg: 0.040 },
    { maxAge: 6, weightKg: 0.175 },
    { maxAge: 9, weightKg: 0.340 },
    { maxAge: 13, weightKg: 0.470 },
    { maxAge: 20, weightKg: 0.960 },
    { maxAge: 27, weightKg: 1.600 },
    { maxAge: 34, weightKg: 2.150 },
    { maxAge: 41, weightKg: 2.800 },
    { maxAge: Infinity, weightKg: 3.050 }
  ],
  "Arbor Acres": [
    { maxAge: 2, weightKg: 0.041 },
    { maxAge: 6, weightKg: 0.178 },
    { maxAge: 9, weightKg: 0.345 },
    { maxAge: 13, weightKg: 0.475 },
    { maxAge: 20, weightKg: 0.970 },
    { maxAge: 27, weightKg: 1.620 },
    { maxAge: 34, weightKg: 2.180 },
    { maxAge: 41, weightKg: 2.820 },
    { maxAge: Infinity, weightKg: 3.080 }
  ],
  "Indian River": [
    { maxAge: 2, weightKg: 0.043 },
    { maxAge: 6, weightKg: 0.182 },
    { maxAge: 9, weightKg: 0.355 },
    { maxAge: 13, weightKg: 0.485 },
    { maxAge: 20, weightKg: 0.990 },
    { maxAge: 27, weightKg: 1.680 },
    { maxAge: 34, weightKg: 2.220 },
    { maxAge: 41, weightKg: 2.880 },
    { maxAge: Infinity, weightKg: 3.120 }
  ]
};
