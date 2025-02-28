import { Request, Response } from 'express';
import User, { IUser } from '../model/user.model';
import mongoose from 'mongoose';

export async function getUsers(req: Request, res: Response): Promise<void> {
    try {
        const users: IUser[] = await User.find({ isDeleted: false });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}

export async function getUsersforEjs(req: Request, res: Response): Promise<void> {
    try {
        const { searchValue, showHidden, startDate, endDate, page = "1", limit = "5" } = req.query;

        const filter: any = {};

        if (searchValue && typeof searchValue === "string") {
            filter.$or = [
                { username: { $regex: searchValue, $options: "i" } },
                { email: { $regex: searchValue, $options: "i" } }
            ];
        }

        if (showHidden !== "true") {
            filter.isDeleted = false;
        }

        let start: Date | undefined;
        let end: Date | undefined;

        if (typeof startDate === "string" && !isNaN(Date.parse(startDate))) {
            start = new Date(startDate);
        }
        if (typeof endDate === "string" && !isNaN(Date.parse(endDate))) {
            end = new Date(endDate);
        }

        if (start || end) {
            filter.dateofbirth = {};
            if (start) filter.dateofbirth.$gte = start;
            if (end) filter.dateofbirth.$lte = end;
        }

        const pageNumber = Math.max(1, parseInt(page as string, 10)); // Trang tối thiểu là 1
        const limitNumber = Math.max(1, parseInt(limit as string, 10)); // Số lượng tối thiểu là 1
        const skip = (pageNumber - 1) * limitNumber;

        const users = await User.find(filter).skip(skip).limit(limitNumber);
        const totalUsers = await User.countDocuments(filter); // Tổng số user sau filter
        const totalPages = Math.ceil(totalUsers / limitNumber); // Tính tổng số trang

        res.render('users', {
            users,
            searchValue,
            showHidden,
            startDate,
            endDate,
            page: pageNumber,
            totalPages,
            limit: limitNumber
        });
    } catch (error) {
        res.status(500).json({ message: "Error filtering users", error });
    }
}


export async function createUser(req: Request, res: Response): Promise<void> {
    try {
        const userData: IUser = req.body;

        const avatar = req.file ? `/uploads/${req.file.filename}` : "";
        if (!userData.username || typeof userData.username !== 'string' || userData.username.length < 3) {
            res.status(400).json({ message: 'Invalid username' });
            return;
        }
        if (!userData.email || typeof userData.email !== 'string' || !userData.email.includes('@')) {
            res.status(400).json({ message: 'Invalid email' });
            return;
        }
        if (userData.avatar && typeof userData.avatar !== 'string') {
            res.status(400).json({ message: 'Avatar must be a valid URL string' });
            return;
        }
        if (!userData.number || typeof userData.number !== 'string' || !/^[0-9]{10,15}$/.test(userData.number)) {
            res.status(400).json({ message: 'Invalid phone number' });
            return;
        }
        if (!userData.dateofbirth || isNaN(new Date(userData.dateofbirth).getTime())) {
            res.status(400).json({ message: 'Invalid date of birth' });
            return;
        }

        // Kiểm tra trùng lặp
        const existingUser = await User.findOne({
            $or: [{ username: userData.username }, { email: userData.email }, { number: userData.number }]
        });

        if (existingUser) {
            res.status(400).json({ message: 'Username, email, or phone number already exists' });
            return;
        }

        // Lưu người dùng mới
        if (avatar) {
            userData.avatar = avatar
        }
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        // res.status(500).json({ message: 'Create User succes', savedUser: savedUser });
        res.redirect('/users/usersgetlist');
        // });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error });
    }
}



export async function updateUser(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const updates = req.body;
        console.log("updates", id, req.body)
        console.log("File nhận được:", req.file); // Debug xem có file không

        // Kiểm tra nếu có ảnh mới thì cập nhật avatar
        const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }

        // Kiểm tra nếu username, email hoặc số điện thoại đã tồn tại nhưng loại trừ chính nó
        const existingUser = await User.findOne({
            $or: [
                { username: updates.username },
                { email: updates.email },
                { number: updates.number }
            ],
            _id: { $ne: id } // Bỏ qua chính user đang cập nhật
        });

        if (existingUser) {
            res.status(400).json({ message: 'Username, email, or phone number already in use' });
            return;
        }
        if (!updates.username || typeof updates.username !== 'string' || updates.username.length < 3) {
            res.status(400).json({ message: 'Invalid username' });
            return;
        }
        if (!updates.email || typeof updates.email !== 'string' || !updates.email.includes('@')) {
            res.status(400).json({ message: 'Invalid email' });
            return;
        }
        if (updates.avatar && typeof updates.avatar !== 'string') {
            res.status(400).json({ message: 'Avatar must be a valid URL string' });
            return;
        }
        if (!updates.number || typeof updates.number !== 'string' || !/^[0-9]{10,15}$/.test(updates.number)) {
            res.status(400).json({ message: 'Invalid phone number' });
            return;
        }
        if (!updates.dateofbirth || isNaN(new Date(updates.dateofbirth).getTime())) {
            res.status(400).json({ message: 'Invalid date of birth' });
            return;
        }

        // Kiểm tra nếu người dùng chọn khôi phục user đã bị ẩn
        if (req.body.restoreUser) {
            updates.isDeleted = false;
        }

        if (avatar) updates.avatar = avatar; // Chỉ cập nhật avatar nếu có ảnh mới
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.redirect('/users/usersgetlist');

    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
}


/**
 * Xóa người dùng theo ID
 */
export async function deleteUser(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }

        // Cập nhật trạng thái `isDeleted` thành `true`
        const deletedUser = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // res.status(200).json({ message: 'User deleted successfully (soft delete)', data: deletedUser });
        res.redirect('/users/usersgetlist');

    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}


/**
 * Tìm kiếm người dùng theo username hoặc email
 */
export async function searchUsers(req: Request, res: Response): Promise<void> {
    try {
        const { keyword } = req.query;

        if (!keyword || typeof keyword !== 'string') {
            res.status(400).json({ message: 'Invalid search keyword' });
            return;
        }

        const users = await User.find({
            $or: [
                { username: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } }
            ]
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error searching users', error });
    }
}

/**
 * Lọc người dùng theo khoảng ngày sinh
 */
export async function filterUsersByDateOfBirth(req: Request, res: Response): Promise<void> {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            res.status(400).json({ message: 'Start and end dates are required' });
            return;
        }

        const startDate = new Date(start as string);
        const endDate = new Date(end as string);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            res.status(400).json({ message: 'Invalid date range' });
            return;
        }

        const users = await User.find({
            dateofbirth: { $gte: startDate, $lte: endDate }
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering users', error });
    }
}
export async function getActiveUsers(req: Request, res: Response): Promise<void> {
    try {
        const users = await User.find({ isDeleted: false }); // Lọc user chưa bị xóa
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}
export async function hardDeleteUser(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // res.status(200).json({ message: 'User permanently deleted', data: deletedUser });
        res.redirect('/users/usersgetlist');

    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}
