import express from "express";
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
} from "../controllers/questionController";

const router = express.Router();

// Route tạo câu hỏi mới
router.post("/", createQuestion);

// Route lấy danh sách tất cả câu hỏi
router.get("/", getQuestions);

// Route lấy thông tin câu hỏi theo ID
router.get("/:id", getQuestionById);

// Route cập nhật câu hỏi theo ID
router.put("/:id", updateQuestion);

// Route xóa câu hỏi theo ID
router.delete("/:id", deleteQuestion);

export default router;
