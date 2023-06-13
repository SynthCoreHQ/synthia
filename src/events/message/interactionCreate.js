import { Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';
// import { Guild } from '../../database/models/guild.js';

export default class InteractionCreateEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.InteractionCreate;
    }

    /**
     * @param {import('discord.js').BaseInteraction} interaction
     */
    // eslint-disable-next-line max-statements
    async executeEvent(interaction) {
        const { client } = this;

        if (interaction.isChatInputCommand()) {
            try {
                const command = client.interactionCommands.get(interaction.commandName); // eslint-disable-line max-len

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
                                color: client.config.embeds.color,
                            },
                        ],
                    });
                }

                if (command.disabled) {
                    return await interaction.reply({
                        embeds: [
                            {
                                description: 'This command has been disabled & can no longer be used by anyone.',
                                color: client.config.embeds.color,
                            },
                        ],
                    });
                }

                if (
                    command.inVoiceChannel
                    && !interaction.member.voice.channel
                ) {
                    return await interaction.reply('Must be in a voice channel!');
                }

                if (
                    command.matchVoiceChannel
                    && interaction.guild.members.me.voice.channel
                    && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId // eslint-disable-line max-len
                ) {
                    return await interaction.reply('Must be in same voice channel!');
                }

                if (
                    command.ownerOnly &&
                    interaction.user.id !== interaction.guild.ownerId
                ) {
                    return await interaction.reply({
                        embeds: [
                            {
                                description: 'This command can only be used by server owners.',
                                color: client.config.embeds.color,
                            },
                        ],
                    });
                }

                if (command.module === 'Music') {
                    return await interaction.reply('The Music module is under development currently');
                } else {
                    command.executeCommand(interaction);
                }
            } catch (err) {
                client.logger.error('INTERACTION_CREATE', err);
                return await interaction.reply({
                    content: `An error occured while executing ${interaction.commandName} command.`,
                });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === '_pause') {
                const queue = client.music.getQueue(interaction.guild);

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
                const queue = client.music.getQueue(interaction.guild);

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
                const queue = client.music.getQueue(interaction.guild);

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
                const queue = client.music.getQueue(interaction.guild);

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
                const queue = client.music.getQueue(interaction.guild);

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
        } else if (interaction.isAutocomplete()) {
            // eslint-disable-next-line max-len
            const command = this.client.interactionCommands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (e) {
                console.error(e);
            }
        }
    }
}
