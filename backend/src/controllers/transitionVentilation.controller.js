import { getTransitionVentilationSettings } from "../services/transitionVentilationService.js";

/**
 * Controller: Handles HTTP post requests to generate Transition Ventilation configurations.
 */
export const getTransitionVentilation = async (req, res) => {
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
      coolingPad = "Yes",
      ambientTemp = 28,
      ambientHumidity = 65,
      currentHouseTemp = null
    } = req.body;

    const farmConfig = {
      length,
      width,
      height,
      birdCount,
      fanCount,
      fanSize,
      coolingPad
    };

    const weather = {
      ambientTemp,
      ambientHumidity
    };

    const output = getTransitionVentilationSettings(farmConfig, placementDate, breed, weather, currentHouseTemp);

    return res.status(200).json({
      success: true,
      message: "Transition ventilation calculated successfully via ZECE Services!",
      data: output
    });
  } catch (error) {
    console.error("Error calculating transition ventilation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal calculation error occurred.",
      error: error.message
    });
  }
};
