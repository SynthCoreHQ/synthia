import { Guild, GuildMember, Role } from "discord.js";
import { Client } from "./client/Client.js";

export class Utility {
    /**
     * @param {Client} client
     * @param {import('../settings/config.js')} configuration
     */
    constructor(client, configuration) {
        this.client = client;
        this.configuration = configuration;
    }

    /**
     * @param {string} input
     */
    async resolve_user(input) {
        if (!input || typeof input !== 'string') throw new TypeError('Invalid or no input provided.');

        const pattern = /^(?:<@!?)?(\d+)>?$/;

        if (input.match(pattern))
            return await this.client.users.fetch(input.match(pattern)[1]).catch(() => null);
    }

    /**
     * @param {Guild} guild
     * @param {GuildMember} input
     */
    async resolve_member(guild, input) {
        if (!input || typeof input !== 'string') throw new TypeError('Invalid or no input provided.');

        const pattern = /^(?:<@!?)?(\d+)>?$/;

        if (input.match(pattern))
            return await guild.members.fetch({ user: input.match(pattern)[1] }).catch(() => null)
    }

    /**
     * @param {string} input
     */
    async resolve_channel(input) {
        if (!input || typeof input !== 'string') throw new TypeError('Invalid or no input provided.');

        const pattern = /^(?:<#)?(\d+)>?$/;

        if (input.match(pattern))
            return await this.client.channels.fetch(input.match(pattern)[1]).catch(() => null);
    }

    /**
     * @param {Guild} guild
     * @param {Role} input
     */
    async resolve_role(guild, input) {
        if (!input || typeof input !== 'string') throw new TypeError('Invalid or no input provided.');

        const pattern = /^(?:<@&)?(\d+)>?$/;

        if (input.match(pattern))
            return await guild.roles.fetch(input.match(pattern)[1]).catch(() => null);
    }

    /**
     * @param {Guild} guild
     * @param {{ target: discordJs.GuildMember, type: 'timeout' | 'kick' | 'ban' | 'remove_roles', reason: string, time: number }} options
     */
    async punish(guild, options) {
        const member = await this.resolve_member(guild, options.target.id);

        if (!member.manageable || member.roles.highest.position >= guild.members.me.roles.highest.position) return false;
        if (options.type === 'kick' && !member.kickable) return false;
        if (options.type === 'ban' && !member.bannable) return false;

        if (options.type === 'timeout')
            await member.timeout(options.time * 60000 || 60000, options.reason).catch(() => null);
        else if (options.type === 'kick')
            await member.kick(options.reason).catch(() => null);
        else if (options.type === 'ban')
            await member.ban({ reason: options.reason }).catch(() => null);
        else if (options.type === 'remove_roles')
            await member.roles.set([], options.reason).catch(() => null);

        return true;
    }
}