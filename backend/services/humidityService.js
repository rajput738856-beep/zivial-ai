/**
 * Service: Humidity Control Engine
 * 
 * Purpose:
 * Computes ventilation adjustments to expel excess latent moisture and maintain dry litter.
 * Returns the default 10-row Humidity Treatment Settings.
 */

export const getHumidityControlSettings = (age, ambientRH) => {
  return {
    humidityTreatment: [
      { day: 1, humidity: 60, delay: 120, duration: 60 },
      { day: 7, humidity: 65, delay: 100, duration: 60 },
      { day: 14, humidity: 70, delay: 90, duration: 60 },
      { day: 21, humidity: 75, delay: 80, duration: 70 },
      { day: 28, humidity: 80, delay: 70, duration: 70 },
      { day: 35, humidity: 85, delay: 60, duration: 70 },
      { day: 0, humidity: 0, delay: 0, duration: 0 },
      { day: 0, humidity: 0, delay: 0, duration: 0 },
      { day: 0, humidity: 0, delay: 0, duration: 0 },
      { day: 0, humidity: 0, delay: 0, duration: 0 }
    ]
  };
};
