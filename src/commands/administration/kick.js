import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'kick',
    description: 'Wanna kick a bad user? Use me to do so!',
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
            name: 'reason',
            description: 'Is there a specific reason behind kicking? You can specify it here.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    cooldown: 5,
    category: 'Moderation',
    example: 'kick @user <reason>',
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
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'N/A';


            await interaction.guild.members.kick(user, reason);
            await interaction.reply(`${user?.username} has been kicked!\n\nReason: **${reason}**\nAdmin: ${interaction?.user}`);
        } catch (e) {
            client.logger.error(e.stack);
            return await interaction.reply('Sorry unable to kick!');
        }
    },
};
