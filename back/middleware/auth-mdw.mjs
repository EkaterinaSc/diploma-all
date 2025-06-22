import ApiError from "../errors/api-errors.mjs";
import TokenService from "../service/token-service.mjs";
const tokenService = new TokenService();

const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData;
        next();

    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}

export default authMiddleware;