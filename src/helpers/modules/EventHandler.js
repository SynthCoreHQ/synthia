import chalk from 'chalk';
import { BaseHandler } from '../base/BaseHandler.js';

export class EventHandler extends BaseHandler {
    constructor(client) {
        super(client);
    }

    // eslint-disable-next-line max-statements
    async loadEvents() {
        const { logger } = this.client;
        const { events } = this.paths;

        try {
            let count = 0;
            const files = this._loadFilesRecusrive(events);

            for (const file of files) {
                const Event = await import(`file://${file}`).then(f => f.default);
                const event = new Event(this.client);

                if (!event.name) {
                    throw new ReferenceError(`Class ${chalk.greenBright(event.constructor.name)} does not have the required property 'name'.`);
                }
                count += 1;

                if (event.once) {
                    this.client.once(event.name, (...args) => {
                        event.executeEvent(...args);
                    });
                } else {
                    this.client.on(event.name, (...args) => {
                        event.executeEvent(...args);
                    });
                }
            }

            logger.info(chalk.yellowBright('EventHandler'), `(${count}) events loaded.`);
        } catch (err) {
            logger.error(err);
        }
    }
}
