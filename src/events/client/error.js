import { Events } from 'discord.js';
import { Event } from '../../helpers/Event.js';

export default class ErrorEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.Error;
    }

    /**
     * @param {Error} error
     */
    async execute(client, error) {
        client.logger.error(import.meta.url, error);
    }
}
