import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class AvatarCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'avatar';
        this.description = "Trying to spy avatar's? Use me to see user avatar's";
        this.options = [
            {
                name: 'user',
                description: "Who's the user?",
                type: ApplicationCommandOptionType.User,
            },
        ];
    }

    async executeCommand(interaction) {
        const o = interaction.options.getUser('user');

        const user = o
            ? await o.fetch()
            : await interaction.user.fetch();

        const avatarEmbed = new EmbedBuilder()
            .setTitle(user.username)
            .setImage(user.displayAvatarURL({ forceStatic: false, size: 512 }))
            .setColor(this.client.config.embeds.color);

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
    }
}
