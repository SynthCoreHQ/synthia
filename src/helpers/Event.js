import { Base } from "./base/Base.js";

export class Event extends Base {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = '';
        this.once = false;
        this.module = 'Discord';
    }

    async execute() {
        return this.discordClient.logger.error(this.constructor.name, 'Missing method: execute()')
    }
}