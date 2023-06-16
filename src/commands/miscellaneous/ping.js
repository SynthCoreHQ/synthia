import { MessageCommand } from '../../helpers/base/MessageCommand.js';

export default class PingCommand extends MessageCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'ping';
        this.description = 'Is the bot even working? use me and test it.';
        this.aliases = ['p'];
    }

    /**
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async executeCommand(message, args) {
        await message.reply({
            content: [
                `> Message Latency is ${Date.now() - message.createdTimestamp}ms.`,
                `> Websocket Ping is ${Math.round(this.client.ws.ping)}ms.`,
            ].join('\n'),
        });
    }
}
