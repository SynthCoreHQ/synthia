import { ApplicationCommandOptionType, codeBlock } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';
import { exec } from 'node:child_process';

export default class ShellCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'shell';
        this.description = 'The shell command for the developers that executes commands in the shell!';
        this.module = 'Development';
        this.developerOnly = true;
        this.options = [
            {
                name: 'command',
                description: 'The command to execute in the shell',
                required: true,
                type: ApplicationCommandOptionType.String,
            },
        ];
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        const executableCommand = interaction.options.getString('command', true);

        try {
            await interaction.deferReply();

            exec(executableCommand, async (err, result) => {
                if (err) {
                    console.error(err);
                }
                return await this.broadcastRespone(interaction, { message: codeBlock('js', result.slice(0, 2000) || 'No result'), hidden: false });
            });
        } catch (e) {
            this.client.logger.error(e);
            return await this.broadcastRespone(interaction, { message: 'Something went wrong!', hidden: true });
        }
    }
}
