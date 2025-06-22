import User from './userModel.mjs';
import Token from './tokenModel.mjs';

User.hasOne(Token, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Token.belongsTo(User, {
    foreignKey: 'userId'
});

export { User, Token };
