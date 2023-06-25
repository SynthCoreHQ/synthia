import { Command } from '../../helpers/Command.js';
import { Client } from '../../helpers/client/Client.js';

export default class PingCommand extends Command {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = 'ping';
        this.description = 'Fetches & returns the bot\'s latency.';
        this.aliases = ['p', 'latency', 'tps'];
        this.cooldown = 5;
        this.usage = 'ping';
        this.module = 'Miscellaneous';
        this.for_developers = false;
        this.for_guilds = false;
        this.for_owners = false;
        this.is_disabled = false;
        this.required_permissions = [];
    }

    /**
     * @param {Client} client
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(client, message, args) {
        await message.reply({
            content: [
                `> Message Latency is ${Date.now() - message.createdTimestamp}ms.`,
                `> Websocket Ping is ${Math.round(client.ws.ping)}ms.`,
            ].join('\n'),
        });
    }
}
