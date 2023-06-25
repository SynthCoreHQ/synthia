import { ApplicationCommandOptionType, ChannelType, OverwriteType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class LogsCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'log';
        this.description = 'Set up logging for your server';
        this.module = 'Logging';
        this.options = [
            {
                name: 'log_channel',
                type: ApplicationCommandOptionType.Channel,
                description: 'The channel to send logs to (leave empty to create a new channel)',
            },
        ];
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        const channel = interaction.options.getChannel('log_channel', false, ChannelType.GuildText)
            || await interaction.guild.channels.create({
                name: `${this.client.user.username}-logs`,
                type: ChannelType.GuildText,
                topic: 'Logs for the server',
            });

        await this.client.guildData.update(interaction.guild.id, {
            logChannelId: channel.id,
        });

        await interaction.reply(`Logging channel set to ${channel}`);
    }
}
