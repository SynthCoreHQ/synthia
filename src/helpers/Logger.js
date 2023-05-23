import chalk from 'chalk';
import moment from 'moment';

export class Logger {
    log(level, message) {
        if (!message) throw new Error('No log message.');

        const timestamp = moment().format('HH:mm:ss');
        const formattedString = `${level} ${chalk.dim('|')} ${chalk.gray.bold(timestamp)} ${chalk.dim(
            '|',
        )} ${chalk.white.bold(message)}`;

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
    }
    debug(message) {
        console.log(this.log(chalk.magenta.bold('DBUG'), `[${chalk.gray('Debugger')}] ${message}`));
    }
}
