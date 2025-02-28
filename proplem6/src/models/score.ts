import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    score: { type: Number, required: true, default: 0 },
});

const Score = mongoose.model("Score", ScoreSchema);
export default Score;
