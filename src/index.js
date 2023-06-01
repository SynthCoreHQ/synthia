import { data } from './settings/data.js';
import { Client } from './helpers/Client.js';
import { Sequelize } from 'sequelize';
import { Partials } from 'discord.js';

const client = new Client(
    {
        intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'GuildVoiceStates'],
        partials: [
            Partials.User,
            Partials.Channel,
            Partials.Message,
            Partials.GuildMember,
        ],
        allowedMentions: { parse: ['everyone', 'users', 'roles'], repliedUser: false },
    }, data);

export const database = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

client.initialize({ token: data.token });
