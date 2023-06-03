import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class MemberCountCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'membercount';
        this.description = 'Wanna check the total number of members? Use me to do so!';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        try {
            await interaction.reply('Coming Soon!');
        } catch (e) {
            this.client.logger.error(e.stack);
        }
    }
}
