import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';

export class BaseHandler {
    /**
     * @param {import('../Client.js').Client} DiscordjsClient
     */
    constructor(DiscordjsClient) {
        this.client = DiscordjsClient;

        this.paths = {
            interactionCommands: path.join(cwd(), 'src', 'interactions'),
            messageCommands: path.join(cwd(), 'src', 'commands'),
            events: path.join(cwd(), 'src', 'events'),
            helpers: path.join(cwd(), 'src', 'helpers'),
        };
    }

    _loadFilesRecusrive(directory) {
        if (typeof directory !== 'string') {
            throw new TypeError('Directory must be of type string.');
        }

        // eslint-disable-next-line max-len
        const subDirectories = fs.readdirSync(directory, { withFileTypes: true });
        let resultantDirectoryPaths = [];

        subDirectories.map((subDirectory) => {
            if (subDirectory.isDirectory()) {
                resultantDirectoryPaths = [
                    ...resultantDirectoryPaths,
                    ...this._loadFilesRecusrive(
                        path.join(directory, subDirectory.name),
                    ),
                ];
            } else if (subDirectory.isFile() || subDirectory.name.endsWith('.js')) {
                resultantDirectoryPaths.push(
                    path.join(directory, subDirectory.name),
                );
            }
        });

        return resultantDirectoryPaths;
    }
}
