import { Events } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        if (interaction.isCommand()) {
            try {
                const command = client.commands.get(interaction.commandName);

                if (!command) return interaction.reply({ content: `${interaction.commandName} command not found.` });

                command.run(client, interaction);
            } catch (err) {
                client.logger.error(err);
            }
        }
    },
};
