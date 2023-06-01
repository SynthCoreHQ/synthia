import chalk from 'chalk';
import { WebhookClient } from 'discord.js';
import moment from 'moment';

export class Logger {
    constructor() {
        this.logHook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1113016614137380867/VDOeTnkvYh-KEjXn8MAhGoUpkoNzeknMNELCJ8tIzqdDyBaS4dpDfrkWlVQzkFAfLrJE' });
    }

    log(level, message) {
        if (!message) {
            throw new Error('No log message.');
        }

        const timestamp = moment().format('HH:mm:ss');
        const formattedString = `${level} ${chalk.dim('|')} ${chalk.gray.bold(timestamp)} ${chalk.dim('|')} ${chalk.white.bold(message)}`;

        return formattedString;
    }

    info(title, message) {
        console.log(this.log(chalk.blue.bold('INFO'), `[${title}] ${message}`));
    }
    warn(message) {
        console.log(this.log(chalk.yellow.bold('WARN'), message));
    }
    error(message) {
        console.log(this.log(chalk.bgRed.bold('ERR!'), message));
        this.logHook.send({
            content: [
                '**New Error Encounter**',
                '```',
                message.stack,
                '```',
            ].join('\n'),
        });
    }
    debug(message) {
        if (process.argv.includes('--debug')) {
            console.log(this.log(chalk.magenta.bold('DBUG'), `[${chalk.gray('Debugger')}] ${message}`));
        }
    }
}
