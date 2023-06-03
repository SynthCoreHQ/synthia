import { ApplicationCommandType } from 'discord.js';

export default class TestCommand {
    constructor(DiscordjsClient) {
        this.client = DiscordjsClient;

        this.name = 'test';
        this.description = 'Just a private test command for development purposes.';
        this.type = ApplicationCommandType.ChatInput;
        this.options = [];
    }

    executeInteractionCommand(client, interaction) {
        return client, interaction;
    }
}
