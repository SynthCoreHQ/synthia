import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class ClearCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'clear_queue';
        this.description = 'Wanna clear the music queue? Use me to do so!';
        this.module = 'Music';
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        try {
            const queue = this.client.player.nodes.get(interaction.guild.id);

            if (!queue || !queue.node.isPlaying()) {
                return await interaction.reply('Empty Queue!');
            }

            if (queue.size < 2) {
                return await interaction.reply('The queue has no more tracks!');
            }

            queue.tracks.clear();

            return await interaction.reply('Cleared the queue!');
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
