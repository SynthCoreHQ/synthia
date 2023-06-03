import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class KickCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'kick';
        this.description = 'Wanna kick a bad user? Use me to do so!';
        this.module = 'Administration';
        this.options = [
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
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        try {
            const member = interaction.options.getMember('user');
            const reason = interaction.options.getString('reason') || 'N/A';

            await interaction.guild.members.kick(member, reason);
            await interaction.reply(`${member.displayName} has been kicked!\n\nReason: **${reason}**\nAdmin: ${interaction.user.username}`);
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
