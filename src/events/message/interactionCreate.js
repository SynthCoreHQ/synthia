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

                if (command.options.developerOnly) {
                    if (!client.config.developers.includes(interaction.user.id)) {
                        return await interaction.reply({
                            embeds: [
                                {
                                    description: 'This command can only be used by bot developers.',
                                    color: client.config.embeds.color.secondary,
                                },
                            ],
                        });
                    }
                }

                if (command.options.disabled) {
                    return await interaction.reply({
                        embeds: [
                            {
                                description: 'This command has been disabled & can no longer be used by anyone.',
                                color: client.config.embeds.color.secondary,
                            },
                        ],
                    });
                }

                if (command.options.ownerOnly) {
                    if (interaction.user.id !== interaction.guild.ownerId) {
                        return await interaction.reply({
                            embeds: [
                                {
                                    description: 'This command can only be used by server owners.',
                                    color: client.config.embeds.color.secondary,
                                },
                            ],
                        });
                    }
                }

                command.run(client, interaction);
            } catch (err) {
                client.logger.error(err);
                return await interaction.reply({
                    content: `An error occured while executing ${interaction.commandName} command.`,
                });
            }
        }
    },
};
