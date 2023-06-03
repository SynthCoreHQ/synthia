import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class TimeoutCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'timeout';
        this.description = 'Wanna timeout a bad user? Use me to do so!';
        this.module = 'Moderation';
        this.options = [
            {
                name: 'user',
                description: 'Who are we kicking?',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'duration',
                description: 'Specify the duration',
                type: ApplicationCommandOptionType.Number,
            },
            {
                name: 'reason',
                description: 'Is there a specific reason behind kicking? You can specify it here.',
                type: ApplicationCommandOptionType.String,
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
