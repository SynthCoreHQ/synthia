import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, codeBlock, inlineCode } from 'discord.js';

export default {
    name: 'help',
    description: 'Wanna get some help? Use me to do so!',
    type: 1,
    aliases: [],
    options: [
        {
            name: 'command',
            description: 'Is there any specific command name you wanna get info about?',
            type: ApplicationCommandOptionType.String,
        },
    ],
    cooldown: 5,
    category: 'Moderation',
    example: 'timeout @user [duration] <reason>',
    ownerOnly: false,
    disabled: false,
    developerOnly: false,
    userPermissions: [],
    botPermissions: [],

    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const command = interaction.options.getString('command');


        try {
            if (!command) {
                const commands = client.commands.map((cmd) => inlineCode(cmd.name)).join(', ');

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(client.config.commands.embeds.title.replace(/{text}/, 'Help Command'))
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
                            .setThumbnail(client.config.icon)
                            .setColor(client.config.commands.embeds.aestheticColor), // eslint-disable-line max-len
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents([
                                new ButtonBuilder()
                                    .setLabel('Invite Me')
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(client.config.invitationUrl),

                                new ButtonBuilder()
                                    .setLabel('Support Server')
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(client.config.guild.inviteCode),
                            ]),
                    ],
                });
            }

            const specificCommand = client.commands.get(command.toLowerCase());

            if (!specificCommand) {
                return await interaction.reply({
                    content: `Command ${inlineCode(command)} not found.`,
                    ephemeral: true,
                });
            }

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(client.config.commands.embeds.title.replace(/{text}/, 'Help Command'))
                        .setDescription([
                            "I'm **@Synthia**, A sleek and sophisticated Discord bot designed to make your server experience even better.",
                        ].join('\n'))
                        .setThumbnail(client.config.icon)
                        .setColor(client.config.commands.embeds.aestheticColor),
                    new EmbedBuilder()
                        .setTitle(client.config.commands.embeds.title.replace(/{text}/, 'Command Information'))
                        .setDescription([
                            `> **Name**: ${specificCommand.name}`,
                            `> **Description**: ${specificCommand.description}`,
                            `> **Usage**: ${specificCommand.example}`,
                            `> **Module**: ${specificCommand.category}`,
                            `> **Cooldown**: ${specificCommand.cooldown}`,
                            `> **Options**: ${specificCommand.options.map(opt => inlineCode(opt.name)).join(', ')}`,
                            // `> Is Disabled: ${specificCommand.disabled}`,
                            // `> Is Owner Only: ${specificCommand.ownerOnly}`,
                            // `> Is Developer Only: ${specificCommand.developerOnly}`,
                        ].join('\n'))
                        // .setThumbnail(client.config.icon)
                        .setColor(client.config.commands.embeds.color),
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents([
                            new ButtonBuilder()
                                .setLabel('Invite Me')
                                .setStyle(ButtonStyle.Link)
                                .setURL(client.config.invitationUrl),

                            new ButtonBuilder()
                                .setLabel('Support Server')
                                .setStyle(ButtonStyle.Link)
                                .setURL(client.config.guild.inviteCode),
                        ]),
                ],
            });
        } catch (e) {
            client.logger.error(e.stack);
        }
    },
};
