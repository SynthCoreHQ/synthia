import { EmbedBuilder } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class PauseCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'pause';
        this.description = 'Wanna pause the current song? Use me to do so!';
        this.module = 'Music';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const { client } = this;
        const queue = this.client.player.nodes.get(interaction.guild.id);

        if (!queue) {
            return await interaction.reply('Empty Queue!');
        }

        try {
            if (queue.node.isPaused()) {
                return await interaction.reply({
                    content: `${client.emotes.wrong} | The queue is already paused!`,
                    ephemeral: true,
                });
            }

            queue.node.pause();
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.emotes.right} | Paused!`)
                        .setColor(client.config.commands.embeds.aestheticColor),
                ],
                ephemeral: true,
            });
        } catch (e) {
            client.logger.error(e.stack);
        }
    }
}
