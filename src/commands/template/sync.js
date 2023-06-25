import { Command } from '../../helpers/Command.js';

export default class SyncCommand extends Command {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = 'sync';
        this.description = 'Sync\'s the backup data with the database';
        this.aliases = ['synchronize'];
        this.cooldown = 5;
        this.usage = 'sync';
        this.module = 'Backup';
        this.for_developers = false;
        this.for_guilds = false;
        this.for_owners = true;
        this.is_disabled = true;
        this.required_permissions = [];
    }

    /**
    * @param {import('discord.js').Message} message
    * @param {string[]} args
    */
    async execute(client, message, args) {
        await client.send({ channel: message.channel, content: '...' });
    }
}
