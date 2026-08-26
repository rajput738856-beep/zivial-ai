import express from "express";
import { getTransitionVentilation } from "../controllers/transitionVentilation.controller.js";

const router = express.Router();

router.post("/transition", getTransitionVentilation);

export default router;
