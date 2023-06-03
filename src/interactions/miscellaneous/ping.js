import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class PingCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'ping';
        this.description = 'Is the bot even working? use me and test it.';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        try {
            await interaction.reply({ embeds: [{ title: `My ping is: ${this.client.ws.ping}ms`, color: this.client.config.commands.embeds.aestheticColor }] });
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
