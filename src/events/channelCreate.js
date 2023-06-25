import { AuditLogEvent, Events, GuildChannel, codeBlock } from 'discord.js';
import { Event } from '../helpers/Event.js';
import { Client } from '../helpers/client/Client.js';

export default class ChannelCreateEvent extends Event {
    constructor(client, configuration) {
        super(client, configuration);

        this.name = Events.ChannelCreate;
    }

    /**
     * @param {Client} client
     * @param {GuildChannel} channel
    */
    async execute(client, channel) {
        try {
            const guild_data = await client.guild_data.get(`${channel.guildId}`);
            const auditLogEntries = await client.fetchAuditLogs(channel.guild, AuditLogEvent.ChannelCreate);
            const { executor, target, createdTimestamp } = auditLogEntries;

            if (executor.id === client.user.id) return;
            if (executor.id === channel.guild.ownerId) return;

            const punished = await client.utility.punish(channel.guild, { target: executor, reason: 'Synthia Protection Shield', type: 'kick' });

            const log_channel = await client.utility.resolve_channel(guild_data.reports_channel_id);
            const report_embed = client.embed({
                title: 'Shield',
                description: `A channel has been deleted by ${executor}`,
                fields: [
                    { name: 'Channel', value: codeBlock(target.name), inline: true },
                    { name: 'Timestamp', value: `<:t${createdTimestamp / 1000}:R>`, inline: true },
                ],
                timestaps: true,
                type: 'warning'
            })

            log_channel ? await client.logger.report(log_channel, [report_embed]) : null;

            await channel.guild.channels.delete(target, 'Synthia Protection Shield');
        } catch (e) {
            console.error(e)
        }
    }
}
