export default {
    name: 'setup',
    description: 'Want to setup the server in one go? Use me to do so!',
    type: 1,
    cooldown: 10,
    category: 'Configuration',
    disabled: false,
    ownerOnly: true,
    developerOnly: false,

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            // ...
        } catch (e) {
            client.logger.error(e);
        }
    },
};
