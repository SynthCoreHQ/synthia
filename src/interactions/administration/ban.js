import { ApplicationCommandOptionType, bold, inlineCode } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class BanCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'ban';
        this.description = 'Want ban a bad user? Use me to do so!';
        this.module = 'Administration';
        this.options = [
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
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        try {
            const member = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || '';

            await interaction.guild.members.ban(member, { reason: reason });

            return await this.broadcastRespone(interaction, {
                message: [
                    `${bold(member.username)} has been banned!`,
                    '',
                    `> ${bold('Reason')}: ${inlineCode(reason || 'No Reason')}`,
                    `> ${bold('Admin')}: ${inlineCode(interaction.user.username)}`,
                    `> ${bold('Timestamp')}: <t:${Math.round(interaction.createdTimestamp / 1000)}:R>`,
                ].join('\n'),
                // hidden: true,
            });

            // return await interaction.reply(`${member.displayName} has been banned!\n\nReason: **${reason}**\nAdmin: ${interaction.user}`);
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
