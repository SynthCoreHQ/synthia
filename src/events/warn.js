import { Events } from 'discord.js';

export default {
    name: Events.Warn,

    /**
     * @param {import('../helpers/Client.js').Client} client
     */
    run: async (client, message) => {
        client.logger.warn(message);
    },
};
