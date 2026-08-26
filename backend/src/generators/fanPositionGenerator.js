/**
 * Generator: Symmetrical Fan Position Allocator
 * 
 * Maps sequential fans to Left, Right, or Rear Tunnel positions.
 */
export const allocatePositions = (fanCount) => {
  const positions = [];
  const count = parseInt(fanCount) || 10;

  for (let i = 1; i <= count; i++) {
    let position = "Rear Tunnel";
    let fanType = "Tunnel Fan";

    if (i === 1) {
      position = "Left Sidewall";
      fanType = "Sidewall Fan";
    } else if (i === 2) {
      position = "Right Sidewall";
      fanType = "Sidewall Fan";
    }

    positions.push({
      index: i,
      position,
      fanType
    });
  }

  return positions;
};
