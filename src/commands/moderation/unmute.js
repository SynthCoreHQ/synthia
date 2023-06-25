import { PermissionFlagsBits, inlineCode } from 'discord.js';
import { Command } from '../../helpers/Command.js';

export default class UnmuteCommand extends Command {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = 'unmute';
        this.description = 'Remove a timeout from a user';
        this.aliases = ['untimeout'];
        this.cooldown = 5;
        this.usage = '';
        this.module = 'Moderation';
        this.for_developers = false;
        this.for_guilds = false;
        this.for_owners = false;
        this.is_disabled = false;
        this.required_permissions = [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageMessages];
    }

    /**
    * @param {import('../../helpers/client/Client.js').Client} client
    * @param {import('discord.js').Message} message
    * @param {string[]} args
    */
    async execute(client, message, args) {
        const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member) {
            return message.reply('You need to mention a member to remove timeout!');
        }

        await member.timeout(null, reason)

        return client.send({
            channel: message.channel,
            content: `Successfully removed timeout from ${inlineCode(member.user.tag)}!`,
        });
    }
}
