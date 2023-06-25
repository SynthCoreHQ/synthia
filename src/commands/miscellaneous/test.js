import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, EmbedType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Command } from '../../helpers/Command.js';

export default class TestCommand extends Command {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = 'test';
        this.description = 'This is a test command!';
        this.aliases = ['t'];
        this.cooldown = 5;
        this.usage = '';
        this.module = 'Miscellaneous';
        this.for_developers = true;
        this.for_guilds = false;
        this.for_owners = false;
        this.is_disabled = false;
        this.required_permissions = [];
    }

    /**
     * @param {import('../../helpers/client/Client.js').Client} client
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(client, message, args) {
        await client.send({
            channel: message.channel,
            embed_data: [client.embed({ description: 'This is a test!' })]
        });
    }
}
