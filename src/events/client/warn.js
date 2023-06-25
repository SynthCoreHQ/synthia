import { Events } from 'discord.js';
import { Event } from '../../helpers/Event.js';

export default class WarnEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.Warn;
    }

    /**
     * @param {string} message
     */
    async execute(client, message) {
        client.logger.warn(import.meta.url, message);
    }
}