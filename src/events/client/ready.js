import { ActivityType, Events } from 'discord.js';
import { Event } from '../../helpers/Event.js';

export default class ReadyEvent extends Event {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = Events.ClientReady;
        this.once = true;
    }

    async execute(client) {
        client.logger.info(import.meta.url, `${client.user.username} has been started!`);

        const activities = [
            {
                name: `${this.configuration.default_prefix}help | theidiotguy`,
                type: ActivityType.Streaming,
                url: 'https://www.twitch.tv/discord'
            },
            {
                name: `${this.configuration.default_prefix}ping | thory`,
                type: ActivityType.Streaming,
                url: 'https://www.twitch.tv/discord'
            },
            {
                name: `${this.configuration.default_prefix}test | synthia`,
                type: ActivityType.Streaming,
                url: 'https://www.twitch.tv/discord'
            }
        ]

        let i = 0;
        setInterval(() => {
            const activity = activities[i];
            client.user.setActivity(activity);
            i = ++i % activities.length;
        }, 10000);
    }
}
