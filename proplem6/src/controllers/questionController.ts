import { Request, Response } from "express";
import Question from "../models/questionlist";

// Tạo câu hỏi mới
export const createQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const questionCount = await Question.countDocuments();
        if (questionCount >= 10) {
            res.status(400).json({ error: "Bạn chỉ có thể tạo max 10 question!" });
            return;
        }
        const { questionText, answers } = req.body;

        if (!questionText || !Array.isArray(answers) || answers.length === 0) {
            res.status(400).json({ message: "Dữ liệu không hợp lệ" });
            return;
        }

        const newQuestion = new Question({ questionText, answers });
        await newQuestion.save();
        const updatedCount = await Question.countDocuments();
        if (updatedCount > 10) {
            await Question.findByIdAndDelete(newQuestion._id); // Xóa câu hỏi nếu quá giới hạn
            res.status(400).json({ error: "Bạn chỉ có thể có tối đa 10 câu hỏi!" });
            return;
        }
        res.status(201).json({ message: "Tạo câu hỏi thành công", data: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Lấy danh sách tất cả câu hỏi
export const getQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Lấy câu hỏi theo ID
export const getQuestionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            res.status(404).json({ message: "Không tìm thấy câu hỏi" });
            return;
        }

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Cập nhật câu hỏi theo ID
export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { questionText, answers } = req.body;

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            { questionText, answers },
            { new: true }
        );

        if (!updatedQuestion) {
            res.status(404).json({ message: "Không tìm thấy câu hỏi" });
            return;
        }

        res.status(200).json({ message: "Cập nhật thành công", data: updatedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Xóa câu hỏi theo ID
export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            res.status(404).json({ message: "Không tìm thấy câu hỏi" });
            return;
        }

        res.status(200).json({ message: "Xóa thành công", data: deletedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};
