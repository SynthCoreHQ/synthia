import chalk from 'chalk';
import { Collection, Client as DiscordjsClient, REST } from 'discord.js';
import { createRequire } from 'module';
import * as Utils from '../util/functions.js';
import { DistubeClient } from './modules/DistubeClient.js';
import { data } from '../settings/data.js'; // eslint-disable-line no-unused-vars
import { Logger } from './modules/Logger.js';
import { EventHandler } from './modules/EventHandler.js';
import { InteractionHandler } from './modules/InteractionHandler.js';


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
        this.eventHandler = new EventHandler(this);
        this.interactionHandler = new InteractionHandler(this);
        this.music = new DistubeClient(this);
        this.logger = new Logger();
        this.commands = new Collection();
        this.interactionCommands = new Collection();
        this.messageCommands = new Collection();
        this.aliases = new Collection();
        this.cooldowns = new Collection();
    }

    async authenticate(token) {
        try {
            if (!token) {
                throw new Error('No Client Token was provided.');
            }

            await this.login(token)
                .then(() => {
                    this.logger.debug(`${chalk.greenBright('Authenticator')}! starting the bot...`);
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
            await this.interactionHandler.registerInteractions(
                this.config.commands.deployGlobally,
                this.config.id,
                this.config.developmentGuildId,
            );
            await this.interactionHandler.loadInteractions();
            await this.eventHandler.loadEvents();
            await this.authenticate(token);
        } catch (err) {
            this.logger.error(err);
        }
    }
}
