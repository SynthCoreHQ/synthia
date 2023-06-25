import Josh from '@joshdb/core';
import provider from '@joshdb/sqlite';

class Database {
    constructor() {
        this.guilds = new Josh({ name: 'guilds', provider });
        this.afk = new Josh({ name: 'afk', provider });
        this.blacklist = new Josh({ name: 'blacklist', provider });
        this.modules = new Josh({ name: 'modules', provider });
    }
}
