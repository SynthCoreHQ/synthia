import fs from 'node:fs';
import { Base } from "./base/Base.js";
import { Command } from "./Command.js";

export class FileHandler extends Base {
    constructor(discordClient, configuration) {
        super(discordClient, configuration);
    }

    async create_events() {
        const _files = this._findManyPaths(this.getPath('events'));

        for (const file of _files) {
            const _eventClass = await import(`file://${file}`).then((_) => _.default);
            const _event = new _eventClass(this.discordClient, this.configuration);

            this.discordClient.events.set(_event.name, _event);

            _event.once
                ? this.discordClient.once(_event.name, (...args) => _event.execute(this.discordClient, ...args))
                : this.discordClient.on(_event.name, (...args) => _event.execute(this.discordClient, ...args));
        }

        this.discordClient.logger.info(import.meta.url, `(${this.discordClient.events.size}) events loaded.`);
    }

    async create_commands() {
        const _files = this._findManyPaths(this.getPath('commands'));

        for (const file of _files) {
            const _commandClass = await import(`file://${file}`).then((_) => _.default);
            /**
             * @type {Command}
             */
            const _command = new _commandClass(this.discordClient, this.configuration);

            this.discordClient.commands.set(_command.name, _command);

            if (_command.aliases) {
                for (const alias of _command.aliases) {
                    this.discordClient.command_aliases.set(alias, _command.name);
                }
            }
        }

        this.discordClient.logger.info(import.meta.url, `(${this.discordClient.commands.size}) commands loaded.`);
    }

    async create_interactions() {
        const _files = this._findManyPaths(this.getPath('interactions'));

        for (const file of _files) {
            const _interactionClass = await import(`file://${file}`).then((_) => _.default);
            const _interaction = new _interactionClass(this.discordClient, this.configuration);

            if (_interaction.module === 'Music') return;

            this.discordClient.interactions.set(_interaction.name, _interaction);
        }

        this.discordClient.logger.info(import.meta.url, `(${this.discordClient.interactions.size}) interactions loaded.`);
    }
}