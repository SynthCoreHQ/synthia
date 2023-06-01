export default {
    name: 'membercount',
    description: 'Wanna check the total number of members? Use me to do so!',
    type: 1,
    aliases: [],
    cooldown: 5,
    category: 'Utility',
    example: 'membercount',
    ownerOnly: false,
    disabled: false,
    developerOnly: false,
    userPermissions: [],
    botPermissions: [],

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.reply('Coming Soon!');
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};
