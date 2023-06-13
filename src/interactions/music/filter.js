/* eslint-disable indent */
import { ApplicationCommandOptionType, bold } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';
import { AudioFilters } from 'discord-player';

export default class FilterCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'filter';
        this.description = 'Wanna spice up the music with some filters? Here you go!';
        this.module = 'Music';
        this.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'clear',
                description: 'Clear all filters!',
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'list',
                description: 'List all filters!',
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'toggle',
                description: 'Toggle a filter!',
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: 'filter_name',
                        description: 'The name of the filter!',
                        required: true,
                        choices: AudioFilters.names.slice(0, 25).map((f) => ({
                            name: `${f}`,
                            value: `${f.toLowerCase()}`,
                        })),
                    },
                ],
            },
        ];
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        const { player } = this.client;
        const opt = interaction.options.getSubcommand(true);
        const filterName = interaction.options.getString('filter_name');
        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.node.isPlaying()) {
            return await this.broadcastRespone(interaction, {
                message: 'Empty/Paused Queue!', hidden: true,
            });
        }

        switch (opt) {
            case 'clear':
                await player._clearFilters({ queue: queue, state: true });
                await this.broadcastRespone(interaction, { message: 'Cleared all the enabled filters!', hidden: true });
                break;

            case 'toggle':
                await player._toggleSongFilter({ filter: filterName, queue: queue }); // eslint-disable-line max-len
                await this.broadcastRespone(interaction, { message: `Toggle the ${filterName} audio filter!`, hidden: true });
                break;

            default:
                // await this.broadcastEmbeddedRespone(interaction, {
                //     embedData: [player._getFilterList({ queue: queue })],
                //     hidden: true,
                // });
                await interaction.reply({
                    // embeds: [player._getFilterList({ queue: queue })],
                    embeds: [
                        {
                            title: this.client.config.embeds.title.replace(/{text}/, 'Filters'),
                            color: this.client.config.embeds.aestheticColor,
                            // description: [
                            //     'Enabled: ',
                            //     queue.filters.ffmpeg.getFiltersEnabled().map(fName => `> ${bold(fName)}: ${this.client.emotes.right}`).join('\n') || 'None',
                            //     '',
                            //     'Disabled: ',
                            //     queue.filters.ffmpeg.getFiltersDisabled().map(fName => `> \` ${fName} \` - ${this.client.emotes.wrong}`).join('\n'),
                            // ].join('\n'),
                            fields: [
                                {
                                    name: 'Enabled Filters',
                                    value: queue.filters.ffmpeg.getFiltersEnabled().map(fName => `> \` ${fName} \` - ${this.client.emotes.right}`).join('\n') || '` N/A `',
                                    inline: true,
                                },
                                {
                                    name: 'Disabled Filters',
                                    value: queue.filters.ffmpeg.getFiltersDisabled().map(fName => `> \` ${fName} \` - ${this.client.emotes.wrong}`).slice(0, 20).join('\n') || 'N/A',
                                    inline: true,
                                },
                            ],
                            thumbnail: {
                                url: this.client.user.displayAvatarURL(),
                            },
                            footer: {
                                text: this.client.config.embeds.footer.replace(/{text}/, 'SynthCore'),
                            },
                        },
                    ],
                });
                break;
        }
    }
}
