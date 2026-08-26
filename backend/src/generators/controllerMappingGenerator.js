/**
 * Generator: Controller Output Mapper
 * 
 * Maps fan indexes to sequential physical relay outputs.
 */
export const allocateRelays = (fanCount, controllerModel, modelsDb) => {
  const mappings = [];
  const count = parseInt(fanCount) || 10;
  const activeModel = modelsDb[controllerModel] || modelsDb["Z1000"];
  const maxRelays = activeModel.maxRelays;

  for (let i = 1; i <= count; i++) {
    const relayNum = i <= maxRelays ? i : (i - maxRelays);
    const prefix = i <= maxRelays ? "Main Relay" : "Expansion Relay";

    mappings.push({
      index: i,
      controllerOutput: `${prefix} Output ${relayNum}`
    });
  }

  return mappings;
};
