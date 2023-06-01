import { SoundCloudPlugin } from '@distube/soundcloud';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { DisTube } from 'distube';

export class DistubeClient {
    /**
     * @param {import('../Client.js').Client} client
     */
    constructor(client) {
        this.client = new DisTube(client, {
            leaveOnStop: false,
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: false,
            emitAddListWhenCreatingQueue: false,
            plugins: [
                new SpotifyPlugin({ emitEventsAfterFetching: true }),
                new SoundCloudPlugin(),
                new YtDlpPlugin(),
            ],
        });

        this.client
            .on('playSong', (queue, song) => {
                const _prev = new ButtonBuilder()
                    .setCustomId('_prev')
                    .setEmoji(client.emotes.previous)
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary);

                const _pauseRes = new ButtonBuilder()
                    .setCustomId('_pause')
                    .setEmoji(client.emotes.pause)
                    .setLabel('Pause')
                    .setStyle(ButtonStyle.Primary);

                const _next = new ButtonBuilder()
                    .setCustomId('_next')
                    .setEmoji(client.emotes.next)
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary);

                const _stop = new ButtonBuilder()
                    .setCustomId('_stop')
                    .setEmoji(client.emotes.stop)
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Danger);

                const _loop = new ButtonBuilder()
                    .setCustomId('_loop')
                    .setEmoji(client.emotes.loop)
                    .setLabel('Loop')
                    .setStyle(ButtonStyle.Primary);

                const _autoplay = new ButtonBuilder()
                    .setCustomId('_autoplay')
                    .setEmoji(client.emotes.autoplay)
                    .setLabel('Autoplay')
                    .setStyle(ButtonStyle.Primary);

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
                            title: client.config.commands.embeds.title.replace(/{text}/, 'Play'),
                            description: [
                                `Playing \`${song.name}\` - \`${song.formattedDuration}\``,
                                `Requested by: ${song.user}`,
                                `${this.getStatus(queue)}`,
                            ].join('\n'),
                            color: client.config.commands.embeds.aestheticColor,
                            thumbnail: {
                                url: client.config.icon,
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
                    client.logger.error(err.stack);
                } else {
                    client.logger.error(err.stack);
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
