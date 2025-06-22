import dotenv from 'dotenv'
dotenv.config()
import User from "../models/userModel.mjs";
import UserService from "../service/user-service.mjs";
import { validationResult } from "express-validator";
import ApiError from "../errors/api-errors.mjs";

const userService = new UserService();

export default class UserController {

    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequestError('Ошибка валидации', errors.array()))
            }

            const {name, email, password} = req.body;
            const userData = await userService.registerUser(email, password);
            res.cookie('refreshToken',
                userData.refreshToken,
                {maxAge: 60 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                    });
            return res.json(userData)
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken',
                userData.refreshToken,
                {maxAge: 60 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                }); // устанавливает токен, но не возвращает
            console.log('Токен отправлен в куки:', userData.refreshToken);
            return res.json(userData)
        } catch (e) {
            next(e);
        }
    }

    // async logout(req, res, next) {
    //     try {
    //         const { refreshToken } = req.cookies;
    //         console.log('req >>>>', req.body);
    //         const { email } = req.body;
    //
    //         if (!refreshToken) {
    //             return res.status(400).json({ message: 'Refresh token not found in cookies' });
    //         }
    //
    //         console.log('logout userController', refreshToken);
    //         const user = await userService.logout(email, refreshToken);
    //         res.clearCookie('refreshToken');
    //         return res.json(user);
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }


    async activate(req, res, next) {
        try {
            const actLink = req.params.link;
            console.log('actLink', actLink); // сюда приходит undefined!!!!!
            await userService.activate(actLink);
            return res.redirect(process.env.CLIENT_URL || 'https://mail.ru');

        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken',
                userData.refreshToken,
                {maxAge: 60 * 24 * 60 * 60 * 1000,
                    //httpOnly: true
                });
            return res.json(userData)
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getByID(req, res, next) {
        let id;
        try {
            id = req.query.id || req.params.id;
            const user = await User.findByPk(id);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

}