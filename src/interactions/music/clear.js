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

            await this.client.player._clearMusicQueue(interaction, {
                queue: queue,
            });

            return await this.broadcastRespone(interaction, { message: 'Cleared the queue!', hidden: true });
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
