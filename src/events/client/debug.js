import { Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';

export default class DebugEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.Debug;
    }

    /**
     * @param {string} message
     */
    async executeEvent(message) {
        this.client.logger.debug(message);
    }
}
