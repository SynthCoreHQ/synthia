import Josh from "@joshdb/core";
import JoshProvider from "@joshdb/json";
import path from "node:path";

export class Database extends Josh {
    constructor(name) {
        super({ name, provider: JoshProvider, providerOptions: { dataDir: path.join(process.cwd(), 'src', 'database', name) } })
    }
}