import { PermissionFlagsBits } from 'discord.js';
import { Command } from '../../helpers/Command.js';

export default class PrefixCommand extends Command {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = 'prefix';
        this.description = 'Change the prefix of the bot';
        this.aliases = ['setprefix'];
        this.cooldown = 5;
        this.usage = 'prefix <new prefix>';
        this.module = 'Miscellaneous';
        this.for_developers = false;
        this.for_guilds = true;
        this.for_owners = false;
        this.is_disabled = false;
        this.required_permissions = [PermissionFlagsBits.ManageMessages];
    }

    /**
    * @param {import('discord.js').Message} message
    * @param {string[]} args
    */
    async execute(client, message, args) {
        const guild_data = await this.discordClient.guild_data.ensure(message.guildId, this.configuration.default_guild_data);
        const prefix = args[0];

        if (prefix) {
            if (prefix.length > 5) return message.channel.send('Prefix cannot be longer than 5 characters');

            await this.discordClient.guild_data.update(message.guildId, { prefix });

            return message.channel.send(`Prefix changed to \`${args[0]}\``);
        }

        return message.channel.send(`Current prefix is \`${guild_data.prefix}\``);
    }
}
