import { Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';
import { Guild } from '../../database/models/guild.js';

export default class GuildCreateEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.GuildCreate;
    }

    /**
     * @param {import('discord.js').Guild} guild
     */
    async executeEvent(guild) {
        this.client.logger.error(`New Guild: ${guild.name}`);
        await Guild.create({ id: guild.id });
    }
}
