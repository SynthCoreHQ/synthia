import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class TestCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'test';
        this.description = 'Just a test command commonly used for development purposes.';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        interaction.reply('Test success!');
    }
}
