import { getHumidityControlSettings } from "../services/humidityControl.service.js";

/**
 * Controller: Handles HTTP post requests to generate Humidity parameters.
 */
export const getHumidityControl = async (req, res) => {
  try {
    const {
      length = 200,
      width = 60,
      height = 20,
      fanCount = 10,
      placementDate = "",
      breed = "Cobb 500",
      ambientTemp = 28,
      ambientHumidity = 65,
      currentHouseTemp = null,
      ventLevel = 5,
      coolingStatus = "No"
    } = req.body;

    const farmConfig = {
      length,
      width,
      height,
      fanCount
    };

    const weather = {
      ambientTemp,
      ambientHumidity
    };

    const output = getHumidityControlSettings(
      farmConfig,
      placementDate,
      breed,
      weather,
      currentHouseTemp,
      ventLevel,
      coolingStatus
    );

    return res.status(200).json({
      success: true,
      message: "Humidity control configuration calculated successfully!",
      data: output
    });
  } catch (error) {
    console.error("Error calculating humidity control:", error);
    return res.status(500).json({
      success: false,
      message: "Internal calculation error occurred.",
      error: error.message
    });
  }
};
