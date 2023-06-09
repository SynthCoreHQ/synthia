import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, codeBlock, inlineCode } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class HelpCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = 'help';
        this.description = 'Wanna get some help? Use me to do so!';
        this.options = [
            {
                name: 'command',
                description: 'Is there any specific command name you wanna get info about?',
                type: ApplicationCommandOptionType.String,
                // choices: this.client.interactionCommands.map,
            },
        ];
    }

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async executeCommand(interaction) {
        const command = interaction.options.getString('command');

        try {
            if (!command) {
                const commands = this.client.interactionCommands.map((cmd) => inlineCode(cmd.name)).join(', ');

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(this.client.config.commands.embeds.title.replace(/{text}/, 'Help Command'))
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
                            .setColor(this.client.config.commands.embeds.aestheticColor), // eslint-disable-line max-len
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

            const specificCommand = this.client.interactionCommands.get(command.toLowerCase());

            if (!specificCommand) {
                return await interaction.reply({
                    content: `Command ${inlineCode(command)} not found.`,
                    ephemeral: true,
                });
            }

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(this.client.config.commands.embeds.title.replace(/{text}/, 'Help Command'))
                        .setDescription([
                            "I'm **@Synthia**, A sleek and sophisticated Discord bot designed to make your server experience even better.",
                        ].join('\n'))
                        .setThumbnail(this.client.config.icon)
                        .setColor(this.client.config.commands.embeds.aestheticColor),
                    new EmbedBuilder()
                        .setTitle(this.client.config.commands.embeds.title.replace(/{text}/, 'Command Information'))
                        .setDescription([
                            `> **Name**: ${specificCommand.name}`,
                            `> **Description**: ${specificCommand.description}`,
                            `> **Usage**: ${specificCommand.example}`,
                            `> **Module**: ${specificCommand.module}`,
                            `> **Cooldown**: ${specificCommand.cooldown}`,
                            `> **Options**: ${specificCommand.options
                                ? specificCommand.options.map(opt => inlineCode(opt.name)).join(', ') :
                                'No Options'}`,
                            // `> Is Disabled: ${specificCommand.disabled}`,
                            // `> Is Owner Only: ${specificCommand.ownerOnly}`,
                            // `> Is Developer Only: ${specificCommand.developerOnly}`,
                        ].join('\n'))
                        // .setThumbnail(client.config.icon)
                        .setColor(this.client.config.commands.embeds.color),
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
        } catch (e) {
            this.client.logger.error(e.stack);
        }
    }
}
