import { getCoolingPadSettings } from "../services/coolingPad.service.js";

/**
 * Controller: Handles HTTP post requests to generate Cooling Pad parameters.
 */
export const getCoolingPad = async (req, res) => {
  try {
    const {
      length = 200,
      width = 60,
      height = 20,
      coolingPadLength = 60,
      padHeight = 6,
      fanCount = 10,
      placementDate = "",
      breed = "Cobb 500",
      ambientTemp = 28,
      ambientHumidity = 65,
      currentHouseTemp = null,
      ventLevel = 10
    } = req.body;

    const farmConfig = {
      length,
      width,
      height,
      padLength: coolingPadLength,
      padHeight,
      fanCount
    };

    const weather = {
      ambientTemp,
      ambientHumidity
    };

    const output = getCoolingPadSettings(
      farmConfig, 
      placementDate, 
      breed, 
      weather, 
      currentHouseTemp, 
      ventLevel
    );

    return res.status(200).json({
      success: true,
      message: "Cooling pad configuration calculated successfully!",
      data: output
    });
  } catch (error) {
    console.error("Error calculating cooling pad:", error);
    return res.status(500).json({
      success: false,
      message: "Internal calculation error occurred.",
      error: error.message
    });
  }
};
