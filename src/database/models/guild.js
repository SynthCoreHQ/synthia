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
        welcomeChannelId: DataTypes.STRING,
        adminRole: DataTypes.STRING,
        requestsChannelId: DataTypes.STRING,
        musicVoiceId: DataTypes.STRING,
    },
    {
        timestamps: false,
    },
);
