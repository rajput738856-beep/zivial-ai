import { generateControllerRecipe } from "../controller/controllerLogic.js";

/**
 * Controller: Handles HTTP post requests to generate overall controller recipes.
 */
export const getControllerRecipe = async (req, res) => {
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
      currentHouseTemp = 31.2,
      currentHouseHumidity = 65,
      targetTemp = 30.0,
      heatingTemp = 28.0,
      coolingTemp = 33.0
    } = req.body;

    const farmConfig = {
      length,
      width,
      height,
      fanCount,
      fanSize
    };

    const weather = {
      ambientTemp,
      ambientHumidity
    };

    const birdData = {
      age: birdAge,
      birdCount,
      breed
    };

    const currentConditions = {
      currentHouseTemp,
      currentHouseHumidity,
      targetTemp,
      heatingTemp,
      coolingTemp
    };

    const output = generateControllerRecipe(farmConfig, weather, birdData, currentConditions);

    return res.status(200).json({
      success: true,
      message: "Controller recipe generated successfully!",
      data: output
    });
  } catch (error) {
    console.error("Error generating controller recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Internal coordination error occurred.",
      error: error.message
    });
  }
};
