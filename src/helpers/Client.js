import chalk from 'chalk';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, Client as DiscordjsClient, REST } from 'discord.js';
import { createRequire } from 'module';
import { MusicPlayer } from './modules/MusicPlayer.js';
import { data } from '../settings/data.js'; // eslint-disable-line no-unused-vars
import { Logger } from './modules/Logger.js';
import { EventHandler } from './modules/EventHandler.js';
import { InteractionHandler } from './modules/InteractionHandler.js';
import { MessageHandler } from './modules/MessageHandler.js';
import Josh from '@joshdb/core';
import provider from '@joshdb/sqlite';

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
        this.eventHandler = new EventHandler(this);
        this.interactionHandler = new InteractionHandler(this);
        this.messageHandler = new MessageHandler(this);
        this.player = new MusicPlayer(this);
        this.logger = new Logger(this, 'https://discord.com/api/webhooks/1113016614137380867/VDOeTnkvYh-KEjXn8MAhGoUpkoNzeknMNELCJ8tIzqdDyBaS4dpDfrkWlVQzkFAfLrJE');
        this.interactionCommands = new Collection();
        this.messageCommands = new Collection();
        this.aliases = new Collection();
        this.cooldowns = new Collection();
        this.guildData = new Josh({
            name: 'guilds',
            provider,
        });
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
                this.config.deployGlobally,
                this.config.id,
                this.config.developmentGuildId,
            );
            await this.interactionHandler.loadInteractions();
            await this.messageHandler.loadCommands();
            await this.eventHandler.loadEvents();
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

    async ensureGuildData(guildId) {
        await this.guildData.ensure(guildId, {
            prefix: this.config.globalPrefix,
            welcome: {
                enabled: false,
                channel: null,
                message: null,
            },
            leave: {
                enabled: false,
                channel: null,
                message: null,
            },
        });
    }

    // eslint-disable-next-line max-statements
    cooldown(command, user) {
        if (!this.cooldowns.has(command.name)) {
            this.cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = this.cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;

        if (timestamps.has(user.id)) {
            const expirationTime = timestamps.get(user.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                return timeLeft;
            } else {
                timestamps.set(user.id, now);
                setTimeout(() => timestamps.delete(user.id), cooldownAmount);
                return false;
            }
        } else {
            timestamps.set(user.id, now);
            setTimeout(() => timestamps.delete(user.id), cooldownAmount);
            return false;
        }
    }
}
