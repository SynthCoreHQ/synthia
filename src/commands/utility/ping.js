export default {
    name: 'ping',
    description: 'Is the bot even working? use me and test it.',
    type: 1,
    cooldown: 5,
    category: 'Utility',
    disabled: false,
    ownerOnly: false,
    developerOnly: false,

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.reply({ embeds: [{ title: `My ping is: ${client.ws.ping}ms`, color: client.config.commands.embeds.aestheticColor }] });
        } catch (e) {
            client.logger.error(e);
        }
    },
};
