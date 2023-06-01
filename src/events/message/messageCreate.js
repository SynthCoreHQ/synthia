import { Events } from 'discord.js';
import { Afk } from '../../models/afk.js';

export default {
    name: Events.MessageCreate,
    /**
     * @param {import('../../helpers/Client.js').Client} client
     * @param {import('discord.js').Message} message
     */
    // eslint-disable-next-line max-statements
    run: async (client, message) => {
        const defaultPrefix = client.config.commands.globalPrefix;

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

        // if (cmd.inVoice && !message.member.voice.channel) {
        //     return message.channel.send('Must be in a voice channel!');
        // }

        const afkData = await Afk.findOne({ where: { id: message.author.id } });

        if (afkData) {
            await Afk.destroy({ where: { id: message.author.id } });
            await message.reply({
                embeds: [
                    {
                        description: "You're no longer afk.",
                        color: client.config.commands.embeds.color,
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
                                color: client.config.commands.embeds.color,
                            },
                        ],
                        tts: true,
                    });
                }
            }
        });

        try {
            cmd.execute(client, message);
        } catch (e) {
            client.logger.error(e);
        }
    },
};
