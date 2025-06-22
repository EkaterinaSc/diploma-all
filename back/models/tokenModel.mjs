import { DataTypes } from 'sequelize';
import sequelize from '../db.mjs';

const Token = sequelize.define('Token', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Users', // название таблицы в БД
            key: 'id',
        }
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export default Token;
