import User from "../models/userModel.mjs";
import * as uuid from "uuid";
import TokenService from "./token-service.mjs";
import MailService from "./mail-service.mjs";
import ApiError from "../errors/api-errors.mjs";
const mailService = new MailService();
const tokenService = new TokenService();

export default class UserService {
    async registerUser(email, password) {
        try {
            const candidate = await User.findOne({where: { email: email }});
            if (candidate) {
                throw ApiError.BadRequestError(`User with email ${email} already exists`);
            }
            const actLink = uuid.v4();
            const newUser = await User.create({email, password, actLink});
            await mailService.sendEmail(email, `${process.env.API_URL}/activate/${actLink}`);
            const userDto = {
                id: newUser.id,
                email: newUser.email,
                actLink: newUser.actLink,
            };
            console.log('[registerUser] старт регистрации');
            const tokens = tokenService.generateToken(userDto);
            console.log('[registerUser] токены сгенерированы:', tokens);
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            console.log('[registerUser] токены сохранены');
            return {...tokens, user: userDto}
        } catch (e) {
            throw (e);
        }
    }

    async activate(actLink) {
        const user = await User.findOne({where: { actLink: actLink }});
        if (!user) {
            throw ApiError.BadRequestError( `Incorrect activation link`);
        }
        user.status = true;
        await user.save()
    }

    async login(email, password) {
        const user = await User.findOne({where: { email: email }});
        if (!user) {
            throw ApiError.BadRequestError(`Пользователь с таким емейлом не найден`)
        }
        if (password !== user.password) {
            throw ApiError.BadRequestError('Неверный пароль')
        }
        const userDto = {
            id: user.id,
            email: user.email,
            actLink: user.actLink,
        };
        const tokens = tokenService.generateToken(userDto);
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}

    }

    async logout(refreshToken) {

        const token = await tokenService.removeToken(refreshToken);
        console.log('logout userService', token);
        return token;
    }

    async refresh(refreshToken) {

        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findByPk(userData.id);
        const userDto = {
            id: user.id,
            email: user.email,
            actLink: user.actLink,
        };
        const tokens = tokenService.generateToken(userDto);
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}

    }

    async getAllUsers() {
        const allUsers = await User.findAll();
        return allUsers;
    }
}