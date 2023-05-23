import { Events } from 'discord.js';

export default {
    name: Events.Debug,

    /**
     * @param {import('../helpers/Client.js').Client} client
     */
    run: async (client, message) => {
        if (client.config.debug) client.logger.debug(message);
    },
};
