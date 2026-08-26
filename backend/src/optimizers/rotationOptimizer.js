/**
 * Optimizer: Rotation Selector
 * 
 * Computes rotational assignments and schedules balanced wear for idle exhaust fans.
 */
export const selectRotationalFans = (continuousFans, totalFans) => {
  const rotationOrder = [];
  const startIdx = continuousFans + 1;

  for (let i = startIdx; i <= totalFans; i++) {
    rotationOrder.push(`Fan-${i}`);
  }

  const rotationalFans = rotationOrder.length;

  return {
    rotationalFans,
    fanRotationOrder: rotationOrder
  };
};
