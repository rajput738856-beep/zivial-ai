import express from "express";
import { getMinimumVentilation } from "../controllers/minimumVentilation.controller.js";

const router = express.Router();

router.post("/minimum", getMinimumVentilation);

export default router;
