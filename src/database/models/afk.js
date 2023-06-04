import { DataTypes } from 'sequelize';
import { database } from '../database.js';

export const Afk = database.define(
    'afk',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        reason: {
            type: DataTypes.STRING,
            defaultValue: 'I am afk.',
            allowNull: false,
        },
    },
    {
        timestamps: false,
    },
);
