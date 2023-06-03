import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class SetupCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'setup';
        this.description = 'Having trouble setting up the server? Use me to make it easy!';
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
