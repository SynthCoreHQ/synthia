import { Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';

export default class WarnEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.Warn;
    }

    /**
     * @param {string} message
     */
    async executeEvent(message) {
        this.client.logger.warn(message);
    }
}
