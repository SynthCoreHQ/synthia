import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Command } from '../../helpers/Command.js';
import { Client } from '../../helpers/client/Client.js';

export default class SetupCommand extends Command {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = 'setup';
        this.description = 'Setup the bot for your server';
        this.aliases = ['configure'];
        this.cooldown = 5;
        this.usage = 'setup';
        this.module = 'Configuration';
        this.for_developers = false;
        this.for_guilds = false;
        this.for_owners = true;
        this.is_disabled = false;
        this.required_permissions = [PermissionFlagsBits.SendMessages];
    }

    /**
    * @param {Client} client
    * @param {import('discord.js').Message} message
    * @param {string[]} args
    */
    async execute(client, message, args) {
        await client.guild_data.ensure(message.guild.id, this.configuration.default_guild_data);
        const channel = await message.guild.channels.create({
            name: '🔒┃action-logs',
            type: ChannelType.GuildText,
            topic: 'All action logs will be sent here',
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                }
            ],
        });

        await client.guild_data.update(message.guild.id, { reports_channel_id: channel.id });

        return await client.send({
            channel: message.channel,
            embed_data: [
                client.embed({
                    title: 'Setup',
                    description: `🎉 Setup has been completed!`,
                    type: 'primary',
                })
            ]
        })
    }
}