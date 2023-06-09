import { EmbedBuilder } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class SkipCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'skip';
        this.description = 'Wanna skip to the next song? Use me to do so!';
        this.module = 'Music';
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const UserVoiceChannel = interaction.member.voice.channel;
        const BotVoiceChannel = interaction.guild.members.me.voice.channel;

        if (BotVoiceChannel && UserVoiceChannel.id !== BotVoiceChannel.id) {
            return interaction.reply('You must be in the same voice channel as the bot.');
        }

        try {
            const queue = this.client.player.nodes.get(interaction.guild.id);
            await interaction.deferReply();

            if (!queue || !queue.node.isPlaying()) {
                return interaction.followUp('Empty Queue!');
            }

            queue.node.skip();

            return interaction.followUp(`Playing: ${queue.currentTrack}`);
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
