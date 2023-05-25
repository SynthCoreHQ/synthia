import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Is the bot even working? use me and test it.'),
    options: {
        developerOnly: false,
        disabled: false,
        ownerOnly: false,
        category: 'Utility',
        cooldown: 5,
    },

    /**
     * @param {import('../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        await interaction.reply('The handler is working fine.');
    },
};
