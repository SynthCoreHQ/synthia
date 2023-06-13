import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class PlayCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'play';
        this.description = 'Wanna listen some songs? Use me to do so!';
        this.module = 'Music';
        this.inVoiceChannel = true;
        this.matchVoiceChannel = true;
        this.options = [
            {
                name: 'query',
                description: 'Any song name in mind?',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true,
            },
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    // eslint-disable-next-line max-statements
    async executeCommand(interaction) {
        const { player } = this.client;

        const query = interaction.options.getString('query', true);
        const trackResults = await player.search(query, {
            searchEngine: 'AUTO',
            requestedBy: interaction.user,
        });

        await interaction.deferReply();

        if (!trackResults.hasTracks()) {
            return await this.broadcastRespone(interaction, { message: `Couldn't find tracks for ${query}`, hidden: true });
        }

        await player._playSong(interaction, {
            channel: interaction.member.voice.channel,
            tracks: trackResults,
        });

        return await this.broadcastRespone(interaction, { message: `Searching ${trackResults.tracks[0]}...`, hidden: true });
    }

    /**
     * @param {import('discord.js').AutocompleteInteraction} interaction
     */
    async autocomplete(interaction) {
        try {
            const query = interaction.options.getString('query', true);
            if (!query) {
                return interaction.respond([]);
            }
            const results = await this.client.player.search(query);

            return await interaction.respond(
                results.tracks.slice(0, 10).map(t => ({
                    name: t.title,
                    value: t.url,
                })),
            );
        } catch (e) {
            this.client.logger.error('PLAY_COMMAND', e);
        }
    }
}
