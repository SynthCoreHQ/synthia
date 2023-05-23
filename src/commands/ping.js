import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Is the bot even working? use me and test it.'),

    /**
     * @param {import('../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        await interaction.reply('The handler is working fine.');
    },
};
