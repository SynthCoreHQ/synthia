import { DataTypes } from 'sequelize';
import { database } from '../database.js';

export const Guild = database.define(
    'guild',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        prefix: {
            type: DataTypes.STRING,
            defaultValue: '&',
            allowNull: false,
        },
        welcomeChannelId: {
            type: DataTypes.STRING,
            unique: true,
        },
    },
    {
        timestamps: false,
    },
);
