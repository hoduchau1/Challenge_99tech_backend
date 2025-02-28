import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    number: string;
    avatar?: string;
    dateofbirth: Date;
    isDeleted?: boolean; // Thêm trạng thái xóa mềm
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    avatar: { type: String },
    dateofbirth: { type: Date },
    isDeleted: { type: Boolean, default: false } // Mặc định là chưa xóa
});

export default mongoose.model<IUser>('User', UserSchema);
