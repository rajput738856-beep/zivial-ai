import { optimizeVentilation } from "../services/ventilationOptimizer.service.js";

/**
 * Controller: Handles HTTP post requests to generate optimization tables.
 */
export const getOptimizedVentilation = async (req, res) => {
  try {
    const {
      length = 240,
      width = 65,
      height = 22,
      birdCount = 18500,
      placementDate = "",
      fanCount = 10,
      fanSize = "48 Inch",
      breed = "Ross 308",
      ambientTemp = 28,
      ambientHumidity = 65,
      cfmMinLimit = 7104,
      requiredCFM = 120000
    } = req.body;

    const farmConfig = {
      length,
      width,
      height,
      fanCount,
      fanSize
    };

    const birdData = {
      birdCount,
      placementDate,
      breed
    };

    const weather = {
      ambientTemp,
      ambientHumidity
    };

    const ventReqs = {
      cfmMinLimit,
      requiredCFM
    };

    const output = optimizeVentilation(farmConfig, birdData, weather, ventReqs);

    return res.status(200).json({
      success: true,
      message: "Ventilation optimization table generated successfully!",
      data: output
    });
  } catch (error) {
    console.error("Error optimizing ventilation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal calculation error occurred.",
      error: error.message
    });
  }
};
