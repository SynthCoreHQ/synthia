/* eslint-disable indent */
import { ApplicationCommandOptionType } from 'discord.js';
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
        const opt = interaction.options.getSubcommand(true);

        const queue = this.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.node.isPlaying()) {
            return await interaction.reply('Empty Queue!');
        }


        const filters = queue.filters.ffmpeg.getFiltersEnabled();
        // const disabledFilters = queue.filters.ffmpeg.getFiltersDisabled();

        // const enabledFilterList = filters.map((f) => `${f}: ${this.client.emotes.right}`).join('\n');
        // const disabledFilterList = disabledFilters.map((f) => `${f}: ${this.client.emotes.wrong}`).join('\n');

        switch (opt) {
            case 'clear':
                if (!filters.length) {
                    return await interaction.reply('No filters applied currently!');
                }

                queue.filters.ffmpeg.setFilters(false);
                await interaction.reply('Cleared filters!');
                break;

            case 'toggle':
                // eslint-disable-next-line no-case-declarations
                const filterName = interaction.options.getString('filter_name');

                queue.filters.ffmpeg.toggle(filterName);
                await interaction.reply(`Toggle the ${filterName} audio filter!`);
                break;

            default:
                await interaction.reply(`Audio Filters List:\n${AudioFilters.names.join('\n')}`);
                break;
        }

        try {
            return await interaction.reply('This command is under development right now!');
        } catch (e) {
            this.client.logger.error('FILTER_COMMAND', e);
        }
    }
}
