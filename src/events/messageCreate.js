import { EmbedBuilder, Events, MessageType, bold, inlineCode } from 'discord.js';
import { Event } from '../helpers/Event.js';

export default class MessageCreateEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.MessageCreate;
    }

    /**
     * @param {import('../helpers/client/Client.js').Client} client
     * @param {import('discord.js').Message} message
     */
    // eslint-disable-next-line max-statements
    async execute(client, message) {
        const _guildData = message.guild ? await client.guild_data.ensure(message.guild.id, this.configuration.default_guild_data) : null;
        const mentions = [`<@!${this.discordClient.user.id}>`, `<@${this.discordClient.user.id}>`];

        if (message.author.bot) return;

        const dynamicPrefix = message.guild
            ? _guildData.prefix
            : client.config.default_prefix;

        if (mentions.includes(message.content)) {
            return client.send({
                channel: message.channel,
                embed_data: [client.embed({ title: 'Getting Started', description: `Current prefix is ${inlineCode(dynamicPrefix)}`, type: 'primary' })]
            })
        }

        if (!message.content.startsWith(dynamicPrefix)) return;

        const args = message.content.slice(dynamicPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();

        /**
         * @type {import('../helpers/Command').Command}
         */
        const command = this.discordClient.commands.get(commandName) || this.discordClient.commands.get(this.discordClient.command_aliases.get(commandName));

        if (!command) return;

        if (command.is_disabled) {
            return client.send({
                channel: message.channel,
                embed_data: [client.embed({ title: 'Warning', description: `The \`${command.name}\` command is currently disabled.`, type: 'warning' })]
            });
        }

        if (command.for_guilds && !message.guild) {
            return client.send({
                channel: message.channel,
                embed_data: [client.embed({ title: 'Warning', description: `The \`${command.name}\` command is only available in guilds.`, type: 'warning' })]
            });
        }

        if (command.for_owners && message.author.id !== message.guild.ownerId) {
            return client.send({
                channel: message.channel,
                embed_data: [client.embed({ title: 'Warning', description: `The \`${command.name}\` command is only available to the guild owner.`, type: 'warning' })]
            });
        }

        if (command.for_developers && !this.configuration.developers.includes(message.author.id)) {
            return client.send({
                channel: message.channel,
                embed_data: [client.embed({ title: 'Warning', description: `The \`${command.name}\` command is only available to developers.`, type: 'warning' })]
            });
        }

        if (command.required_permissions) {
            if (!message.member.permissions.has(command.required_permissions)) {
                return client.send({
                    channel: message.channel,
                    embed_data: [client.embed({ title: 'Warning', description: `You are missing the following permissions: ${command.required_permissions.join(', ')}`, type: 'warning' })]
                });
            }

            if (!message.guild.members.me.permissions.has(command.required_permissions)) {
                return client.send({
                    channel: message.channel,
                    embed_data: [client.embed({ title: 'Warning', description: `I am missing the following permissions: ${command.required_permissions.join(', ')}`, type: 'warning' })]
                });
            }
        }

        if (this.discordClient.cooldown(command, message.author)) {
            return client.send({
                channel: message.channel,
                embed_data: [client.embed({ title: 'Warning', description: `${bold('Slow Down!')} Please wait ${inlineCode(client.cooldown(command, message.author))} second(s) before reusing ${inlineCode(command.name)} command.`, type: 'warning' })]
            });
        }

        try {
            await message.channel.sendTyping();
            await command.execute(this.discordClient, message, args);
        } catch (error) {
            this.discordClient.logger.error(import.meta.url, error)
            await client.send({
                channel: message.channel,
                embed_data: [client.embed({ title: 'Error', description: `An error occurred while executing the \`${command.name}\` command. (reported)`, type: 'error' })]
            })
        }
    }
}
