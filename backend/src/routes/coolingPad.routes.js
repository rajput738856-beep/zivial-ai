import express from "express";
import { getCoolingPad } from "../controllers/coolingPad.controller.js";

const router = express.Router();

router.post("/cooling", getCoolingPad);

export default router;
