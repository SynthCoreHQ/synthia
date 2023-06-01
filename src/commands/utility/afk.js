import { ApplicationCommandOptionType } from 'discord.js';
import { Afk } from '../../models/afk.js';

export default {
    name: 'afk',
    description: 'Are you away from keyboard? Use me to broadcast it.',
    type: 1,
    aliases: [],
    options: [
        {
            name: 'reason',
            description: 'Is there a specific reason behind being away from keyboard? You can specify it here.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    cooldown: 5,
    category: 'Utility',
    ownerOnly: false,
    disabled: false,
    developerOnly: false,

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
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
                        color: client.config.commands.embeds.color,
                    },
                ],
            });
        } else {
            await Afk.destroy({ where: { id: interaction.user.id } });

            return interaction.reply({
                embeds: [
                    {
                        description: "You're no longer afk.",
                        color: client.config.commands.embeds.color,
                    },
                ],
            });
        }
    },
};
