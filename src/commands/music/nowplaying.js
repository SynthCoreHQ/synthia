import { EmbedBuilder, bold, hyperlink, inlineCode } from 'discord.js';

export default {
    name: 'nowplaying',
    description: 'Wanna check the current playing music? Use me to do so!',
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

            const song = queue.songs[0];
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.emotes.right} | Now Playing: ${bold(inlineCode(song.name))}, by ${hyperlink(song.user.username, `https://discord.com/users/${song.user.id}`)}`)
                        .setColor(client.config.commands.embeds.aestheticColor),
                ],
                ephemeral: true,
            });
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};
