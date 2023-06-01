import { Events } from 'discord.js';

export default {
    name: Events.GuildCreate,

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').Guild} guild
     */
    run: async (client, guild) => {
        client.logger.warn(`Joined! ${guild.name}`);
    },
};
