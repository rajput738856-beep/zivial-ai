/**
 * Logic: Ventilation Decisions
 * 
 * Determines ventilation state: Minimum, Transition, or Tunnel.
 */
export const checkVentilationMode = (houseTemp, targetTemp, heatingTemp, coolingTemp) => {
  const houseT = parseFloat(houseTemp) || 30.0;
  const targetT = parseFloat(targetTemp) || 30.0;
  const heatT = parseFloat(heatingTemp) || 28.0;

  if (houseT < heatT) {
    return "Heating Ventilation";
  } else if (houseT >= heatT && houseT <= targetT) {
    return "Minimum Ventilation";
  } else if (houseT > targetT && houseT < targetT + 2.0) {
    return "Transition Ventilation";
  } else {
    return "Tunnel Ventilation";
  }
};
