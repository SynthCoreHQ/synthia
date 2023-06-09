import { data } from './settings/data.js';
import { Client } from './helpers/Client.js';
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

client.initialize({ token: data.token });

process.on('warning', (warning) => {
    console.log(warning.stack);
});

