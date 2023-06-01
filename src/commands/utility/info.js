import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'info',
    description: 'Wanna gather some info? Use me to do so!',
    type: 1,
    aliases: [],
    options: [
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
    ],
    cooldown: 5,
    category: 'Moderation',
    example: 'timeout @user [duration] <reason>',
    ownerOnly: false,
    disabled: false,
    developerOnly: false,
    userPermissions: [],
    botPermissions: [],

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.reply('Coming Soon!');
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};
