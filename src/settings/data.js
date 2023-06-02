const data = {
    id: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_ID']
        : process.env['ALPHA_CLIENT_ID'],
    token: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_TOKEN']
        : process.env['ALPHA_CLIENT_TOKEN'],
    secret: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_SECRET']
        : process.env['ALPHA_CLIENT_SECRET'],
    icon: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_ICON']
        : process.env['ALPHA_CLIENT_ICON'],
    invitationUrl: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_INVITE_URL']
        : process.env['ALPHA_CLIENT_INVITE_URL'],
    presenceStatus: '/ping',
    guild: {
        id: process.env['GUILD_ID'] || '',
        inviteCode: process.env['GUILD_INVITE_CODE'] || '',
    },
    developmentGuildId: process.env['DEV_GUILD_ID'] || '',
    developers: ['953235785782534174'],
    commands: {
        globalPrefix: process.env['COMMAND_PREFIX'] || '',
        deployGlobally: true,
        embeds: {
            title: 'Synthia | {text}',
            footer: 'Made with 💖 by {text}',
            color: 0x2b2d31,
            aestheticColor: 0xab60ff /* 0xe4aefc */,
        },
    },
    voice: {
        '24/7': true,
        default: true,
        volume: 100,
    },
    server: {
        mode: true,
        port: process.env['SERVER_PORT'] || '',
    },
};

export { data };
