import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class VolumeCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'volume';
        this.description = 'Wanna adjust the music volume? Use me to do so!';
        this.module = 'Music';
        this.options = [
            {
                name: 'input',
                description: 'Specify a digit between 0-100',
                type: ApplicationCommandOptionType.Integer,
                min_value: 1, // eslint-disable-line camelcase
                max_value: 200, // eslint-disable-line camelcase
            },
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const { client } = this;
        const volume = interaction.options.getInteger('input');

        try {
            const queue = this.client.player.nodes.get(interaction.guild.id);

            if (!queue) {
                return await interaction.reply('Empty Queue!');
            }

            if (!volume) {
                return await interaction.reply({
                    content: `Current Volume: ${queue.node.volume}%`,
                });
            }

            queue.node.setVolume(volume);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.emotes.right} | Set the volume to ${queue.node.volume}%`)
                        .setColor(client.config.embeds.aestheticColor),
                ],
                ephemeral: true,
            });
        } catch (e) {
            client.logger.error(e.stack);
        }
    }
}
