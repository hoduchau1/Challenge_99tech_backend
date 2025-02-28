import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./mongodb";
import scoreRoutes from "./routes/scoreRoute";
import Score from "./models/score";
import path from "path";
import { setSocketServer } from "./controllers/scoreController"; // Chỉ cần import setSocketServer

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Cho phép mọi nguồn truy cập (có thể điều chỉnh)
        methods: ["GET", "POST"]
    }
});

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Cấu hình EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Truyền io vào scoreController
setSocketServer(io);

// Routes API
import adminRoutes from "./routes/adminRoute";
import questionRoutes from "./routes/questionRoute";
import gameRoutes from "./routes/gameRoute";

app.use("/api/scores", scoreRoutes);
app.use("/admin", adminRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/game", gameRoutes);



// Route hiển thị bảng xếp hạng
app.get("/", async (req, res) => {
    try {
        const topScores = await Score.find().sort({ score: -1 }).limit(10);
        res.render("leaderboard", { topScores });
    } catch (error) {
        res.status(500).send("Lỗi server");
    }
});

// Socket.IO: Xử lý khi có client kết nối
io.on("connection", (socket) => {
    console.log("🟢 Một người dùng đã kết nối:", socket.id);

    socket.on("disconnect", () => {
        console.log("🔴 Một người dùng đã ngắt kết nối:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${process.env.PORT}`));
