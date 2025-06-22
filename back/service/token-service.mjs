import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import Token from "../models/tokenModel.mjs";

export default class TokenService {
    generateToken(info) {
        const accessToken = jwt.sign(info, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '15s'});
        const refreshToken = jwt.sign(info, process.env.SECRET_REFRESH_TOKEN, {expiresIn: '10min'});
        console.log('[generateToken] accessToken:', accessToken);
        console.log('[generateToken] refreshToken:', refreshToken);
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findByPk(userId);
         if (tokenData) {
             console.log('Найден существующий в БД refreshToken:', tokenData.refreshToken);
             tokenData.refreshToken = refreshToken;
             tokenData.set('refreshToken', refreshToken); // это активирует флаг "изменено"
             const updated = await tokenData.save();
             console.log('Токен обновлён вручную через сейв', updated)
             return updated;
        }

        try {
            const newToken = await Token.create({ userId, refreshToken });
            console.log('[saveToken] созданный refreshToken в БД:', newToken.refreshToken);
            return newToken;
        } catch (err) {
            console.error('Ошибка при создании токена:', err);
            throw err;
        }
    }


    async removeToken(refreshToken) {
        console.log('refreshToken',refreshToken);
        const tokenData = await Token.findOne({where: {refreshToken: refreshToken}});
        console.log('tokenData', tokenData);

        const number = await Token.destroy({where: {refreshToken: refreshToken}});
        console.log('Удалено записей в БД', number);
        return tokenData;
    }

    validateAccessToken(accessToken) {
        try {
            return jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
           } catch (e) {
            return null;
        }
    }

    validateRefreshToken(refreshToken) {
        try {
            return  jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
            } catch (e) {
            return null;
        }
    }
    async findToken(refreshToken) {
        console.log('refreshToken поступивший в функцию из куки',refreshToken);
        const tokens = await Token.findAll();
        console.log('tokens в базе данных:', tokens);

        const tokenData = await Token.findOne({where: {refreshToken: refreshToken}});
        console.log('tokenData', tokenData);
       return tokenData;
    }



}