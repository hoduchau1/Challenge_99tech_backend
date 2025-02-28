import express, { Request, Response } from "express";
import Question from "../models/questionlist";
import Score from "../models/score";
import { updateScore, getTopScores } from "../controllers/scoreController";

const router = express.Router();

// Route hiển thị trang quản lý câu hỏi
router.get("/questions", async (req: Request, res: Response): Promise<void> => {
    try {
        const questions = await Question.find();
        console.log(questions)
        res.render("questions", { questions });
    } catch (error) {
        res.status(500).send("Lỗi server!");
    }
});
router.get("/Adminleaderboard", async (req, res) => {
    try {
        const topScores = await Score.find().sort({ score: -1 });
        res.render("Adminleaderboard", { topScores });
    } catch (error) {
        res.status(500).send("Lỗi server");
    }
});
router.put("/update-score", updateScore);

// Route hiển thị form chỉnh sửa câu hỏi
router.get("/edit-question/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Lấy ID từ URL
        const question = await Question.findById(id);

        if (!question) {
            res.status(404).send("Không tìm thấy câu hỏi");
            return;
        }

        res.render("editQuestion", { question });
    } catch (error) {
        console.error("❌ Lỗi khi lấy câu hỏi:", error);
        res.status(500).send("Lỗi server");
    }
});

export default router;
