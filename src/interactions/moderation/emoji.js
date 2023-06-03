import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class EmojiCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'emoji';
        this.description = 'Want to configure the server emojis? Use me to do so!';
        this.module = 'Moderation';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        try {
            return await interaction.reply('This command is under development right now!');
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
