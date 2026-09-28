import { generateZ1000Recipe } from "./backend/src/calculations/batchRecipeGenerator.js";
import { FAN_DATABASE } from "./backend/config/poultryConfig.js";

const farmConfig = {
  length: 200,
  width: 60,
  height: 20,
  fanCount: 8,
  fanSize: "48 Inch",
  birdCapacity: 15000,
  farmName: "Test Farm Z1000"
};

const result = generateZ1000Recipe(farmConfig, "Cobb 500", FAN_DATABASE);

console.log(JSON.stringify(result, null, 2));
