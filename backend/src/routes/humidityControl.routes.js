import express from "express";
import { getHumidityControl } from "../controllers/humidityControl.controller.js";

const router = express.Router();

router.post("/humidity", getHumidityControl);

export default router;
