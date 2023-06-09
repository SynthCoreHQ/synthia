import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';
import { Guild } from '../../database/models/guild.js';
import { ApplicationCommandOptionType, codeBlock } from 'discord.js';

export default class SetupCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'setup';
        this.description = 'Having trouble setting up the server? Use me to make it easy!';
        this.module = 'Moderation';
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        try {
            await interaction.reply('Configuring the guild...');

            const collector = interaction.channel.createMessageCollector(
                { time: 10_000 },
            );

            collector.on('collect', async i => {
                // await interaction.editReply('What prefix would you like to use?').then((res) => {
                // });
            });

            collector.on('end', async collected => {
                await interaction.followUp('Collected ended!');
            });
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
