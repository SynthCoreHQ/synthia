import { Base } from "./base/Base.js";

export class Command extends Base {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);

        this.name = '';
        this.description = 'No description provided.';
        this.aliases = [];
        this.usage = '';
        this.module = 'Miscellaneous';
        this.cooldown = 5;
        this.for_developers = false;
        this.for_guilds = false;
        this.for_owners = false;
        this.is_disabled = false;
        this.required_permissions = [];
    }

    async execute() {
        return this.discordClient.logger.error(this.constructor.name, 'Missing method: execute()')
    }
}