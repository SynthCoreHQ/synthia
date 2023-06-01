import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'banner',
    description: "Wanna check a user's banner? Use me to do so!",
    type: 1,
    aliases: [],
    options: [
        {
            name: 'user',
            description: 'Who are we kicking?',
            type: ApplicationCommandOptionType.User,
        },
    ],
    cooldown: 5,
    category: 'Utility',
    example: 'banner @user',
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
