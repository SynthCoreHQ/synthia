import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'play',
    description: 'Wanna listen to some music? Use me to do so!',
    type: 1,
    options: [
        {
            name: 'query',
            description: 'Any song name in mind?',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    cooldown: 5,
    category: 'Utility',
    inVoice: true,
    disabled: false,
    ownerOnly: false,
    developerOnly: false,

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const query = interaction.options.getString('query');

        try {
            client.music.play(interaction.member.voice.channel, query, {
                member: interaction.member,
                textChannel: interaction.channel,
            });

            return await interaction
                .reply({
                    content: `Searching \`${query}\``,
                    ephemeral: true,
                })
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete().catch(() => {
                            null;
                        });
                    }, 3000);
                });
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};
