import { EmbedBuilder } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class AutoplayCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'autoplay';
        this.description = 'Wanna toggle the autoplay? Use me to do so!';
        this.module = 'Music';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const { client } = this;

        try {
            // const queue = this.client.player.nodes.get(interaction.guild.id);

            // if (!queue) {
            //     return await interaction.reply('Empty Queue!');
            // }

            // const autoplay = queue.node;
            // return await interaction.reply({
            //     embeds: [
            //         new EmbedBuilder()
            //             .setTitle(`${client.emotes.right} | Autoplay: \`${autoplay
            //                 ? 'On'
            //                 : 'Off'}\``)
            //             .setColor(client.config.embeds.aestheticColor),
            //     ],
            //     ephemeral: true,
            // });

            return await this.broadcastRespone(interaction, { message: 'This Command is under development' });
        } catch (e) {
            client.logger.error(e.stack);
        }
    }
}
