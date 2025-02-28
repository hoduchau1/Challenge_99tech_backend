import express from "express";
import { updateScore, getTopScores } from "../controllers/scoreController";

const router = express.Router();

router.post("/update-score", updateScore);

//10 man top
router.get("/top-scores", getTopScores);

export default router;
