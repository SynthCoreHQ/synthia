export default {
    name: 'lock',
    description: 'Want to lock a channel or the whole server? Use me to do so!',
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
