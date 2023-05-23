import chalk from 'chalk';
import { Collection, Client as DiscordjsClient, REST, Routes } from 'discord.js';
import path from 'path';
import * as Utils from '../functions.js';
import { Logger } from './Logger.js';

export class Client extends DiscordjsClient {
    constructor(clientConfig = {}) {
        super({ intents: ['Guilds'] });

        this.config = clientConfig;
        this.utils = Utils;
        this.rest = new REST({ version: '10' }).setToken(process.env['BOT_TOKEN']);
        this.logger = new Logger();
        this.events = new Collection();
        this.commands = new Collection();
        this.cooldowns = new Collection();
    }

    async registerApplicationCommands() {
        const arrayOfCommands = [];
        const route = this.config.commandDeployMode
            ? Routes.applicationCommands(this.config.clientId)
            : Routes.applicationGuildCommands(this.config.clientId, this.config.guildId);

        try {
            const files = this.utils.getFiles(path.join(process.cwd(), 'src', 'commands'));

            for (const file of files) {
                const command = await import(`file://${file}`).then((res) => res.default);

                arrayOfCommands.push(command.data.toJSON());
            }

            this.rest
                .put(route, { body: arrayOfCommands })
                .then((data) =>
                    this.logger.info(
                        chalk.redBright('Interactions'),
                        `(${data.length}) commands registered ${
                            this.config.commandDeployMode ? 'globally' : 'locally'
                        }.`,
                    ),
                );
        } catch (err) {
            this.logger.error(err.stack);
        }
    }

    async loadCommands() {
        try {
            let count = 0;
            const files = this.utils.getFiles(path.join(process.cwd(), 'src', 'commands'));

            for (const file of files) {
                const command = await import(`file://${file}`).then((res) => res.default);

                count++;
                this.commands.set(command.data.name, command);
            }

            this.logger.info(chalk.yellowBright('Commands'), `(${count}) commands loaded.`);
        } catch (err) {
            this.logger.error(err.stack);
        }
    }

    async loadEvents() {
        try {
            let count = 0;
            const files = this.utils.getFiles(path.join(process.cwd(), 'src', 'events'));

            for (const file of files) {
                const event = await import(`file://${file}`).then((res) => res.default);

                count++;
                this.events.set(event.name, event);
                this.on(event.name, (...args) => event.run(this, ...args));
            }

            this.logger.info(chalk.yellowBright('Events'), `(${count}) events loaded.`);
        } catch (err) {
            this.logger.error(err.stack);
        }
    }

    async authenticate(token) {
        try {
            if (!token) throw new Error('No Client Token was provided.');

            await this.login(token)
                .then(() => {
                    if (this.config.debug) this.logger.debug(`${chalk.green('Token Logged in')}! starting the bot...`);
                })
                .catch((err) => this.logger.error(err.stack));
        } catch (err) {
            this.logger.error(err.stack);
        }
    }

    /**
     * Method to initialize the client.
     */
    async initialize({ token }) {
        try {
            this.registerApplicationCommands();
            this.loadCommands();
            this.loadEvents();
            this.authenticate(token);
        } catch (err) {
            this.logger.error(err);
        }
    }
}
