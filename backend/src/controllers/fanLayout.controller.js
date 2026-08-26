import { getOptimalFanLayout } from "../services/fanLayout.service.js";

/**
 * Controller: Handles HTTP post requests to generate dynamic fan layouts.
 */
export const getFanLayout = async (req, res) => {
  try {
    const {
      length = 200,
      width = 60,
      height = 20,
      fanCount = 10,
      fanSize = "48 Inch",
      controllerModel = "Z1000"
    } = req.body;

    const farmConfig = {
      length,
      width,
      height,
      fanCount,
      fanSize
    };

    const controllerConfig = {
      model: controllerModel
    };

    const output = getOptimalFanLayout(farmConfig, controllerConfig);

    return res.status(200).json({
      success: true,
      message: "Fan layout schema generated successfully!",
      data: output
    });
  } catch (error) {
    console.error("Error generating fan layout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal configuration error occurred.",
      error: error.message
    });
  }
};
