import { EmbedBuilder, bold, hyperlink, inlineCode } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class NowplayingCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'nowplaying';
        this.description = 'Wanna check the current playing music? Use me to do so!';
        this.module = 'Music';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const { client } = this;
        const queue = this.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.node.isPlaying()) {
            return await interaction.reply('Empty Queue!');
        }

        try {
            const track = queue.currentTrack;
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(client.config.embeds.title.replace(/{text}/, 'NowPlaying'))
                        .setURL(track.url)
                        .setDescription(`${track.title}\nPlayed by: ${track.requestedBy.toString()}\n${queue.node.createProgressBar()}`)
                        .setColor(client.config.embeds.aestheticColor),
                ],
                ephemeral: true,
            });
        } catch (e) {
            client.logger.error(e.stack);
        }
    }
}
