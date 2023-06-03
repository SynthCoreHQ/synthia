import chalk from 'chalk';

export class BaseEvent {
    /**
     * @param {import('../Client.js').Client} DiscordjsClient
     */
    constructor(DiscordjsClient) {
        this.client = DiscordjsClient;
        this.once = false;
    }

    async executeEvent() {
        throw new Error(`Class ${chalk.redBright(this.constructor.name)} doesn't have a ${chalk.yellowBright('executeEvent')} method.`);
    }
}
