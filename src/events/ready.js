import chalk from 'chalk';
import { ActivityType, Events } from 'discord.js';
import { Afk } from '../models/afk.js';

export default {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {import('../helpers/Client.js').Client} client
     */
    run: async (client) => {
        client.logger.info(chalk.greenBright('ClientReady'), `${chalk.cyan(client.user.username)} has been started!`);
        client.user.setActivity({
            name: client.config.presenceStatus,
            type: ActivityType.Listening,
        });
        client.guilds.cache.each((guild) => {
            client.logger.debug(`${chalk.magentaBright('Guild')}: ${guild.name} (${guild.id})`);
        });

        Afk.sync();
    },
};
