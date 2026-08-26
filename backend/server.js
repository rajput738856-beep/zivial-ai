import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load Environment Variables
dotenv.config();

// Import Routes
import generateRoutes from "./routes/generateRoutes.js";
import minimumVentilationRoutes from "./src/routes/minimumVentilation.routes.js";
import transitionVentilationRoutes from "./src/routes/transitionVentilation.routes.js";
import ventilationOptimizerRoutes from "./src/routes/ventilationOptimizer.routes.js";
import coolingPadRoutes from "./src/routes/coolingPad.routes.js";
import humidityControlRoutes from "./src/routes/humidityControl.routes.js";
import fanSelectionRoutes from "./src/routes/fanSelection.routes.js";
import controllerLogicRoutes from "./src/routes/controllerLogic.routes.js";
import fanLayoutRoutes from "./src/routes/fanLayout.routes.js";

// Create Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zivial AI Backend Running Successfully 🚀",
  });
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend assets in production
const frontendBuildPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendBuildPath));

// API Routes
app.use("/api/generate", generateRoutes);
app.use("/api/ventilation", minimumVentilationRoutes);
app.use("/api/ventilation", transitionVentilationRoutes);
app.use("/api/ventilation", ventilationOptimizerRoutes);
app.use("/api/cooling", coolingPadRoutes);
app.use("/api/humidity", humidityControlRoutes);
app.use("/api/ventilation", fanSelectionRoutes);
app.use("/api/controller", controllerLogicRoutes);
app.use("/api/ventilation", fanLayoutRoutes);

// Wildcard route to handle React Router navigation
app.use((req, res, next) => {
  // If it's an API route, don't serve frontend index.html, let it 404
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: "API Route Not Found",
    });
  }
  
  res.sendFile(path.join(frontendBuildPath, "index.html"), (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Resource not found or frontend not built.",
      });
    }
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on http://localhost:${PORT}`);
});