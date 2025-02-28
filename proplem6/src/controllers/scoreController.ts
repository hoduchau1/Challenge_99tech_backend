import { Request, Response } from "express";
import Score from "../models/score";
import { Server } from "socket.io";

let io: Server;  // Biến để lưu io

export function setSocketServer(socketServer: Server) {
    io = socketServer;
}

export async function updateScore(req: Request, res: Response): Promise<void> {
    try {
        const { username, score } = req.body;
        if (!username || typeof score !== "number") {
            res.status(400).json({ error: "Dữ liệu không hợp lệ!" });
            return;
        }

        if (score > 10) {
            res.status(400).json({ error: "your score high than 10!" });
            return;
        }
        let user = await Score.findOne({ username });
        if (user) {
            user.score = score;
        } else {
            user = new Score({ username, score });
        }
        await user.save();

        // Lấy danh sách top 10 và phát sự kiện
        const topScores = await Score.find().sort({ score: -1 }).limit(10);
        console.log("📢 Phát sự kiện updateLeaderboard:", topScores);
        io.emit("updateLeaderboard", topScores); // Phát sự kiện cập nhật bảng xếp hạng

        res.status(200).json({ message: "Cập nhật điểm thành công!", data: topScores });
    } catch (error) {
        console.error("❌ Lỗi:", error);
        res.status(500).json({ error: "Lỗi server!" });
    }
}

export async function getTopScores(req: Request, res: Response): Promise<void> {
    try {
        const topScores = await Score.find().sort({ score: -1 }).limit(10);
        res.status(200).json({ topScores });
    } catch (error) {
        console.error("Lỗi khi lấy bảng xếp hạng:", error);
        res.status(500).json({ error: "Lỗi server!" });
    }
}
