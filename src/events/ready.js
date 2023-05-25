import chalk from 'chalk';
import { ActivityType, Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    /**
     *
     * @param {import('../helpers/Client.js').Client} client
     */
    run: async (client) => {
        client.logger.info(chalk.greenBright('ClientReady'), `${chalk.cyan(client.user.username)} has been started!`);
        client.user.setActivity({ name: `${client.guilds.cache.size} guilds.`, type: ActivityType.Listening });
        client.guilds.cache.each((guild) => {
            client.logger.debug(`${chalk.magentaBright('Guild')}: ${guild.name} (${guild.id})`);
        });
    },
};
