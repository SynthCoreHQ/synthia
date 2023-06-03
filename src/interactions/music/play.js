import { ApplicationCommandOptionType } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class PlayCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'play';
        this.description = 'Wanna listen some songs? Use me to do so!';
        this.module = 'Music';
        this.options = [
            {
                name: 'query',
                description: 'Any song name in mind?',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const { client } = this;
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
    }
}
