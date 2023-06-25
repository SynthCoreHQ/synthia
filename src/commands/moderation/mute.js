import { PermissionFlagsBits } from 'discord.js';
import { Command } from '../../helpers/Command.js';

export default class MuteCommand extends Command {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = 'mute';
        this.description = 'Timeout a user from the server for a specified amount of time.';
        this.aliases = ['timeout'];
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
        const time = args[1] || 5;
        const reason = args.slice(2).join(' ') || 'No reason provided';

        if (!member) {
            return message.reply('You need to mention a member to timeout!');
        }

        await member.timeout(time * 60000, reason);

        return client.send({
            channel: message.channel,
            content: `Successfully timed out ${member.user.tag} for ${time} minutes!`,
        });
    }
}
