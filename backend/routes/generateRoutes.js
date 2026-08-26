import express from "express";
import { generateRecipe, getStages } from "../controllers/generateController.js";

const router = express.Router();

router.post("/", generateRecipe);
router.get("/stages", getStages);

export default router;