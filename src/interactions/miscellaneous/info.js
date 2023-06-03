import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class InfoCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'info';
        this.description = 'Wanna gather some info? Use me to do so!';
        this.options = [
            {
                name: 'user',
                description: 'Is it a user?',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'input',
                        description: 'Specify the user!',
                        required: true,
                        type: ApplicationCommandOptionType.User,
                    },
                ],
            },
            {
                name: 'server',
                description: 'Is it a server?',
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: 'role',
                description: 'Is it a role?',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'input',
                        description: 'Specify the role!',
                        required: true,
                        type: ApplicationCommandOptionType.Role,
                    },
                ],
            },
            {
                name: 'channel',
                description: 'Is it a channel?',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'input',
                        description: 'Specify the channel!',
                        required: true,
                        type: ApplicationCommandOptionType.Channel,
                    },
                ],
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
