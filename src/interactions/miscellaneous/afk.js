import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class AfkCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'afk';
        this.description = 'Are you away from keyboard? Use me to broadcast it.';
        this.options = [
            {
                name: 'reason',
                description: 'Is there a specific reason behind being away from keyboard? You can specify it here.',
                type: ApplicationCommandOptionType.String,
            },
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        return await interaction.reply({ content: 'This command is currently disabled.' });
    }
}
