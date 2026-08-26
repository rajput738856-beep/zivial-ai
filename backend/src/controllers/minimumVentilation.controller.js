import { getMinimumVentilationSettings } from "../services/minimumVentilationService.js";

/**
 * Controller: Handles HTTP post requests to generate Minimum Ventilation configurations.
 */
export const getMinimumVentilation = async (req, res) => {
  try {
    const {
      length = 200,
      width = 60,
      height = 20,
      birdCount = 25000,
      placementDate = "",
      breed = "Cobb 500",
      fanCount = 10,
      fanSize = "48 Inch",
      ambientTemp = 28,
      ambientHumidity = 65
    } = req.body;

    const farmConfig = {
      length,
      width,
      height,
      birdCount,
      fanCount,
      fanSize
    };

    const weather = {
      ambientTemp,
      ambientHumidity
    };

    const output = getMinimumVentilationSettings(farmConfig, placementDate, breed, weather);

    return res.status(200).json({
      success: true,
      message: "Minimum ventilation calculated successfully via ZECE Services!",
      data: output
    });
  } catch (error) {
    console.error("Error calculating minimum ventilation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal calculation error occurred.",
      error: error.message
    });
  }
};
