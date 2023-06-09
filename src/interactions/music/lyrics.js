import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';
import { lyricsExtractor } from '@discord-player/extractor';

export default class LyricsCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'lyrics';
        this.description = 'Wanna get the lyrics of a song? Use me to do so!';
        this.module = 'Music';
        this.options = [
            {
                type: ApplicationCommandOptionType.String,
                name: 'query',
                description: 'The track title to search lyrics',
                required: false,
            },
        ];
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        const queue = this.client.player.nodes.get(interaction.guild.id);
        const query = interaction.options.getString('query', false) ?? queue?.currentTrack?.title;
        await interaction.deferReply({ ephemeral: true });

        if (!queue || !queue.node.isPlaying()) {
            return await interaction.followUp('Empty Queue!');
        }

        if (!query) {
            return interaction.followUp('Please provide a track name.');
        }

        const q = query
            .toLowerCase()
            .replace(
                // eslint-disable-next-line max-len
                /\(lyrics|lyric|official music video|official video hd|official video|audio|official|clip officiel|clip|extended|hq\)/g,
                '',
            );

        const res = await lyricsExtractor().search(q).catch(() => null);

        if (!res || !res.lyrics) {
            return interaction.followUp('No lyrics found for this track.');
        }

        const l = res.lyrics.length > 2000
            ? `${res.lyrics.slice(0, 1999)}...`
            : res.lyrics;

        return await interaction.followUp(l);
    }
}
