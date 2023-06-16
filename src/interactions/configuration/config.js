import { EmbedBuilder } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class ConfgCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'config';
        this.description = 'Check the current configuration of the bot';
        this.module = 'Configuration';
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        const { client } = this;
        const { guild } = interaction;

        try {
            const guildData = await client.guildData.get(guild.id);
            const welcomeData = guildData.welcome.enabled
                ? [
                    `Channel: <#${guildData.welcome.channel}>`,
                    `Message: ${guildData.welcome.message}`,
                ].join('\n')
                : 'Disabled';
            const leaveData = guildData.leave.enabled
                ? [
                    `Channel: <#${guildData.leave.channel}>`,
                    `Message: ${guildData.leave.message}`,
                ].join('\n')
                : 'Disabled';

            const embed = new EmbedBuilder()
                .setTitle('Configuration')
                .setDescription('Here is the current configuration of the bot')
                .addFields(
                    { name: 'Prefix', value: guildData.prefix },
                    { name: 'Welcome', value: welcomeData },
                    { name: 'Leave', value: leaveData },
                );

            return await interaction.reply({ embeds: [embed] });
        } catch (e) {
            // this.client.logger.error(e);
            console.error(e);
        }
    }
}
