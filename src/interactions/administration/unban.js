import { ApplicationCommandOptionType, bold, inlineCode } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class UnbanCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'unban';
        this.description = 'Wanna unban a banned user? Use me to do so!';
        this.module = 'Administration';
        this.options = [
            {
                name: 'user',
                description: 'Who are we unbanning?',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
        ];
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        const member = interaction.options.getUser('user');

        try {
            await interaction.guild.members.unban(member, `Unbanned by ${interaction.user.username}`);

            return await this.broadcastRespone(interaction, {
                message: [
                    `${bold(member.username)} has been unbanned!`,
                    '',
                    `> ${bold('Admin')}: ${inlineCode(interaction.user.username)}`,
                    `> ${bold('Timestamp')}: <t:${Math.round(interaction.createdTimestamp / 1000)}:R>`, // eslint-disable-line new-cap
                ].join('\n'),
                // hidden: true,
            });
        } catch (e) {
            // this.client.logger.error(e);
            console.error(e);
        }
    }
}
