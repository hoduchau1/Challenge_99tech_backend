import mongoose, { Schema, Document } from "mongoose";

interface IQuestion extends Document {
    questionText: string;
    answers: { text: string; isCorrect: boolean }[];
}

const QuestionSchema: Schema = new Schema(
    {
        questionText: { type: String, required: true },
        answers: [
            {
                text: { type: String, required: true },
                isCorrect: { type: Boolean, required: true },
            },
        ],
    },
    { timestamps: true }
);

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
