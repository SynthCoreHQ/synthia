import chalk from 'chalk';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, Client as DiscordjsClient, REST } from 'discord.js';
import { createRequire } from 'module';
import { MusicPlayer } from './modules/MusicPlayer.js';
import { data } from '../settings/data.js'; // eslint-disable-line no-unused-vars
import { Logger } from './modules/Logger.js';
import { EventHandler } from './modules/EventHandler.js';
import { InteractionHandler } from './modules/InteractionHandler.js';
import { database } from '../database/database.js';

const require = createRequire(import.meta.url);

export class Client extends DiscordjsClient {
    /**
     * @param {import('discord.js').ClientOptions} options
     * @param {data} config
     */
    constructor(options, config) {
        super(options);

        this.config = config;
        this.emotes = require('../settings/emotes.json');
        this.rest = new REST({ version: '10' }).setToken(this.config.token);
        this.database = database;
        this.eventHandler = new EventHandler(this);
        this.interactionHandler = new InteractionHandler(this);
        this.player = new MusicPlayer(this);
        this.logger = new Logger(this, 'https://discord.com/api/webhooks/1113016614137380867/VDOeTnkvYh-KEjXn8MAhGoUpkoNzeknMNELCJ8tIzqdDyBaS4dpDfrkWlVQzkFAfLrJE');
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

            await this.database.authenticate().then(() => {
                this.logger.info(`${chalk.cyanBright('Authenticator')}`, 'Database has been authenticated.');
            });

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
                this.config.deployGlobally,
                this.config.id,
                this.config.developmentGuildId,
            );
            await this.interactionHandler.loadInteractions();
            await this.eventHandler.loadEvents();
            // await this.player.extractors.loadDefault();
            await this.authenticate(token);
        } catch (err) {
            this.logger.error(err);
        }
    }

    async musicComponents(_componentState) {
        const { emotes } = this.config;

        const componentRow = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setCustomId('_previousSong')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Previous')
                        .setEmoji(emotes.previous)
                        .setDisabled(_componentState),

                    new ButtonBuilder()
                        .setCustomId('_toggleSong')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Pause')
                        .setEmoji(emotes.pause)
                        .setDisabled(_componentState),

                    new ButtonBuilder()
                        .setCustomId('_nextSong')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Next')
                        .setEmoji(emotes.next)
                        .setDisabled(_componentState),

                    new ButtonBuilder()
                        .setCustomId('_stopMusic')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Stop')
                        .setEmoji(emotes.stop)
                        .setDisabled(_componentState),

                    new ButtonBuilder()
                        .setCustomId('_autoplayMusic')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Autoplay')
                        .setEmoji(emotes.autoplay)
                        .setDisabled(_componentState),
                ],
            );

        return componentRow.toJSON();
    }

    getInteractionCommand(commandName) {
        return this.interactionCommands.get(commandName.toLowerCase());
    }
}
