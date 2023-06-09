import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class QueueCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'queue';
        this.description = 'Lists all the tracks in the queue!';
        this.module = 'Music';
        this.options = [
            {
                name: 'page',
                description: 'The page number of the queue!',
                type: ApplicationCommandOptionType.Number,
                required: false,
            },
        ];
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        const queue = this.client.player.nodes.get(interaction.guild.id);
        let page = interaction.options.getNumber('page', false) ?? 1;
        const multi = 10;

        if (!queue.size) {
            return await interaction.reply('Empty Queue!');
        }

        const maxPages = Math.ceil(queue.size / multi);
        if (page < 1 || page > maxPages) {
            page = 1;
        }

        const end = page * multi;
        const start = end - multi;
        const tracks = queue.tracks.toArray().slice(start, end);

        try {
            return await interaction.reply({
                embeds: [
                    {
                        description: `${tracks.map((track, i) => {
                            return `${start + ++i} - [${track.title}](${track.url}) ~ [${track.requestedBy.toString()}]`;
                        }).join('\n')}`,
                        footer: {
                            text: `Page ${page} of ${maxPages} | track ${start + 1} to ${end > queue.size
                                ? queue.size
                                : end} of ${queue.size}`,
                        },
                    },
                ],
            });
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
