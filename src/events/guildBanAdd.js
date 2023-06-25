import { AuditLogEvent, Events } from 'discord.js';
import { Event } from '../helpers/Event.js';

export default class GuildBanAddEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.GuildBanAdd;
    }

    /**
    * @param {import('discord.js').GuildBan} ban
    */
    async execute(client, ban) {
        const auditLogEntries = await client.fetchAuditLogs(
            ban.guild, AuditLogEvent.MemberBanAdd,
        );

        const { executor, target } = auditLogEntries;

        if (executor.id === client.user.id) return;
        if (executor.id === ban.guild.ownerId) return;

        // remove all roles of the executor
        await ban.guild.members.fetch(executor.id).then((executorMember) => {
            executorMember.roles.set([], 'Executor of a kick/ban');
        });

        const gData = await client.guildData.get(ban.guild.id);

        if (gData.logChannelId) {
            const logChannel = await ban.guild.channels.fetch(gData.logChannelId);

            if (logChannel) {
                logChannel.send({
                    embeds: [
                        {
                            title: 'Member Banned',
                            description: `**${target.tag}** was banned by **${executor.tag}**`,
                            color: 0xff0000,
                            timestamp: new Date(),
                        },
                    ],
                });
            }
        }

        console.log(`[GUILD_BAN_ADD] ${target.tag} was kicked by ${executor.tag} from ${ban.guild.name}`);
    }
}
