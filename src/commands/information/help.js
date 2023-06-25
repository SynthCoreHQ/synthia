import { ButtonStyle, inlineCode } from 'discord.js';
import { MessageCommand } from '../../helpers/base/MessageCommand.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, codeBlock } from '@discordjs/builders';

export default class HelpCommand extends MessageCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'help';
        this.description = 'Get a list of my commands!';
        this.aliases = ['h'];
        this.module = 'Information';
    }

    /**
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async executeCommand(client, message, args) {
        const command = args[0];

        if (!command) {
            const commands = this.client.messageCommands.map((cmd) => inlineCode(cmd.name)).join(', ');

            return await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(this.client.config.embeds.title.replace(/{text}/, 'Help Command'))
                        .setDescription([
                            "I'm **@Synthia**, A sleek and sophisticated Discord bot designed to make your server experience even better.",
                        ].join('\n'))
                        .addFields([
                            {
                                name: 'Prefix',
                                value: codeBlock('&'),
                            },
                            {
                                name: 'Commands',
                                value: commands,
                            },
                        ])
                        .setThumbnail(this.client.config.icon)
                        .setColor(this.client.config.embeds.aestheticColor), // eslint-disable-line max-len
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents([
                            new ButtonBuilder()
                                .setLabel('Invite Me')
                                .setStyle(ButtonStyle.Link)
                                .setURL(this.client.config.invitationUrl),

                            new ButtonBuilder()
                                .setLabel('Support Server')
                                .setStyle(ButtonStyle.Link)
                                .setURL(this.client.config.guild.inviteCode), // eslint-disable-line max-len
                        ]),
                ],
            });
        }

        const specificCommand = this.client.messageCommands.get(command.toLowerCase()); // eslint-disable-line max-len

        if (!specificCommand) {
            return await message.reply({
                content: `Command ${inlineCode(command)} not found.`,
            });
        }

        return await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(this.client.config.embeds.title.replace(/{text}/, 'Help Command'))
                    .setDescription([
                        "I'm **@Synthia**, A sleek and sophisticated Discord bot designed to make your server experience even better.",
                    ].join('\n'))
                    .setThumbnail(this.client.config.icon)
                    .setColor(this.client.config.embeds.aestheticColor), // eslint-disable-line max-len
                new EmbedBuilder()
                    .setTitle(this.client.config.embeds.title.replace(/{text}/, 'Command Information'))
                    .setDescription([
                        `> **Name**: ${specificCommand.name}`,
                        `> **Description**: ${specificCommand.description}`,
                        `> **Aliases**: ${specificCommand.aliases
                            ? specificCommand.aliases.map(alias => inlineCode(alias)).join(', ') :
                            'None'}`,
                        `> **Usage**: ${specificCommand.usage || 'None'}`,
                        `> **Module**: ${specificCommand.module}`,
                        `> **Cooldown**: ${specificCommand.cooldown} seconds`,
                        // `> Is Disabled: ${specificCommand.disabled}`,
                        // `> Is Owner Only: ${specificCommand.ownerOnly}`,
                        // `> Is Developer Only: ${specificCommand.developerOnly}`,
                    ].join('\n'))
                    // .setThumbnail(client.config.icon)
                    .setColor(this.client.config.embeds.color),
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setLabel('Invite Me')
                            .setStyle(ButtonStyle.Link)
                            .setURL(this.client.config.invitationUrl),

                        new ButtonBuilder()
                            .setLabel('Support Server')
                            .setStyle(ButtonStyle.Link)
                            .setURL(this.client.config.guild.inviteCode),
                    ]),
            ],
        });
    }
}
