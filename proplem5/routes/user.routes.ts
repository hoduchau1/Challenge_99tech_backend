import { Router } from 'express';
import User, { IUser } from '../model/user.model';
import upload from '../src/untils/index';
import {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    searchUsers,
    filterUsersByDateOfBirth,
    hardDeleteUser,
    getUsersforEjs
} from '../controllers/user.controller';

const router = Router();

router.post('/', upload.single("avatar"), createUser);
router.get('/', getUsers);
router.put('/:id', upload.single("avatar"), updateUser);
router.delete('/:id', deleteUser);
router.get('/search', searchUsers);
router.get('/filter', filterUsersByDateOfBirth);


router.get('/usersgetlist', getUsersforEjs);






router.get('/add', (req, res) => {
    res.render('addUser');
});
router.post('/add', upload.single("avatar"), createUser);

router.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('editUser', { user });
});
router.post('/edit/:id', upload.single("avatar"), updateUser);

//hide
router.get('/delete/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('deleteUser', { user });
});
router.post('/delete/:id', deleteUser);

// Xóa hẳn
router.get('/hard-delete/:id', hardDeleteUser);


export default router;
