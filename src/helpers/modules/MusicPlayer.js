// import { Player } from 'discord-player';
import { Collection, bold } from 'discord.js';
import { Connectors, Shoukaku } from 'shoukaku';

export class MusicPlayer extends Shoukaku {
    /**
     * @param {import('../Client.js').Client} DiscordjsClient
     */
    constructor(DiscordjsClient) {
        super(
            new Connectors.DiscordJS(DiscordjsClient),
            DiscordjsClient.config.nodes,
            {
                moveOnDisconnect: false,
                resume: true,
                resumeKey: 'synthia',
                resumeTimeout: 30,
                reconnectTries: 2,
                restTimeout: 10000,
            },
        );

        this.client = DiscordjsClient;
        this.SearchResult = new Collection();

        this.on('ready', (name) => this.client.logger.info('LAVALINK', `Node: ${name} is now connected!`));
        this.on('error', (name, error) => this.client.logger.error('LAVALINK', error));
        this.on('close', (name, code, reason) => this.client.logger.info('LAVALINK', `Node: ${name} closed with code (${code}) reason (${reason || 'No reason'})`));
        this.on('disconnect', (name) => this.client.logger.info('LAVALINK', `Node: ${name} disconnected!`));
    }

    /**
     * @param {string} query
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {{ channel: import('discord.js').VoiceState, tracks: import('discord-player').SearchResult }} options
     */
    async _playSong(interaction, options) {
        const { channel, tracks } = options;

        return await this.play(channel, tracks, {
            nodeOptions: {
                volume: 50,
                selfDeaf: true,
                leaveOnEnd: true,
                leaveOnEndCooldown: 50_000,
                metadata: interaction.channel,
            },
        });
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @param {{ queue: import('discord-player').GuildQueue }} options
     */
    async _clearMusicQueue(interaction, options) {
        if (!options.queue.size) {
            return await interaction.reply({ content: 'The queue is empty right now!', ephemeral: true });
        }

        options.queue.tracks.clear();
    }

    /**
     * @param {{ queue: import('discord-player').GuildQueue }} options
     */
    async _getFilterList(options) {
        const { ffmpeg } = options.queue.filters;
        const { emotes, config } = this.client;

        const enabledFilterList = ffmpeg.getFiltersEnabled();
        const disabledFilterList = ffmpeg.getFiltersDisabled();

        /**
         * @type {import('discord.js').EmbedData}
         */
        const filerListEmbed = {
            title: config.embeds.title.replace(/{text}/, 'Filters'),
            color: config.embeds.aestheticColor,
            description: [
                'Enabled: ',
                enabledFilterList.map(filterName => `> ${bold(filterName)}: ${emotes.right}`).join('\n'),
                '',
                'Disabled: ',
                disabledFilterList.map(filterName => `> ${bold(filterName)}: ${emotes.wrong}`).join('\n'),
            ],
            thumbnail: {
                url: this.client.user.displayAvatarURL(),
            },
            footer: {
                text: config.embeds.footer.replace(/{text}/, 'SynthCore'),
            },
        };

        return filerListEmbed;
    }

    /**
     * @param {{ queue: import('discord-player').GuildQueue, filter: import('discord-player').QueueFilters }} options
     */
    async _toggleSongFilter(options) {
        await options.queue.filters.ffmpeg.toggle(options.filter);
    }

    /**
     * @param {{ queue: import('discord-player').GuildQueue, state: boolean }} options
     */
    async _clearFilters(options) {
        if (!options.queue.filters.ffmpeg.getFiltersEnabled()) {
            return;
        }

        await options.queue.filters.ffmpeg.setFilters(
            options.state === true
                ? false
                : true,
        );
    }
}
