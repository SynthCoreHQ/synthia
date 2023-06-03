import chalk from 'chalk';
import { ApplicationCommandType } from 'discord.js';

export class InteractionCommand {
    /**
     * @param {import('../Client.js').Client} DiscordjsClient
     */
    constructor(DiscordjsClient) {
        this.client = DiscordjsClient;

        this.type = ApplicationCommandType.ChatInput;
        this.module = 'Miscellaneous';
        this.cooldown = 5_000;
        this.disabled = false;
    }

    async executeCommand() {
        throw new Error(`Class ${chalk.redBright(this.constructor.name)} doesn't have a ${chalk.yellowBright('executeCommand')} method.`);
    }
}
