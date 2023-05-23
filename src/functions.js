import fs from 'fs';
import path from 'path';

export function getFiles(directory) {
    let res = [];
    const dirents = fs.readdirSync(directory, { withFileTypes: true });

    for (const dirent of dirents) {
        if (dirent.isDirectory()) {
            res = [...res, ...getFiles(path.join(directory, dirent.name))];
        } else if (dirent.name.endsWith('.js')) {
            res.push(path.join(directory, dirent.name));
        }
    }

    return res;
}
