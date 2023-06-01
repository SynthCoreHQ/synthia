import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

export default {
    name: 'ban',
    description: 'Wanna ban a bad user? Use me to do so!',
    type: 1,
    aliases: [],
    options: [
        {
            name: 'user',
            description: 'Who are we banning?',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'Is there a specific reason behind banning? You can specify it here.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    cooldown: 5,
    category: 'Administration',
    example: 'ban @user <reason>',
    ownerOnly: false,
    disabled: false,
    developerOnly: false,
    userPermissions: ['KickMembers'],
    botPermissions: ['KickMembers'],

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'N/A';

            await interaction.guild.members.ban(user, { reason: reason });
            await interaction.reply(`${user?.username} has been banned!\n\nReason: **${reason}**\nAdmin: ${interaction?.user}`);
        } catch (e) {
            client.logger.error(e.stack);
            return await interaction.reply('Sorry unable to ban!');
        }
    },
};
