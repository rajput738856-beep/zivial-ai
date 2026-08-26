/**
 * Generator: Fan Group Allocator
 * 
 * Maps fans into Continuous, Timer, Rotational, or Reserve groups.
 */
export const allocateGroups = (fanCount) => {
  const groups = [];
  const count = parseInt(fanCount) || 10;

  for (let i = 1; i <= count; i++) {
    let fanGroup = "Timer Group";
    
    if (i <= 2) {
      fanGroup = "Continuous Group";
    } else if (i > 8) {
      fanGroup = "Reserve Group";
    }

    groups.push({
      index: i,
      fanGroup
    });
  }

  return groups;
};
