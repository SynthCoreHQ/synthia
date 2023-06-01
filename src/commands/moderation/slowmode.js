export default {
    name: 'slowmode',
    description: 'Want to configure the slowmode for a channel? Use me to do so!',
    type: 1,
    cooldown: 5,
    category: 'Moderation',
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
