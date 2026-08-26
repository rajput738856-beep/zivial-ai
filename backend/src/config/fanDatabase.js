/**
 * Lookup Table: Installed Fan Database
 * 
 * Maps exhaust fan sizes to rated flow volumes, motor horsepower, and efficiency ratings.
 */

export const FAN_DATABASE = {
  "24 Inch": { size: 24, cfm: 6000, hp: 0.5, efficiencyCfmPerWatt: 12.5 },
  "36 Inch": { size: 36, cfm: 11000, hp: 0.75, efficiencyCfmPerWatt: 15.0 },
  "48 Inch": { size: 48, cfm: 20000, hp: 1.5, efficiencyCfmPerWatt: 18.5 },
  "50 Inch": { size: 50, cfm: 22000, hp: 1.5, efficiencyCfmPerWatt: 19.0 },
  "54 Inch": { size: 54, cfm: 25000, hp: 2.0, efficiencyCfmPerWatt: 20.0 },
  "60 Inch": { size: 60, cfm: 30000, hp: 2.5, efficiencyCfmPerWatt: 21.0 }
};
