import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Trying to spy avatar's? Use me to see user avatar's")
        .addUserOption((option) => option.setName('user').setDescription("Who's the user?"))
        .setDMPermission(true),
    options: {
        developerOnly: false,
        disabled: false,
        ownerOnly: false,
        category: 'Utility',
        cooldown: 5,
    },

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const o = interaction.options.getUser('user');

        const user = o ? await o.fetch() : await interaction.user.fetch();

        const avatarEmbed = new EmbedBuilder()
            .setTitle(user.username)
            .setImage(user.displayAvatarURL({ forceStatic: false, size: 512 }))
            .setColor(client.config.embeds.color.primary);

        const avatarButtonComponent = new ButtonBuilder()
            .setLabel('Avatar URL')
            .setStyle(ButtonStyle.Link)
            .setURL(user.avatarURL({ size: 512, forceStatic: false }));

        const actionRow = new ActionRowBuilder().addComponents(avatarButtonComponent);

        return await interaction.reply({
            embeds: [avatarEmbed],
            components: [actionRow],
            ephemeral: true,
        });
    },
};
