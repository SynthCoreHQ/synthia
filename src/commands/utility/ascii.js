import { ApplicationCommandOptionType } from 'discord.js';
import figlet from 'figlet';

export default {
    name: 'ascii',
    description: 'Wanna convert your text to a cool looking ascii art? Use me to do so!',
    type: 1,
    aliases: [],
    options: [
        {
            name: 'text',
            description: 'What text are we converting?',
            type: ApplicationCommandOptionType.String,
            required: true,
            max_length: 2000, // eslint-disable-line camelcase
        },
    ],
    cooldown: 5,
    category: 'Utility',
    ownerOnly: false,
    disabled: false,
    developerOnly: false,

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const text = interaction.options.getString('text');

        figlet.text(text, async (err, data) => {
            if (err) {
                client.logger.error(err);
                return await interaction.reply({
                    embeds: [
                        {
                            description: 'Something went wrong.',
                            color: client.config.commands.embeds.color,
                        },
                    ],
                    ephemeral: true,
                });
            }

            await interaction.reply({
                embeds: [
                    {
                        description: ['```', data, '```'].join('\n'),
                        color: client.config.commands.embeds.color,
                    },
                ],
            });
        });
    },
};
