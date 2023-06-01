import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';

export default {
    name: 'avatar',
    description: "Trying to spy avatar's? Use me to see user avatar's",
    type: 1,
    aliases: [],
    options: [
        {
            name: 'user',
            description: "Who's the user?",
            type: ApplicationCommandOptionType.User,
        },
    ],
    cooldown: 5,
    category: 'Utility',
    ownerOnly: false,
    disabled: false,
    developerOnly: false,

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const o = interaction.options.getUser('user');

        const user = o
            ? await o.fetch()
            : await interaction.user.fetch();

        const avatarEmbed = new EmbedBuilder()
            .setTitle(user.username)
            .setImage(user.displayAvatarURL({ forceStatic: false, size: 512 }))
            .setColor(client.config.commands.embeds.color);

        const avatarButtonComponent = new ButtonBuilder()
            .setLabel('Avatar URL')
            .setStyle(ButtonStyle.Link)
            .setURL(user.avatarURL({ size: 512, forceStatic: false }));

        const actionRow = new ActionRowBuilder().addComponents(
            avatarButtonComponent,
        );

        return await interaction.reply({
            embeds: [avatarEmbed],
            components: [actionRow],
            ephemeral: true,
        });
    },
};
