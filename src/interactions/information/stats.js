import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, codeBlock, version } from 'discord.js';
import { InteractionCommand } from '../../helpers/base/InteractionCommand.js';

export default class StatsCommand extends InteractionCommand {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
        this.name = 'stats';
        this.description = 'Get some stats about me!';
        this.module = 'Information';
    }

    /**
    * @param {import('discord.js').ChatInputCommandInteraction} interaction
    */
    async executeCommand(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle(this.client.config.embeds.title.replace(/{text}/, 'Statistics'))
                .setDescription(`> **${this.client.user.username}** is a bot made by SynthCore.`)
                .addFields([
                    {
                        name: 'Servers',
                        value: codeBlock(this.client.guilds.cache.size),
                        inline: true,
                    },
                    {
                        name: 'Users',
                        // eslint-disable-next-line max-len
                        value: codeBlock(this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)),
                        inline: true,
                    },
                    {
                        name: 'Channels',
                        value: codeBlock(this.client.channels.cache.size),
                        inline: true,
                    },
                    {
                        name: 'Uptime',
                        value: `<t:${Math.floor(this.client.readyTimestamp / 1000)}:R>`,
                        inline: true,
                    },
                    {
                        name: 'Memory Usage',
                        value: codeBlock(`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`),
                        inline: true,
                    },
                    {
                        name: 'Node.js Version',
                        value: codeBlock(process.version),
                        inline: true,
                    },
                    {
                        name: 'Discord.js Version',
                        value: codeBlock(version),
                        inline: true,
                    },
                ])
                .setColor(this.client.config.embeds.aestheticColor)
                .setThumbnail(this.client.config.icon)
                .setTimestamp()
                .setFooter({ text: this.client.config.embeds.footer.replace(/{text}/, 'SynthCore') });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('refresh')
                        // .setLabel('Refresh')
                        .setEmoji(this.client.config.emotes.autoplay)
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setLabel('Invite Me')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot%20applications.commands&permissions=8`),

                    new ButtonBuilder()
                        .setLabel('Support Server')
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.guild.inviteCode),

                    new ButtonBuilder()
                        .setCustomId('delete')
                        // .setLabel('Delete')
                        .setEmoji(this.client.config.emotes.delete)
                        .setStyle(ButtonStyle.Danger),
                );

            await interaction.reply({
                embeds: [embed], components: [row],
            });

            // eslint-disable-next-line max-len
            const collector = interaction.channel.createMessageComponentCollector({ time: 10_000 });

            collector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id) return i.reply({ content: 'You cannot use this button.', ephemeral: true });

                if (i.customId === 'refresh') {
                    await i.update({ embeds: [embed] });
                }

                if (i.customId === 'delete') {
                    await i.update({ content: 'Purged.', embeds: [], components: [] });
                }
            });

            collector.on('end', async () => {
                await interaction.deleteReply();
            });
        } catch (e) {
            // this.client.logger.error(e);
            console.error(e);
        }
    }
}
