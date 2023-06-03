import { SoundCloudPlugin } from '@distube/soundcloud';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { DisTube } from 'distube';

export class DistubeClient extends DisTube {
    /**
     * @param {import('../Client.js').Client} DiscordjsClient
     */
    constructor(DiscordjsClient) {
        super(DiscordjsClient, {
            leaveOnStop: true,
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: false,
            emitAddListWhenCreatingQueue: false,
            plugins: [
                new YtDlpPlugin(),
                new SoundCloudPlugin(),
                new SpotifyPlugin({ emitEventsAfterFetching: true }),
            ],
        });

        this.DiscordClient = DiscordjsClient;

        this.DiscordClient
            .on('playSong', (queue, song) => {
                const _prev = new ButtonBuilder()
                    .setCustomId('_prev')
                    .setEmoji(this.DiscordClient.emotes.previous)
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Success);

                const _pauseRes = new ButtonBuilder()
                    .setCustomId('_pause')
                    .setEmoji(this.DiscordClient.emotes.pause)
                    .setLabel('Pause')
                    .setStyle(ButtonStyle.Success);

                const _next = new ButtonBuilder()
                    .setCustomId('_next')
                    .setEmoji(this.DiscordClient.emotes.next)
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Success);

                const _stop = new ButtonBuilder()
                    .setCustomId('_stop')
                    .setEmoji(this.DiscordClient.emotes.stop)
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Success);

                // eslint-disable-next-line no-unused-vars
                const _loop = new ButtonBuilder()
                    .setCustomId('_loop')
                    .setEmoji(this.DiscordClient.emotes.loop)
                    .setLabel('Loop')
                    .setStyle(ButtonStyle.Success);

                const _autoplay = new ButtonBuilder()
                    .setCustomId('_autoplay')
                    .setEmoji(this.DiscordClient.emotes.autoplay)
                    .setLabel('Autoplay')
                    .setStyle(ButtonStyle.Success);

                const rowOne = new ActionRowBuilder().addComponents(
                    [
                        _prev,
                        _pauseRes,
                        _next,
                        _stop,
                        // _loop,
                        _autoplay,
                    ],
                );

                queue.textChannel.send({
                    embeds: [
                        {
                            title: this.DiscordClient.config.commands.embeds.title.replace(/{text}/, 'Play'),
                            description: [
                                `Playing \`${song.name}\` - \`${song.formattedDuration}\``,
                                `Requested by: ${song.user}`,
                                `${this.getStatus(queue)}`,
                            ].join('\n'),
                            color: this.DiscordClient.config.commands.embeds.aestheticColor, // eslint-disable-line max-len
                            thumbnail: {
                                url: this.DiscordClient.config.icon,
                            },
                        },
                    ],
                    components: [rowOne],
                });
            })
            .on('addSong', (queue, song) => {
                queue.textChannel.send(`Added: ${song.name} - ${song.formattedDuration} to the queue.`);
            })
            .on('addList', (queue, playlist) => {
                queue.textChannel.send([
                    `Added: ${playlist.name} (${playlist.songs.length} songs) to the queue.`,
                    this.getStatus(queue),
                ].join('\n'));
            })
            .on('error', (channel, err) => {
                if (channel) {
                    channel.send('An error encountered');
                    this.DiscordClient.logger.error(err.stack);
                } else {
                    this.DiscordClient.logger.error(err.stack);
                }
            })
            .on('empty', (queue) => {
                queue.textChannel.send('Queue empty!');
            })
            .on('searchNoResult', (message, query) => {
                message.channel.send(`No results found for \`${query}\``);
            })
            .on('finish', (queue) => {
                queue.textChannel.send('Queue Finished!');
            });
    }

    /**
     * @param {import('distube').Queue} queue
     * @returns {string}
     */
    getStatus(queue) {
        return [
            `Volume: \`${queue.volume}%\``,
            `Filter: \`${queue.filters.names.join(', ') || 'Off'}\``,
            `Loop: ${queue.repeatMode
                ? (queue.repeatMode === '2'
                    ? 'All Queue'
                    : 'This Song')
                : '`Off`'}`,
            `Autoplay: ${queue.autoplay
                ? '`On`'
                : '`Off`'}`,
        ].join('\n');
    }
}
