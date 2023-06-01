import chalk from 'chalk';
import {
    Collection,
    Client as DiscordjsClient,
    REST,
    Routes,
} from 'discord.js';
import { createRequire } from 'module';
import path from 'path';
import * as Utils from '../util/functions.js';
import { DistubeClient } from './modules/DistubeClient.js';
import { data } from '../settings/data.js'; // eslint-disable-line no-unused-vars
import { Logger } from './modules/Logger.js';

const require = createRequire(import.meta.url);

export class Client extends DiscordjsClient {
    /**
     * @param {import('discord.js').ClientOptions} options
     * @param {data} config
     */
    constructor(options, config) {
        super(options);

        this.config = config;
        this.utils = Utils;
        this.emotes = require('../settings/emotes.json');
        this.rest = new REST({ version: '10' }).setToken(this.config.token);
        this.music = new DistubeClient(this);
        this.logger = new Logger();
        this.events = new Collection();
        this.commands = new Collection();
        this.cooldowns = new Collection();
    }

    async registerApplicationCommands() {
        const arrayOfCommands = [];
        const route = this.config.commands.deployGlobally
            ? Routes.applicationCommands(this.config.id)
            : Routes.applicationGuildCommands(this.config.id, this.config.developmentGuildId); // eslint-disable-line max-len

        try {
            const files = this.utils.getFiles(path.join(process.cwd(), 'src', 'commands'));

            for (const file of files) {
                const command = await import(`file://${file}`).then((res) => res.default);

                arrayOfCommands.push(command);
            }

            this.rest
                .put(route, { body: arrayOfCommands })
                .then((x) => this.logger.info(chalk.redBright('Interactions'), `(${x.length}) commands registered.`));
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
                this.commands.set(command.name, command);
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

                if (event.once) {
                    this.once(event.name, (...args) => event.run(this, ...args)); // eslint-disable-line max-len
                } else {
                    this.on(event.name, (...args) => event.run(this, ...args));
                }
            }

            this.logger.info(chalk.yellowBright('Events'), `(${count}) events loaded.`);
        } catch (err) {
            this.logger.error(err.stack);
        }
    }

    async authenticate(token) {
        try {
            if (!token) {
                throw new Error('No Client Token was provided.');
            }

            await this.login(token)
                .then(() => {
                    this.logger.debug(`${chalk.green('Token Logged in')}! starting the bot...`);
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
