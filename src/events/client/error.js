import { Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';

export default class ErrorEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.Error;
    }

    /**
     * @param {Error} error
     */
    async executeEvent(error) {
        this.client.logger.error(error);
    }
}
