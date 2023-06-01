import { Events } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').BaseInteraction} interaction
     */
    // eslint-disable-next-line max-statements
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) {
            try {
                const command = client.commands.get(interaction.commandName);

                if (!command) {
                    return interaction.reply({
                        content:
                            `${interaction.commandName} command not found.`,
                    });
                }

                if (
                    command.developerOnly &&
                    !client.config.developers.includes(interaction.user.id)
                ) {
                    return await interaction.reply({
                        embeds: [
                            {
                                description: 'This command can only be used by bot developers.',
                                color: client.config.commands.embeds.color,
                            },
                        ],
                    });
                }

                if (command.disabled) {
                    return await interaction.reply({
                        embeds: [
                            {
                                description: 'This command has been disabled & can no longer be used by anyone.',
                                color: client.config.commands.embeds.color,
                            },
                        ],
                    });
                }

                if (command.inVoice && !interaction.member.voice.channel) {
                    return await interaction.reply('Must be in a voice channel!');
                }

                if (
                    command.ownerOnly &&
                    interaction.user.id !== interaction.guild.ownerId
                ) {
                    return await interaction.reply({
                        embeds: [
                            {
                                description: 'This command can only be used by server owners.',
                                color: client.config.commands.embeds.color,
                            },
                        ],
                    });
                }

                command.run(client, interaction);
            } catch (err) {
                client.logger.error(err);
                return await interaction.reply({
                    content: `An error occured while executing ${interaction.commandName} command.`,
                });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === '_pause') {
                const queue = client.music.client.getQueue(interaction.guild);

                if (!queue) {
                    return await interaction.reply({
                        content: `${client.emotes.wrong} | The queue is empty right now!`,
                        ephemeral: true,
                    });
                }

                const resumeQueue = async () => {
                    queue.resume();

                    return await interaction.reply({
                        content: 'The queue has been resumed!',
                        // ephemeral: true,
                    });
                };

                const pauseQueue = async () => {
                    queue.pause();

                    return await interaction.reply({
                        content: 'The queue has been paused!',
                        // ephemeral: true,
                    });
                };

                queue.paused
                    ? resumeQueue()
                    : pauseQueue();
            }

            if (interaction.customId === '_prev') {
                const queue = client.music.client.getQueue(interaction.guild);

                if (!queue) {
                    return await interaction.reply({
                        content: `${client.emotes.wrong} | The queue is empty right now!`,
                        ephemeral: true,
                    });
                }

                if (!queue.previousSongs) {
                    return await interaction.reply({
                        content: 'No previous songs found...',
                    });
                }

                const song = await queue.previous();

                return await interaction.reply({
                    content: `Now playing: ${song.name}`,
                    // ephemeral: true,
                });
            }

            if (interaction.customId === '_next') {
                const queue = client.music.client.getQueue(interaction.guild);

                if (!queue) {
                    return await interaction.reply({
                        content: `${client.emotes.wrong} | The queue is empty right now!`,
                        ephemeral: true,
                    });
                }

                const song = await queue.skip();
                return await interaction.reply({
                    content: `Skipped! Now playing: ${song.name}`,
                    // ephemeral: true,
                });
            }

            if (interaction.customId === '_autoplay') {
                const queue = client.music.client.getQueue(interaction.guild);

                if (!queue) {
                    return await interaction.reply({
                        content: `${client.emotes.wrong} | The queue is empty right now!`,
                        ephemeral: true,
                    });
                }

                const autoplay = queue.toggleAutoplay();
                return await interaction.reply({
                    content: `Autoplay: \`${autoplay
                        ? 'On'
                        : 'Off'}\``,
                    // ephemeral: true,
                });
            }

            if (interaction.customId === '_stop') {
                const queue = client.music.client.getQueue(interaction.guild);

                if (!queue) {
                    return await interaction.reply({
                        content: `${client.emotes.wrong} | The queue is empty right now!`,
                        ephemeral: true,
                    });
                }

                await queue.stop();
                return await interaction.reply({
                    content: 'Music Stopped!',
                    // ephemeral: true,
                });
            }
        }

    },
};
