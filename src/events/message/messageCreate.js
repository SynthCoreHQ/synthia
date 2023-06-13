import { EmbedBuilder, Events, codeBlock } from 'discord.js';
import { Afk } from '../../database/models/afk.js';
import { BaseEvent } from '../../helpers/base/BaseEvent.js';

export default class MessageCreateEvent extends BaseEvent {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);

        this.name = Events.MessageCreate;
    }

    /**
     * @param {import('discord.js').Message} message
     */
    // eslint-disable-next-line max-statements
    async executeEvent(message) {
        const { client } = this;

        const defaultPrefix = client.config.globalPrefix;

        if (message.content === `<@${client.user.id}>`) {
            try {
                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(client.config.embeds.title.replace(/{text}/, 'Introduction'))
                            .setDescription([
                                `Hey ${message.author}, Do you need any kind of help?`,
                            ].join('\n'))
                            .addFields([
                                {
                                    name: 'Prefix',
                                    value: `${codeBlock(defaultPrefix)}`,
                                },
                                {
                                    name: 'Modules',
                                    value: [
                                        '> 1. Utility',
                                        '> 2. Music',
                                        '> 3. Moderation',
                                        '> 4. Configuration',
                                        '> 5. Administration',
                                    ].join('\n'),
                                },
                            ])
                            .setThumbnail(client.config.icon)
                            .setColor(client.config.embeds['aestheticColor'])
                            .setFooter({ text: client.config.embeds.footer.replace(/{text}/, 'SynthCore') }),
                    ],
                });
            } catch (er) {
                client.logger.error(er);
            }
        }

        const afkData = await Afk.findOne({ where: { id: message.author.id } });

        if (afkData) {
            await Afk.destroy({ where: { id: message.author.id } });
            await message.reply({
                embeds: [
                    {
                        description: "You're no longer afk.",
                        color: client.config.embeds.color,
                    },
                ],
            });
        }

        message.mentions.members.forEach(async (u) => {
            if (
                !message.content.includes('@here') &&
                !message.content.includes('@everyone')
            ) {
                const data = await Afk.findOne({ where: { id: u.id } });

                if (data) {
                    await message.reply({
                        embeds: [
                            {
                                description: `${u.displayName} is currently afk, reason: ${data.reason}`,
                                color: client.config.embeds.color,
                            },
                        ],
                        tts: true,
                    });
                }
            }
        });

        if (
            message.author.bot
            || !message.guild
            || !message.content.startsWith(defaultPrefix)

        ) {
            return;
        }

        const args = message.content.slice(defaultPrefix.length).trim().split(/ +/g); // eslint-disable-line max-len
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command);

        if (!cmd) {
            return;
        }

        try {
            cmd.execute(client, message);
        } catch (e) {
            client.logger.error(e);
        }
    }
}
