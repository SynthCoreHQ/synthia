import { ApplicationCommandOptionType } from 'discord.js';
import figlet from 'figlet';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class AsciiCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'ascii';
        this.description = 'Wanna convert your text to a cool looking ascii art? Use me to do so!';
        this.options = [
            {
                name: 'text',
                description: 'What text are we converting?',
                type: ApplicationCommandOptionType.String,
                required: true,
                max_length: 2000, // eslint-disable-line camelcase
            },
        ];
    }

    async executeCommand(interaction) {
        const text = interaction.options.getString('text');

        figlet.text(text, async (err, data) => {
            if (err) {
                this.client.logger.error(err);
                return await interaction.reply({
                    embeds: [
                        {
                            description: 'Something went wrong.',
                            color: this.client.config.embeds.color,
                        },
                    ],
                    ephemeral: true,
                });
            }

            await interaction.reply({
                embeds: [
                    {
                        description: ['```', data, '```'].join('\n'),
                        color: this.client.config.embeds.color,
                    },
                ],
            });
        });
    }
}
