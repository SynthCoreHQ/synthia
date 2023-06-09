import chalk from 'chalk';
import { ActivityType, Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';

export default class ReadyEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.ClientReady;
        this.once = true;
    }

    async executeEvent() {
        this.client.logger.info(chalk.greenBright('ClientReady'), `${chalk.cyan(this.client.user.username)} has been started!`);
        this.client.user.setActivity({
            name: this.client.config.presenceStatus,
            type: ActivityType.Listening,
        });
        this.client.guilds.cache.each((guild) => {
            this.client.logger.debug(`${chalk.magentaBright('Guild')}: ${guild.name} (${guild.id})`);
        });

        this.client.database.sync().then(() => {
            this.client.logger.info(`${chalk.greenBright('Database')}`, 'Database has been synchronized.');
        });
    }
}
