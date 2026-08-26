import express from "express";
import { getOptimizedVentilation } from "../controllers/ventilationOptimizer.controller.js";

const router = express.Router();

router.post("/optimize", getOptimizedVentilation);

export default router;
