import { getOptimalFanCombination } from "../services/fanSelection.service.js";

/**
 * Controller: Handles HTTP post requests to optimize active fan combinations.
 */
export const getFanCombination = async (req, res) => {
  try {
    const {
      length = 200,
      width = 60,
      height = 20,
      fanCount = 10,
      fanSize = "48 Inch",
      birdAge = 14,
      birdCount = 25000,
      breed = "Cobb 500",
      ambientTemp = 28,
      ambientHumidity = 65,
      requiredCFM = 35000
    } = req.body;

    const farmConfig = {
      length,
      width,
      height,
      fanCount,
      fanSize
    };

    const birdData = {
      age: birdAge,
      birdCount,
      breed
    };

    const weather = {
      ambientTemp,
      ambientHumidity
    };

    const ventReq = {
      requiredCFM
    };

    const output = getOptimalFanCombination(farmConfig, birdData, weather, ventReq);

    return res.status(200).json({
      success: true,
      message: "Fan selection optimized successfully!",
      data: output
    });
  } catch (error) {
    console.error("Error optimizing fan selection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal calculation error occurred.",
      error: error.message
    });
  }
};
