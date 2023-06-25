import fs from "node:fs";
import path from "node:path";

export class Base {
    /**
     * @param {import('../client/Client.js').Client} discordClient 
     * @param {import('../../settings/config.js')} configuration
     */
    constructor(discordClient, configuration) {
        this.discordClient = discordClient;
        this.configuration = configuration;
    }

    getPath(directory) {
        return path.join(process.cwd(), 'src', directory)
    }

    _findManyPaths(directory) {
        let _paths = [];
        const _subDirectories = fs.readdirSync(directory, { withFileTypes: true });

        _subDirectories.map((_subDirectory) => {
            if (_subDirectory.isDirectory()) {
                _paths = [..._paths, ...this._findManyPaths(path.join(directory, _subDirectory.name))];
            } else if (_subDirectory.isFile() && _subDirectory.name.endsWith('.js')) {
                _paths.push(path.join(directory, _subDirectory.name));
            }
        });

        return _paths;
    }
}