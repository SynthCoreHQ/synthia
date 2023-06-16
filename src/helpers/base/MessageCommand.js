import chalk from 'chalk';

export class MessageCommand {
    /**
     * @param {import('../Client.js').Client} DiscordjsClient
     */
    constructor(DiscordjsClient) {
        this.client = DiscordjsClient;

        this.name = '';
        this.description = '';
        this.aliases = [];
        this.usage = '';
        this.module = 'Miscellaneous';
        this.cooldown = 5;
        this.disabled = false;
    }

    async executeCommand() {
        throw new Error(`Class ${chalk.redBright(this.constructor.name)} doesn't have a ${chalk.yellowBright('executeCommand')} method.`);
    }

    /**
     * @param {import('discord.js').Message} message
     * @param {string} input
     */
    async broadcastRespone(message, input) {
        return await message.reply(input);
    }

    /**
     * @param {import('discord.js').Message} message
     * @param {import('discord.js').EmbedData} embeds
     */
    async broadcastEmbeddedRespone(message, ...embeds) {
        return await message.reply(
            { embeds: embeds },
        );
    }
}
