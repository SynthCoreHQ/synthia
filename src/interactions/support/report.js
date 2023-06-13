import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class ReportCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'report_bug';
        this.description = 'Allows you to report a user/bug to the developers!';
        this.module = 'Support';
        this.options = [
            {
                name: 'bug',
                description: 'The bug to report',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ];
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
