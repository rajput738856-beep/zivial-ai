import express from "express";
import { getFanCombination } from "../controllers/fanSelection.controller.js";

const router = express.Router();

router.post("/fans", getFanCombination);

export default router;
