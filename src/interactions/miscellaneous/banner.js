import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class BannerCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'banner';
        this.description = "Wanna check a user's banner? Use me to do so!";
        this.options = [
            {
                name: 'user',
                description: 'Who are we kicking?',
                type: ApplicationCommandOptionType.User,
            },
        ];
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
