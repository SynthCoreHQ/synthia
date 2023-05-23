import chalk from 'chalk';
import { Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    /**
     *
     * @param {import('../helpers/Client.js').Client} client
     */
    run: async (client) => {
        client.logger.info(chalk.greenBright('ClientReady'), `${chalk.cyan(client.user.username)} has been started!`);
    },
};
