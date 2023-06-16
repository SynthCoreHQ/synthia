import chalk from 'chalk';
import { Routes } from 'discord.js';
import { BaseHandler } from '../base/BaseHandler.js';

export class InteractionHandler extends BaseHandler {
    constructor(client) {
        super(client);

        this.interactions = [];
    }

    async registerInteractions(mode, clientId, guildId) {
        const { logger, rest } = this.client;
        const { interactionCommands } = this.paths;

        const route = mode
            ? Routes.applicationCommands(clientId)
            : Routes.applicationGuildCommands(clientId, guildId); // eslint-disable-line max-len

        try {
            const files = this._loadFilesRecusrive(interactionCommands);

            for (const file of files) {
                const Command = await import(`file://${file}`).then(f => f.default);
                const command = new Command(this.client);

                if (!command.name || !command.description) {
                    throw new ReferenceError(`Class ${chalk.greenBright(command.constructor.name)} does not have the required properties 'name' & 'description'.`);
                }

                const commandObject = {
                    name: command.name,
                    description: command.description,
                    type: command.type,
                    options: command.options || undefined,
                };

                this.interactions.push(commandObject);
            }

            await rest
                .put(route, { body: this.interactions })
                .then((x) => logger.info(chalk.redBright('InteractionHandler'), `(${x.length}) commands registered.`));
        } catch (err) {
            logger.error(err.stack);
        }
    }

    async loadInteractions() {
        const { logger } = this.client;
        const { interactionCommands } = this.paths;

        try {
            const files = this._loadFilesRecusrive(interactionCommands);

            for (const file of files) {
                const Command = await import(`file://${file}`).then(f => f.default);
                const command = new Command(this.client);

                if (!command.name || !command.description) {
                    throw new ReferenceError(`Class ${chalk.greenBright(command.constructor.name)} does not have the required properties 'name' & 'description'.`);
                }
                this.client.interactionCommands.set(command.name, command);
            }

            logger.info(chalk.redBright('InteractionHandler'), `(${this.client.interactionCommands.size}) commands loaded.`);
        } catch (err) {
            logger.error(err);
        }
    }
}
