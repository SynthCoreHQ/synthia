import { EmbedBuilder } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class DisconnectCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'disconnect';
        this.description = 'Dont want me in the voice channel? Use me to disconnect me!';
        this.module = 'Music';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const { client } = this;

        try {
            // await interaction.reply({
            //     embeds: [
            //         new EmbedBuilder()
            //             .setTitle(`${client.emotes.right} | Disconnected...`)
            //             .setColor(client.config.embeds.aestheticColor),
            //     ],
            //     ephemeral: true,
            // });

            return await interaction.reply('This command is under development!');
        } catch (e) {
            client.logger.error(e.stack);
        }
    }
}
