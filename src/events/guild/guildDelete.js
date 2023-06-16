import { Events } from 'discord.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';

export default class GuildDeleteEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.GuildDelete;
    }

    /**
    * @param {import('discord.js').Guild} guild
    */
    async executeEvent(guild) {
        try {
            const owner = await this.client.users.fetch(guild.ownerId);
            await owner.createDM();

            await owner.dmChannel?.send({
                content: [
                    `I have left your server, ${guild.name}.`,
                ].join('\n'),
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 5,
                                label: 'Reinvite',
                                url: this.client.config.invitationUrl,
                            },
                            {
                                type: 2,
                                style: 4,
                                customId: 'purge_data',
                                label: 'Purge Data',
                            },
                        ],
                    },
                ],
            });

            const collector = owner.dmChannel.createMessageComponentCollector({
                filter: (i) => i.user.id === owner.id,
                time: 30000,
            });

            collector.on('collect', async (i) => {
                if (i.customId === 'purge_data') {
                    await i.update({
                        content: 'Are you sure you want to purge your data?',
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        style: 4,
                                        customId: 'yes',
                                        label: 'Confirm',
                                    },
                                    {
                                        type: 2,
                                        style: 2,
                                        customId: 'no',
                                        label: 'Cancel',
                                    },
                                ],
                            },
                        ],
                    });

                    const collector2 = owner.dmChannel.createMessageComponentCollector({
                        filter: (i2) => i2.user.id === owner.id,
                        time: 30000,
                    });

                    collector2.on('collect', async (i2) => {
                        if (i2.customId === 'yes') {
                            await this.client.guildData.delete(guild.id);
                            await i2.update({
                                content: 'Your data has been purged.',
                                components: [],
                            });
                        } else {
                            await i2.update({
                                content: 'Your data has not been purged.',
                                components: [],
                            });
                        }
                    });
                }
            });
        } catch (e) {
            // this.client.logger.error(e);
            console.error(e);
        }
    }
}
