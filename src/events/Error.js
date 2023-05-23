import { Events } from 'discord.js';

export default {
    name: Events.Error,

    /**
     * @param {import('../helpers/Client.js').Client} client
     */
    run: async (client, error) => {
        client.logger.error(error);
    },
};
