import { data } from './settings/data.js';
import { Client } from './helpers/Client.js';
import { Sequelize } from 'sequelize';

const client = new Client({ intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'GuildVoiceStates'] }, data);

export const database = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

client.initialize({ token: data.token });
