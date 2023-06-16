import { ChannelType, Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';

export default class GuildCreateEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.GuildCreate;
    }

    /**
     * @param {import('discord.js').Guild} guild
     */
    async executeEvent(guild) {
        const channel = guild.channels.cache
            .filter((ch) => ch.type === ChannelType.GuildText)
            .find((c) => c.position === 0);

        await this.client.ensureGuildData(guild.id);
        const guildData = await this.client.guildData.get(guild.id);

        await channel.send({
            embeds: [
                {
                    title: this.client.config.embeds.title.replace(/{text}/g, 'Getting Started'),
                    description: 'Thanks for adding me to your server!',
                    fields: [
                        {
                            name: 'Prefix',
                            value: `My prefix is \`${guildData.prefix}\``,
                        },
                        {
                            name: 'Help',
                            value: `To get started, type \`${guildData.prefix}help\``,
                        },
                        {
                            name: 'Support',
                            value: `If you need help, join the [support server](${this.client.config.guild.inviteCode})`,
                        },
                    ],
                    color: this.client.config.embeds.aestheticColor,
                },
            ],
        });
    }
}
