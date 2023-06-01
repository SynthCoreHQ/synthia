export class InteractionCommand {
    /**
     * InteractionComman class constructor.
     * @param {import('../Client.js').Client} DiscordjsClient
     * @param {{ name: string }} param1
     */
    constructor(DiscordjsClient, { name, description }) {
        this.client = DiscordjsClient;
        this.name = name;
        this.description = description;
    }

    /**
     * @param {this.client} client
     * @param  {...any} args
     */
    run(client, ...args) {
        throw new Error("Method 'run' not found.");
    }
}
