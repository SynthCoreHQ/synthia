import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'timeout',
    description: 'Wanna timeout a bad user? Use me to do so!',
    type: 1,
    aliases: [],
    options: [
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
