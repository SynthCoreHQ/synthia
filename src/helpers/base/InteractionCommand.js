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

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {{ message: string, hidden: boolean }} options
     */
    async broadcastRespone(interaction, options) {
        if (interaction.deferred) {
            return await interaction.editReply(
                { content: options.message },
            );
        }

        if (interaction.replied) {
            return await interaction.followUp(
                { content: options.message, ephemeral: options.hidden },
            );
        }

        return await interaction.reply(
            { content: options.message.toString(), ephemeral: options.hidden },
        );
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {{ embedData: import('discord.js').EmbedData, hidden: boolean }} options
     */
    async broadcastEmbeddedRespone(interaction, options) {
        // if (interaction.deferred) {
        //     return await interaction.editReply(
        //         { embeds: [...options.embedData] },
        //     );
        // }

        // if (interaction.replied) {
        //     return await interaction.followUp(
        //         { embeds: [...options.embedData], ephemeral: options.hidden },
        //     );
        // }

        return await interaction.reply(
            { embeds: [...options.embedData], ephemeral: options.hidden },
        );
    }
}
