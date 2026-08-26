import express from "express";
import { getControllerRecipe } from "../controllers/controllerLogic.controller.js";

const router = express.Router();

router.post("/recipe", getControllerRecipe);

export default router;
