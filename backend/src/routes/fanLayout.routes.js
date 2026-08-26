import express from "express";
import { getFanLayout } from "../controllers/fanLayout.controller.js";

const router = express.Router();

router.post("/layout", getFanLayout);

export default router;
