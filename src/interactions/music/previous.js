import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class PreviousCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'previous';
        this.description = 'Wanna listen the previous song again? Use me to do so!';
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

            if (!queue || !queue.node.isPlaying()) {
                return await interaction.reply('Empty Queue!');
            }

            await queue.history.previous();

            return await interaction.reply(`Playing: ${queue.currentTrack}`);
        } catch (e) {
            // this.client.logger.error(e);
            await interaction.reply('No previous tracks!');
        }
    }
}
