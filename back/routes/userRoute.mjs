import express from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController.mjs';

const router = express.Router();
const userController = new UserController();
import authMiddleware from "../middleware/auth-mdw.mjs";

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 20}),
    userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/activate/:link', userController.activate);
router.get('/getAll', authMiddleware, userController.getAll);
router.get('/:id', userController.getByID);


export default router;
