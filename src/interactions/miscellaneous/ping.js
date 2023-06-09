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
        const { config } = this.client;

        try {
            await interaction.reply({
                embeds: [
                    {
                        title: config.commands.embeds.title.replace(/{text}/, 'Ping'),
                        description: [
                            '> **Websocket Ping**: {ping}ms'.replace(/{ping}/, this.client.ws.ping),
                        ].join('\n'),
                        color: config.commands.embeds.aestheticColor,
                    },
                ],
            });
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
