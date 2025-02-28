
import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/test1'; // Thay thế bằng URI của bạn

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('Kết nối MongoDB thành công');
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error);
        process.exit(1); // Thoát nếu không kết nối được
    }
}

connectDB(); // Gọi kết nối một lần khi module được import

export default mongoose; // Export mongoose để sử dụng trong các module khác