import { ApplicationCommandOptionType } from 'discord.js';
import { Afk } from '../../models/afk.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class AfkCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'afk';
        this.description = 'Are you away from keyboard? Use me to broadcast it.';
        this.options = [
            {
                name: 'reason',
                description: 'Is there a specific reason behind being away from keyboard? You can specify it here.',
                type: ApplicationCommandOptionType.String,
            },
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const reason = interaction.options.getString('reason') || 'I am afk.';

        const afkData = await Afk.findOne({
            where: { id: interaction.user.id },
        });

        if (!afkData) {
            await Afk.create({
                id: interaction.user.id,
                reason: reason,
            });

            await interaction.reply({
                embeds: [
                    {
                        description: "You're now afk!",
                        color: this.client.config.commands.embeds.color,
                    },
                ],
            });
        } else {
            await Afk.destroy({ where: { id: interaction.user.id } });

            return interaction.reply({
                embeds: [
                    {
                        description: "You're no longer afk.",
                        color: this.client.config.commands.embeds.color,
                    },
                ],
            });
        }
    }
}
