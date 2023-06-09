import { EmbedBuilder } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class StopCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'stop';
        this.description = 'Wanna stop the music? Use me to do so!';
        this.module = 'Music';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const { client } = this;

        try {
            const queue = this.client.player.nodes.get(interaction.guild.id);

            if (!queue) {
                return await interaction.reply('Empty Queue!');
            }

            queue.delete();
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.emotes.right} | Stopped the music.`)
                        .setColor(client.config.commands.embeds.aestheticColor),
                ],
                ephemeral: true,
            });
        } catch (e) {
            client.logger.error(e.stack);
        }
    }
}
