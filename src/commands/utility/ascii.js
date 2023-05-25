import { SlashCommandBuilder } from 'discord.js';
import figlet from 'figlet';

export default {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Wanna convert your text to a cool looking ascii art? Use me to do so!')
        .addStringOption((option) =>
            option.setName('text').setDescription('What text are we converting?').setRequired(true).setMaxLength(2000),
        ),
    options: {
        developerOnly: false,
        disabled: false,
        ownerOnly: false,
        category: 'Utility',
        cooldown: 5,
    },

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
                    embeds: [{ description: 'Something went wrong.', color: client.config.embeds.color.secondary }],
                    ephemeral: true,
                });
            }

            await interaction.reply({
                embeds: [{ description: ['```', data, '```'].join('\n'), color: client.config.embeds.color.secondary }],
            });
        });
    },
};
