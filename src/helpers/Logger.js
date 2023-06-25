import chalk from 'chalk';
import { Colors, GuildMember, TextChannel } from 'discord.js';
import path from 'path';
import * as url from 'url';
import { Client } from './client/Client.js';

export class Logger {
    /**
     * @param {Client} client
     */
    constructor(client) {
        this.client = client;
    }

    print(type, ...message) {
        if (!message) {
            throw new Error('Missing parameter: message');
        }

        return console.log(`(Process: ${process.pid}) | [${path.basename(url.fileURLToPath(type))}]: ${message.join(' ')}`);
    }

    /**
     * @param {TextChannel} channel
     * @param {import('discord.js').EmbedData[]} embeds
     */
    async report(channel, embeds) {
        const report_channel = await this.client.utility.resolve_channel(channel.id);

        if (report_channel)
            return await this.client.send({ channel: report_channel, embed_data: [...embeds] });
    }

    info(type, ...message) {
        return this.print(type, chalk.cyanBright(...message));
    }

    warn(type, ...message) {
        return this.print(type, chalk.yellowBright(...message));
    }

    error(type, error) {
        return this.print(type, chalk.redBright(error instanceof Error ? error.stack : error));
    }

    debug(type, ...message) {
        if (!process.argv.includes('--debug')) return;

        return this.print(type, chalk.magentaBright(...message));
    }
}