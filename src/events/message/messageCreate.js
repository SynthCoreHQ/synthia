import { EmbedBuilder, Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';

export default class MessageCreateEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.MessageCreate;
    }

    /**
     * @param {import('discord.js').Message} message
     */
    // eslint-disable-next-line max-statements
    async executeEvent(message) {
        if (message.author.bot) return;

        const guildData = await this.client.guildData.ensure(message.guildId, {
            prefix: this.client.config.globalPrefix,
            welcome: {
                enabled: false,
                channel: null,
                message: null,
            },
            leave: {
                enabled: false,
                channel: null,
                message: null,
            },
        });

        const dynamicPrefix = message.guild
            ? guildData.prefix
            : this.client.config.globalPrefix;

        if (message.content === `<@!${this.client.user.id}>` || message.content === `<@${this.client.user.id}>`) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Prefix')
                        .setDescription(`My prefix is \`${dynamicPrefix}\``)
                        .setColor('Aqua'),
                ],
            });
        }

        if (!message.content.startsWith(dynamicPrefix)) return;

        // eslint-disable-next-line max-len
        const args = message.content.slice(dynamicPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();

        // eslint-disable-next-line max-len
        const command = this.client.messageCommands.get(commandName) || this.client.messageCommands.get(this.client.aliases.get(commandName));

        if (!command) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription(`There is no command with name \`${commandName}\`.`)
                        .setColor('Red'),
                ],
            });
        }

        if (command.guildOnly && !message.guild) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('This command is only available in servers.')
                        .setColor('Red'),
                ],
            });
        }

        if (command.ownerOnly && message.author.id !== message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('This command is only available to server owner.')
                        .setColor('Red'),
                ],
            });
        }

        if (command.nsfw && !message.channel.nsfw) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('This command is only available in NSFW channels.')
                        .setColor('Red'),
                ],
            });
        }

        if (command.args && !args.length) {
            let reply = 'You did not provide any arguments.';

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${dynamicPrefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription(reply)
                        .setColor('Red'),
                ],
            });
        }

        if (this.client.cooldown(command, message.author)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription(`Please wait ${this.client.cooldown(command, message.author)} more second(s) before reusing the \`${command.name}\` command.`)
                        .setColor('Red'),
                ],
            });
        }

        try {
            await command.executeCommand(message, args);
        } catch (error) {
            console.error(error);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('There was an error trying to execute that command.')
                        .setColor('Red'),
                ],
            });
        }
    }
}
