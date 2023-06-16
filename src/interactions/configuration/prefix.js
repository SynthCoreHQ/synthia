import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class PrefixCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'prefix';
        this.description = 'Configure the prefix for the bot';
        this.module = 'Configuration';
        this.options = [
            {
                name: 'input',
                description: 'The prefix you want to use',
                type: 3,
                required: true,
            },
        ];
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        try {
            const { client } = this;
            const { guild } = interaction;
            const prefix = interaction.options.getString('input', true);

            await client.guildData.update(guild.id, { prefix });

            return await interaction.reply(`Prefix has been updated to \`${prefix}\``);
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
