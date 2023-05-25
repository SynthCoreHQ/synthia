import { Colors } from 'discord.js';

export default {
    clientId: process.env['BOT_ID'] || '',
    guildId: process.env['GUILD_ID'] || '',
    commandDeployMode: true,
    developers: ['953235785782534174'],
    debug: false,
    embeds: {
        color: {
            primary: Colors.Blurple,
            secondary: 0x2b2d31,
            warning: Colors.Yellow,
            danger: Colors.Red,
        },
    },
};
