import express, { Request, Response } from "express";
import Question from "../models/questionlist";
import { updateScore, getTopScores } from "../controllers/scoreController";

const router = express.Router();

router.get("/play", (req, res) => {
    res.render("playGame");
});
router.get("/questions", async (req, res) => {
    try {
        const questions = await Question.find().limit(10);
        res.json({ success: true, questions });
    } catch (error) {
        console.error("❌ Lỗi khi lấy câu hỏi:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});
router.post("/submit", updateScore);

export default router;
