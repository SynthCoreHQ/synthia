import { ChannelType, Events, inlineCode } from 'discord.js';
import { Event } from '../helpers/Event.js';

export default class GuildCreateEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.GuildCreate;
    }

    /**
     * @param {import('../helpers/client/Client.js').Client} client
     * @param {import('discord.js').Guild} guild
     */
    async execute(client, guild) {
        const data = await client.guild_data.ensure(guild.id, this.configuration.default_guild_data);
        // await client.user_data.ensure(guild.ownerId, this.configuration.default_user_data);
        // const backup = await client.backup.create(guild, { jsonSave: true, backupMembers: true, maxMessagesPerChannel: 0 });

        // await client.user_data.push(`${guild.ownerId}.backup_ids`, backup.id);
        // get first channel that the bot can send messages to
        const channel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has('SendMessages'));

        await client.send({
            channel,
            embed_data: [client.embed({ title: 'Getting Started', description: `🎉 Thanks for inviting me to the server\nServer has been saved to the database! use ${inlineCode(`${this.configuration.default_prefix}setup`)} to customize it.`, type: 'primary' })]
        });
    }
}
