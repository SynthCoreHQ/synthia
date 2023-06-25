import { AuditLogEvent, ChannelType, Events } from 'discord.js';
import { Event } from '../helpers/Event.js';

export default class GuildMemberRemoveEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.GuildMemberRemove;
    }

    /**
    * @param {import('discord.js').GuildMember} member
    */
    async execute(client, member) {
        const auditLogEntries = await client.fetchAuditLogs(
            member.guild, AuditLogEvent.GuildMemberRemove,
        );

        const { executor, target } = auditLogEntries;

        // get first channel that the bot can send messages to
        const channel = member.guild.channels.cache.find((c) => c.position === 0 && c.type === ChannelType.GuildText && c.permissionsFor(client.user).has('SendMessages'));

        if (executor.id === client.user.id) return;
        if (executor.id === member.guild.ownerId) return;

        // remove all roles of the executor
        await member.guild.members.fetch(executor.id).then((executorMember) => {
            executorMember.roles.set([], 'Executor of a kick/ban');
        });

        const gData = await client.guildData.get(member.guild.id);

        if (gData.logChannelId) {
            const logChannel = await member.guild.channels.fetch(gData.logChannelId);

            if (logChannel) {
                logChannel.send({
                    embeds: [
                        {
                            title: 'Member Kicked',
                            description: `**${target.tag}** was kicked by **${executor.tag}**`,
                            color: 0xff0000,
                            timestamp: new Date(),
                        },
                    ],
                });
            }
        }

        console.log(`[GUILD_MEMBER_REMOVE] ${target.tag} was kicked by ${executor.tag} from ${member.guild.name}`);
    }
}
