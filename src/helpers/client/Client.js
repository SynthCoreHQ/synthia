import * as Backup from 'discord-backup';
import * as discordJs from 'discord.js';
import { Database } from '../Database.js';
import { FileHandler } from '../FileHandler.js';
import { Logger } from '../Logger.js';
import { Utility } from '../Utility.js';

export class Client extends discordJs.Client {
    /**
     * @param {import('discord.js').ClientOptions} options
     * @param {import('../../settings/config.js')} config
     */
    constructor(options, config) {
        super(options);

        this.config = config;
        this.restClient = new discordJs.REST({ version: '10' }).setToken(this.config.token);
        this.handler = new FileHandler(this, this.config);
        this.events = new discordJs.Collection();
        this.commands = new discordJs.Collection();
        this.command_aliases = new discordJs.Collection();
        this.command_cooldowns = new discordJs.Collection();
        this.interactions = new discordJs.Collection();
        this.logger = new Logger(this);
        this.utility = new Utility(this, this.config);
        this.backup = Backup;
        this.guild_data = new Database('guilds');
        this.user_data = new Database('users');

        // this.eventHandler = new EventHandler(this);
        // this.interactionHandler = new InteractionHandler(this);
        // this.messageHandler = new MessageHandler(this);
        // this.player = new MusicPlayer(this);
        // this.interactionCommands = new Collection();
        // this.messageCommands = new Collection();
        // this.guildData = new Josh({
        //     name: 'guilds',
        //     provider,
        // });
    }

    async authenticate(token) {
        try {
            if (!token) {
                throw new Error('No Client Token was provided.');
            }

            await this.login(token)
                .then(() => {
                    this.logger.debug(import.meta.url, `starting the bot...`);
                })
                .catch((err) => this.logger.error(import.meta.url, err));
        } catch (err) {
            this.logger.error(import.meta.url, err);
        }
    }

    /**
     * Method to initialize the client.
     */
    async initialize({ token }) {
        try {
            // await this.interactionHandler.registerInteractions(
            //     this.config.deployGlobally,
            //     this.config.id,
            //     this.config.developmentGuildId,
            // );
            // await this.interactionHandler.loadInteractions();
            await this.handler.create_events();
            await this.handler.create_commands();
            await this.backup.setStorageFolder(`${process.cwd()}/src/database/backups/`)
            // await this.handler.create_interactions();
            await this.authenticate(token);
        } catch (err) {
            this.logger.error(import.meta.url, err);
        }
    }

    // eslint-disable-next-line max-statements
    cooldown(command, user) {
        if (!this.command_cooldowns.has(command.name)) {
            this.command_cooldowns.set(command.name, new discordJs.Collection());
        }

        const now = Date.now();
        const timestamps = this.command_cooldowns.get(command.name);
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

    /**
     * @param {import('discord.js').Guild} guild
     * @param {import('discord.js').AuditLogEvent} type
     * @returns {Promise<import('discord.js').GuildAuditLogsEntry>}
     */
    async fetchAuditLogs(guild, type) {
        const auditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type,
        });

        return auditLogs.entries.first();
    }

    /**
     * @param {{ author?: import('discord.js').EmbedAuthorData, title?: string, description?: string, type: 'primary' | 'warning' | 'error' | 'none', footer: import('discord.js').EmbedFooterData, fields: import('discord.js').EmbedField[], image?: string, thumbnail?: string, timestaps?: boolean }} options
     */
    embed(options) {
        const { author, title, description, footer, type, fields, image, thumbnail, timestaps } = options;

        const _embed = new discordJs.EmbedBuilder()
            .setAuthor(author || null)
            .setTitle(`Synthia ${title ? `| ${title}` : ''}`)
            .setDescription(description || null)
            .setColor(type === 'primary' ? this.config.embed_color : type === 'warning' ? this.config.embed_color_warn : type === 'error' ? this.config.embed_color_error : this.config.embed_color_none)
            .setFooter(footer || null)
            .setImage(image || null)
            .setThumbnail(thumbnail || null)

        fields ? _embed.addFields(fields) : null;
        timestaps ? _embed.setTimestamp() : null;

        return _embed;
    }

    /**
     * @param {discordJs.AnyComponentBuilder} components
     */
    action_row(...components) {
        return new discordJs.ActionRowBuilder().addComponents(...components);
    }

    /**
     * @param {{ title: string, id: string, components: [] }} options
     */
    modal(options) {
        const _modal = new discordJs.ModalBuilder()
            .setTitle(options.title || 'Modal Title')
            .setCustomId(options.id)
            .setComponents(...options.components)

        return _modal;
    }

    /**
     * @param {{ id: string, label: string, min_len?: number, max_len?: number, placeholder?: string, required?: boolean, style: 'short' | 'long', value?: string }} options 
     */
    modal_text_input(options) {
        const { id, label, style, max_len, min_len, placeholder, required, value } = options;

        const _input = new discordJs.TextInputBuilder()
            .setCustomId(id)
            .setLabel(label)
            .setRequired(required || false)
            .setStyle(style === 'short' ? discordJs.TextInputStyle.Short : discordJs.TextInputStyle.Paragraph)

        min_len ? _input.setMinLength(min_len) : null;
        max_len ? _input.setMaxLength(max_len) : null;
        placeholder ? _input.setPlaceholder(placeholder) : null;
        value ? _input.setValue(value) : null;

        return _input;
    }

    /**
     * 
     * @param {{ label?: string, style?: 'primary' | 'success' | 'redirect' | 'danger' | 'none', id?: string, state?: boolean, emoji?: import('discord.js').ComponentEmojiResolvable, url?: string }} options 
     * @returns 
     */
    button(options) {
        const { label, style, id, state, emoji, url } = options;

        if (style === 'redirect' && !url) throw new Error('You must provide a url for a redirect button.');

        const _button = new discordJs.ButtonBuilder()
            .setLabel(label || 'Click Me!')
            .setStyle(style === 'primary' ? discordJs.ButtonStyle.Primary : style === 'success' ? discordJs.ButtonStyle.Success : style === 'redirect' ? discordJs.ButtonStyle.Link : style === 'danger' ? discordJs.ButtonStyle.Danger : discordJs.ButtonStyle.Secondary)
            .setDisabled(state || false)

        emoji ? _button.setEmoji(emoji) : null;
        style === 'redirect' ? _button.setURL(url) : null;
        style !== 'redirect' ? _button.setCustomId(id) : null;

        return _button;
    }

    /**
     * @param {{ channel: import('discord.js').Channel, content?: string, embed_data: import('discord.js').EmbedData[], components: import('discord.js').ActionRow[] }} options
     */
    async send(options) {
        const { channel, content, embed_data, components } = options;

        return await channel.send({ content, embeds: embed_data, components: components })
    }
}

