import { DataTypes } from 'sequelize';
import { database } from '../index.js';

export const Guild = database.define(
    'guild',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        prefix: {
            type: DataTypes.STRING,
            defaultValue: '!',
            allowNull: false,
        },
    },
    {
        timestamps: false,
    },
);
