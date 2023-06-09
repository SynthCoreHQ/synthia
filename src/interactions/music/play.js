import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';
import { QueryType } from 'discord-player';

export default class PlayCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'play';
        this.description = 'Wanna listen some songs? Use me to do so!';
        this.module = 'Music';
        this.options = [
            {
                name: 'query',
                description: 'Any song name in mind?',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
            },
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    // eslint-disable-next-line max-statements
    async executeCommand(interaction) {
        const { client } = this;
        const query = interaction.options.getString('query', true);
        const UserVoiceChannel = interaction.member.voice.channel;
        const BotVoiceChannel = interaction.guild.members.me.voice.channel;

        if (BotVoiceChannel && UserVoiceChannel.id !== BotVoiceChannel.id) {
            return interaction.reply('You must be in the same voice channel as the bot.');
        }

        const searchResult = await client.player.search(
            query,
            {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            },
        );

        try {
            await interaction.deferReply();

            if (!searchResult.hasTracks()) {
                return interaction.followUp(`We didnt find tracks for ${query}`);
            } else {
                await client.player.play(
                    UserVoiceChannel,
                    searchResult,
                    {
                        nodeOptions: {
                            metadata: interaction.channel,
                            leaveOnEnd: true,
                            leaveOnEndCooldown: 50_000,
                            volume: 50,
                        },
                    },
                );

                return interaction.followUp({
                    content: `Added ${searchResult.tracks[0]}`,
                    ephemeral: true,
                });
            }
        } catch (e) {
            client.logger.error(e.stack);
            return interaction.followUp({ content: 'Something went wrong...', ephemeral: true });
        }
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
