import { EmbedBuilder } from 'discord.js';

export default {
    name: 'stop',
    description: 'Wanna stop the music? Use me to do so!',
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
        try {
            const queue = client.music.client.getQueue(interaction.guild);

            if (!queue) {
                return await interaction.reply({
                    content: `${client.emotes.wrong} | The queue is empty right now!`,
                    ephemeral: true,
                });
            }

            await queue.stop();
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.emotes.right} | Stopped the music.`)
                        .setColor(client.config.commands.embeds.aestheticColor),
                ],
                // ephemeral: true,
            });
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};
