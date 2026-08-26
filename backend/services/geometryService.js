
/**
 * Service: Farm Geometry Engine (Module 3)
 * 
 * Formulas:
 * Floor Area (sq.ft) = Length (ft) * Width (ft)
 * Building Volume (cu.ft) = Length (ft) * Width (ft) * Height (ft)
 * Bird Density (birds/sq.ft) = Bird Count / Floor Area (sq.ft)
 * Birds per Square Meter (birds/m^2) = Bird Density (birds/sq.ft) / 0.092903
 * 
 * Purpose:
 * Analyzes physical shed dimensions to evaluate floor space capacity, ventilation air change 
 * volumes, and structural density thresholds.
 * 
 * Inputs:
 * - length (Number): Shed length in feet.
 * - width (Number): Shed width in feet.
 * - height (Number): Average shed height in feet.
 * - birdCount (Number): Number of birds inside the house.
 * 
 * Outputs:
 * - geometryDetails (Object): Structured metrics of the house geometry.
 * 
 * Units:
 * - Length, Width, Height: Feet (ft)
 * - Floor Area: Square Feet (sq.ft)
 * - Volume: Cubic Feet (cu.ft)
 * - Density: Birds/sq.ft and Birds/m^2
 * 
 * Engineering Assumptions:
 * - Assumes a flat ceiling height profile. For pitched-ceiling sheds, height is entered 
 *   as average height (e.g., eave height + half of pitch height).
 * - Standard conversion factor: 1 square foot = 0.092903 square meters.
 */

export const calculateGeometry = (length, width, height, birdCount) => {
  const lengthVal = parseFloat(length) || 0;
  const widthVal = parseFloat(width) || 0;
  const heightVal = parseFloat(height) || 0;
  const birdsVal = parseInt(birdCount) || 0;

  const floorArea = Math.round(lengthVal * widthVal);
  const volume = Math.round(lengthVal * widthVal * heightVal);
  
  const birdDensity = floorArea > 0 ? parseFloat((birdsVal / floorArea).toFixed(2)) : 0;
  const birdsPerSqMeter = floorArea > 0 ? parseFloat(((birdsVal) / (floorArea * 0.092903)).toFixed(2)) : 0;

  return {
    floorArea,
    volume,
    birdDensity,
    birdsPerSqMeter
  };
};
