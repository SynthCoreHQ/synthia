import { Events } from 'discord.js';

export default {
    name: Events.Debug,

    /**
     * @param {import('../helpers/Client.js').Client} client
     */
    run: async (client, message) => {
        client.logger.debug(message);
    },
};
