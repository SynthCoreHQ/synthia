import { Events } from 'discord.js';
import { Event } from '../helpers/Event.js';

export default class GuildDeleteEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.GuildDelete;
    }

    /**
     * @param {import('../helpers/client/Client.js').Client} client
     * @param {import('discord.js').Guild} guild
     */
    async execute(client, guild) {
        const owner = await client.users.fetch(guild.ownerId);
        await owner.createDM();

        await client.send({
            channel: owner.dmChannel,
            embed_data: [
                client.embed({
                    title: 'Goodbye',
                    description: `Thanks for using ${client.user.username}!\n\nIf you have any questions, please join the [support server](https://discord.gg/2SUybzb)`,
                    type: 'primary',
                }),
            ]
        });
    }
}
