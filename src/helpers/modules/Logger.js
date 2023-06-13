import chalk from 'chalk';
import { WebhookClient, codeBlock } from 'discord.js';

export class Logger {
    /**
     * @param {import('../Client.js').Client} DiscordjsClient
     * @param {string} WebhookUrl
     */
    constructor(DiscordjsClient, WebhookUrl) {
        this.client = DiscordjsClient;
        this.logHook = new WebhookClient({ url: WebhookUrl });
    }

    get timestamps() {
        // eslint-disable-next-line new-cap
        return Intl.DateTimeFormat('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h24',
        }).format(Date.now());
    }

    log(level, message) {
        if (!message) {
            throw new Error('No log message.');
        }

        const formattedString = `${level} | ${this.timestamps} | ${message}`;

        return formattedString;
    }

    /**
     * @param {string} type
     * @param {string} message
     */
    info(type, message) {
        return console.log(this.log(chalk.blue.bold('INFO'), `[${type}] ${message}`));
    }

    /**
     * @param {string} type
     * @param {string} warning
     */
    warn(type, warning) {
        return console.warn(this.log(chalk.yellow.bold('WARN'), `[${type}] ${warning}`));
    }

    /**
     * @param {string} type
     * @param {import('discord.js').DiscordAPIError|import('discord.js').HTTPError|Error|unknown} error
     */
    async error(type, error) {
        const { logChannelId } = this.client.config;

        /**
         * @type {import('discord.js').TextChannel}
         */
        const errorLogChannel = await this.client.channels.fetch(logChannelId);

        if (!errorLogChannel) {
            return console.error(this.log(chalk.bgRed.bold('ERR!'), `[${type}] ${error}`));
        }

        const errorCode = 'code' in error
            ? error.code
            : 'N/A';
        const httpStatus = 'httpStatus' in error
            ? error.httpStatus
            : 'N/A';
        const reqData = 'requestData' in error
            ? error.requestData
            : { json: {} };
        const name = error.name || 'N/A';
        const stack = error.stack || error;
        const jsonString = JSON.stringify(reqData?.json, null, 2);

        if (typeof stack === 'string' && stack.length > 2048) {
            console.error(this.log(chalk.bgRed.bold('ERR!'), `${stack}`));
            return await errorLogChannel.send('An error occurred but was too long to send to Discord, check your console.');
        }

        console.error(error.stack);

        return await errorLogChannel.send({
            embeds: [
                {
                    title: 'An error occurred',
                    fields: [
                        {
                            name: 'Name',
                            value: name,
                            inline: true,
                        },
                        {
                            name: 'Code',
                            value: errorCode.toString(),
                            inline: true,
                        },
                        {
                            name: 'httpStatus',
                            value: httpStatus.toString(),
                            inline: true,
                        },
                        {
                            name: 'Name',
                            value: this.timestamps,
                            inline: true,
                        },
                        {
                            name: 'Request data',
                            value: codeBlock(jsonString.slice(0, 2048)),
                            inline: false,
                        },
                    ],
                    description: codeBlock(stack),
                },
            ],
        });

        // console.log(this.log(chalk.bgRed.bold('ERR!'), message));
        // this.logHook.send({
        //     content: [
        //         '**New Error Encounter**',
        //         '```',
        //         message.stack,
        //         '```',
        //     ].join('\n'),
        // });
    }

    /**
     * @param {string} type
     * @param {string} message
     */
    debug(type, message) {
        if (process.argv.includes('--debug')) {
            return console.log(this.log(chalk.magenta.bold('DBUG'), `[${type}] ${message}`));
        }
    }
}
