import { PermissionFlagsBits } from 'discord.js';
import { Command } from '../../helpers/Command.js';

export default class PurgeCommand extends Command {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = 'purge';
        this.description = 'Purge messages from a channel';
        this.aliases = ['clear', 'delete'];
        this.cooldown = 10;
        this.usage = '';
        this.module = 'Moderation';
        this.for_developers = false;
        this.for_guilds = false;
        this.for_owners = false;
        this.is_disabled = false;
        this.required_permissions = [PermissionFlagsBits.ManageMessages];
    }

    /**
    * @param {import('../../helpers/client/Client.js').Client} client
    * @param {import('discord.js').Message} message
    * @param {string[]} args
    */
    async execute(client, message, args) {
        const amount = parseInt(args[0]);

        const purge = async (amount) => {
            const messages = await message.channel.messages.fetch({ limit: amount > 100 ? 100 : amount });

            await message.channel.bulkDelete(messages, true);

            if (amount > 100) {
                setTimeout(() => {
                    purge(amount - 100);
                }, 1000);
            }
        };

        if (isNaN(amount)) {
            message.channel.send({ content: 'Please provide a valid number!' }).then(msg => {
                setTimeout(() => {
                    msg.deletable ? msg.delete() : null;
                }, 3000);
            });
        }

        if (amount < 1) {
            message.channel.send({ content: 'Please provide a number greater than 0!' }).then(msg => {
                setTimeout(() => {
                    msg.deletable ? msg.delete() : null;
                }, 3000);
            });
        }

        if (amount > 1000) {
            message.channel.send({ content: 'Please provide a number less than 1000!' }).then(msg => {
                setTimeout(() => {
                    msg.deletable ? msg.delete() : null;
                }, 3000);
            });
        }

        await purge(amount + 1).then(() => {
            setTimeout(() => {
                message.channel.send({ content: `Successfully purged ${amount} messages!` }).then(msg => {
                    setTimeout(() => {
                        msg.deletable ? msg.delete() : null;
                    }, 3000);
                });
            }, 1000);
        });
    }
}
