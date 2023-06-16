import chalk from 'chalk';
import { BaseHandler } from '../base/BaseHandler.js';

export class MessageHandler extends BaseHandler {
    constructor(client) {
        super(client);
    }

    // eslint-disable-next-line max-statements
    async loadCommands() {
        const { logger } = this.client;
        const { messageCommands } = this.paths;

        try {
            const files = this._loadFilesRecusrive(messageCommands);

            for (const file of files) {
                const Command = await import(`file://${file}`).then(f => f.default);
                const command = new Command(this.client);

                if (!command.name || !command.description) {
                    throw new ReferenceError(`Class ${chalk.greenBright(command.constructor.name)} does not have the required properties 'name' & 'description'.`);
                }
                this.client.messageCommands.set(command.name, command);

                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => {
                        this.client.aliases.set(alias, command.name);
                    });
                }
            }

            logger.info(chalk.blueBright('MessageHandler'), `(${this.client.messageCommands.size}) commands loaded.`);
        } catch (err) {
            logger.error(err);
        }
    }
}
