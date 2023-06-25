import { Events } from 'discord.js';
import { Event } from '../../helpers/Event.js';

export default class DebugEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.Debug;
    }

    /**
     * @param {string} message
     */
    async execute(client, message) {
        client.logger.debug(import.meta.url, message);
    }
}
