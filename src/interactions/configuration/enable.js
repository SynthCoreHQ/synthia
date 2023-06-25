import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class EnableCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'enable';
        this.description = 'Can be used to enable a module.';
        this.module = 'Configuration';
        this.options = [
            {
                name: 'module',
                type: ApplicationCommandOptionType.String,
                description: 'The module you want to enable.',
                required: true,
                choices: ['Moderation', 'Configuration', 'Miscellaneous', 'Information', 'Administration'].map((module) => ({ name: module, value: module.toLowerCase() })),
            },
        ];
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        await interaction.reply('This command is not yet implemented.');
    }
}
