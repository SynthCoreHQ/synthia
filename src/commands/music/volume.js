import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export default {
    name: 'volume',
    description: 'Wanna adjust the music volume? Use me to do so!',
    options: [
        {
            name: 'input',
            description: 'Specify a digit between 0-100',
            type: ApplicationCommandOptionType.Integer,
            min_value: 1, // eslint-disable-line camelcase
            max_value: 100, // eslint-disable-line camelcase
        },
    ],
    type: 1,
    cooldown: 5,
    category: 'Music',
    inVoice: true,
    disabled: false,
    ownerOnly: false,
    developerOnly: false,

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const volume = interaction.options.getInteger('input');

        try {
            const queue = client.music.client.getQueue(interaction.guild);

            if (!queue) {
                return await interaction.reply({
                    content: `${client.emotes.wrong} | The queue is empty right now!`,
                    ephemeral: true,
                });
            }

            if (!volume) {
                return await interaction.reply({
                    content: `Current Volume: ${queue.volume}%`,
                });
            }

            queue.setVolume(volume);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.emotes.right} | Set the volume to ${queue.volume}%`)
                        .setColor(client.config.commands.embeds.aestheticColor),
                ],
                ephemeral: true,
            });
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};
